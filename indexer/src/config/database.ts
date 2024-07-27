const fs = require("fs");

import { Sequelize, Transaction } from "sequelize";

export const sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USERNAME as string,
  process.env.DB_PASSWORD as string,
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "postgres",
    pool: {
      max: 20,
      min: 1,
      acquire: 60000,
      idle: 10000,
    },
    retry: {
      max: 10,
    },
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: true,
        ca: fs.readFileSync(__dirname + "/global-bundle.pem").toString(),
      },
    },
    isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
  }
);

export async function initializeDatabase(): Promise<void> {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    throw error;
  }

  try {
    await sequelize.sync({ force: false });

    console.log("Tables have been synchronized successfully.");

    // --------------------------------
    // Balances
    // --------------------------------

    // Create the update_balances function
    await sequelize.query(`
  CREATE OR REPLACE FUNCTION update_balances() RETURNS TRIGGER AS $$
  DECLARE
      sender_balance numeric;
      recipient_balance numeric;
      contract_id int4;
  BEGIN
      -- Retrieve contractId
      SELECT id INTO contract_id
      FROM public."Contracts"
      WHERE "network" = NEW.network
        AND "chainId" = NEW."chainId"
        AND "module" = NEW.modulename
        AND "tokenId" IS NOT DISTINCT FROM NEW."tokenId"
      LIMIT 1;

      -- Update sender balance
      SELECT "balance" INTO sender_balance
      FROM public."Balances"
      WHERE "account" = NEW.from_acct
        AND "chainId" = NEW."chainId"
        AND "qualname" = NEW.modulename
        AND "network" = NEW.network
        AND "tokenId" IS NOT DISTINCT FROM NEW."tokenId"
      FOR UPDATE;

      IF FOUND THEN
          UPDATE public."Balances"
          SET balance = sender_balance - NEW.amount,
              "contractId" = contract_id
          WHERE "account" = NEW.from_acct
            AND "chainId" = NEW."chainId"
            AND "qualname" = NEW.modulename
            AND "network" = NEW.network
            AND "tokenId" IS NOT DISTINCT FROM NEW."tokenId";
      ELSE
          INSERT INTO public."Balances" (account, "chainId", balance, module, qualname, "tokenId", network, "createdAt", "updatedAt", "hasTokenId", "contractId")
          VALUES (NEW.from_acct, NEW."chainId", -NEW.amount, NEW.modulename, NEW.modulename, NEW."tokenId", NEW.network, NEW."createdAt", NEW."updatedAt", 
          CASE WHEN NEW."tokenId" IS NOT NULL THEN true ELSE false END, contract_id);
      END IF;

      -- Update recipient balance
      SELECT balance INTO recipient_balance
      FROM public."Balances"
      WHERE "account" = NEW.to_acct
        AND "chainId" = NEW."chainId"
        AND "qualname" = NEW.modulename
        AND "network" = NEW.network
        AND "tokenId" IS NOT DISTINCT FROM NEW."tokenId"
      FOR UPDATE;

      IF FOUND THEN
          UPDATE public."Balances"
          SET balance = recipient_balance + NEW.amount,
              "contractId" = contract_id
          WHERE "account" = NEW.to_acct
            AND "chainId" = NEW."chainId"
            AND "qualname" = NEW.modulename
            AND "network" = NEW.network
            AND "tokenId" IS NOT DISTINCT FROM NEW."tokenId";
      ELSE
          INSERT INTO public."Balances" (account, "chainId", balance, module, qualname, "tokenId", network, "createdAt", "updatedAt", "hasTokenId", "contractId")
          VALUES (NEW.to_acct, NEW."chainId", NEW.amount, NEW.modulename, NEW.modulename, NEW."tokenId", NEW.network, NEW."createdAt", NEW."updatedAt", 
          CASE WHEN NEW."tokenId" IS NOT NULL THEN true ELSE false END, contract_id);
      END IF;

      RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;
`);

    // Create the trigger
    await sequelize.query(`
CREATE OR REPLACE TRIGGER update_balances_trigger
AFTER UPDATE ON public."Transfers"
FOR EACH ROW
WHEN (NEW."canonical" = TRUE)
EXECUTE FUNCTION update_balances();
`);

    // Create the balances table
    await sequelize.query(`
  CREATE TABLE IF NOT EXISTS public."Balances" (
    id serial4 NOT NULL,
    account varchar(255) NOT NULL,
    "chainId" int4 NOT NULL,
    balance numeric(50) DEFAULT 0 NOT NULL,
    "module" varchar(255) NOT NULL,
    qualname varchar(255) NOT NULL,
    "tokenId" varchar(255) NULL,
    network varchar(255) NOT NULL,
    "hasTokenId" boolean DEFAULT false NOT NULL,
    "contractId" int4 NULL,
    "createdAt" timestamptz NOT NULL,
    "updatedAt" timestamptz NOT NULL,
    CONSTRAINT "Balances_pkey" PRIMARY KEY (id)
  );
  
  DO $$
  BEGIN
      IF NOT EXISTS (
          SELECT 1
          FROM pg_indexes
          WHERE schemaname = 'public'
            AND tablename = 'Balances'
            AND indexname = 'balance_unique_constraint'
      ) THEN
          CREATE UNIQUE INDEX balance_unique_constraint ON public."Balances" USING btree (network, "chainId", account, qualname, "tokenId");
      END IF;
  END $$;
`);

    // --------------------------------
    // Missing blocks
    // --------------------------------

    // Create missing blocks view
    await sequelize.query(`
CREATE OR REPLACE VIEW missing_block_ranges AS
WITH missing_ranges AS (
  SELECT DISTINCT 
    "chainId", 
    "chainwebVersion", 
    height + 1 AS missing_start, 
    next_height - 1 AS missing_end
  FROM (
    SELECT 
      "chainId", 
      "chainwebVersion", 
      height, 
      LEAD(height) OVER (PARTITION BY "chainId", "chainwebVersion" ORDER BY height) AS next_height
    FROM "Blocks"
  ) AS t
  WHERE next_height IS NOT NULL AND next_height <> height + 1
)
SELECT DISTINCT 
  "chainId", 
  "chainwebVersion", 
  missing_start AS from_height, 
  missing_end AS to_height, 
  (missing_end - missing_start) AS diff
FROM missing_ranges
where (missing_end - missing_start) >= 0
ORDER BY "chainId", "chainwebVersion", missing_start ASC;
`);

    // --------------------------------
    // Orphan blocks
    // --------------------------------

    // Create the check canonical function
    await sequelize.query(`
CREATE OR REPLACE FUNCTION public.check_canonical(new_hash character varying, target_height integer, chain_id integer, chainweb_version character varying, current_depth integer)
  RETURNS boolean
  LANGUAGE plpgsql
  AS $function$
  DECLARE
      parent_block RECORD;
  BEGIN
      -- Get the parent of the new block
      SELECT * INTO parent_block 
      FROM public."Blocks" 
      WHERE hash = (SELECT parent FROM public."Blocks" WHERE hash = new_hash AND "chainId" = chain_id AND "chainwebVersion" = chainweb_version);

      -- Base case: If parent block is not found
      IF parent_block IS NULL THEN
          RETURN FALSE;
      ELSIF parent_block.height = target_height THEN
          -- Update the parent block to be canonical if height matches
          UPDATE public."Blocks" 
          SET canonical = TRUE 
          WHERE hash = parent_block.hash;
          RETURN TRUE;
      ELSE
          -- Recursive case: Check the parent
          IF current_depth > 0 THEN
              RETURN check_canonical(parent_block.hash, target_height, chain_id, chainweb_version, current_depth - 1);
          ELSE
              RETURN FALSE;
          END IF;
      END IF;
  END;
  $function$
  ;`);

    // Create the check backward orphans function
    await sequelize.query(`
CREATE OR REPLACE FUNCTION public.check_backward_orphans()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
    recent_blocks RECORD;
    previous_block RECORD;
    first_block RECORD;
    block_count INT := 0;
    depth CONSTANT INT := 10; -- Default the depth constant
    buffer CONSTANT INT := 5; -- Number of heights to buffer, because some blocks can arrive out of order
    no_duplicates BOOLEAN := TRUE;
BEGIN
    -- Check the last 'depth' blocks
    FOR recent_blocks IN 
        SELECT * FROM public."Blocks"
        WHERE height >= ((NEW.height - buffer) - depth) AND height < (NEW.height - buffer)
	        AND "chainId" = NEW."chainId"
        	AND "chainwebVersion" = NEW."chainwebVersion"
        ORDER BY height DESC
    LOOP
        -- Set the first block
        IF block_count = 0 THEN
            first_block := recent_blocks;
        END IF;
	    
	    IF previous_block IS NOT NULL THEN
	    -- Check for non-duplicated block
		    IF previous_block.height = recent_blocks.height 
		    	AND previous_block.canonical = FALSE
		    	AND recent_blocks.canonical = FALSE THEN
			  	-- duplicated block
	            PERFORM check_canonical(first_block.hash, recent_blocks.height, recent_blocks."chainId", recent_blocks."chainwebVersion", depth);
	            no_duplicates := FALSE;
	        END IF;
	    END IF;
	   
	    -- Check for gaps
        IF recent_blocks.height <> (NEW.height - buffer) - block_count - 1 THEN
            -- If there are gaps, do not change canonical status
            RETURN NEW;
        END IF;

        previous_block := recent_blocks;
        block_count := block_count + 1;
    END LOOP;

    -- If there are no gaps and no duplicates, update the last block to canonical
    IF no_duplicates AND previous_block.hash IS NOT NULL THEN
        UPDATE public."Blocks"
        SET canonical = TRUE
        WHERE hash = previous_block.hash
        AND "chainId" = NEW."chainId" 
       	AND "chainwebVersion" = NEW."chainwebVersion";
    END IF;

    RETURN NEW;
END;
$function$
;`);


    await sequelize.query(`
CREATE OR REPLACE FUNCTION public.check_upward_orphans()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
    recent_blocks RECORD;
    previous_block RECORD;
    first_block RECORD;
    block_count INT := 0;
    depth CONSTANT INT := 10; -- Default the depth constant
    buffer CONSTANT INT := 5; -- Number of heights to buffer, because some blocks can arrive out of order
    no_duplicates BOOLEAN := TRUE;
    total_rows INT := 0;
BEGIN
    -- Calculate the total number of rows in the range
    SELECT count(*) INTO total_rows FROM public."Blocks"
    WHERE height >= NEW.height AND height < ((NEW.height + buffer) + depth)
        AND "chainId" = NEW."chainId"
        AND "chainwebVersion" = NEW."chainwebVersion";

    -- No sufficient blocks to validate
    IF total_rows < (buffer + depth) THEN
        RETURN NEW;
    END IF;

    -- Check the last 'depth' blocks
    FOR recent_blocks IN 
        SELECT * FROM public."Blocks"
        WHERE height >= NEW.height AND height <((NEW.height + buffer) + depth)
            AND "chainId" = NEW."chainId"
            AND "chainwebVersion" = NEW."chainwebVersion"
        ORDER BY height DESC
    LOOP
        -- Set the first block
        IF block_count = 0 THEN
            first_block := recent_blocks;
        END IF;

        IF previous_block IS NOT NULL THEN
            -- Check for non-duplicated block
            IF previous_block.height = recent_blocks.height 
                AND previous_block.canonical = FALSE
                AND recent_blocks.canonical = FALSE THEN
                -- duplicated block
                PERFORM check_canonical(first_block.hash, recent_blocks.height, recent_blocks."chainId", recent_blocks."chainwebVersion", depth);
                no_duplicates := FALSE;
            END IF;
        END IF;

        -- Check for gaps
        IF recent_blocks.height <> (NEW.height + buffer) - block_count - 1 THEN
            -- If there are gaps, do not change canonical status
            RETURN NEW;
        END IF;

        previous_block := recent_blocks;
        block_count := block_count + 1;
    END LOOP;
   
    -- If there are no gaps and no duplicates, update the last block to canonical
    IF no_duplicates THEN
        UPDATE public."Blocks"
        SET canonical = TRUE
        WHERE hash = NEW.hash
        AND "chainId" = NEW."chainId" 
        AND "chainwebVersion" = NEW."chainwebVersion";
    END IF;

    RETURN NEW;
END;
$function$
;`);

    // Propagate canonical trigger to transactions
    await sequelize.query(`
CREATE OR REPLACE FUNCTION blocks_propagate_canonical_function()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public."Transactions"
    SET canonical = NEW.canonical
    WHERE "blockId" = NEW.id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;`);

    await sequelize.query(`
CREATE OR REPLACE TRIGGER blocks_propagate_canonical
AFTER UPDATE ON public."Blocks"
FOR EACH ROW
EXECUTE FUNCTION blocks_propagate_canonical_function();`);

    // Propagate canonical trigger to transfers
    await sequelize.query(`
CREATE OR REPLACE FUNCTION transactions_propagate_canonical_function()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public."Transfers"
    SET canonical = NEW.canonical
    WHERE "transactionId" = NEW.id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;`);

    await sequelize.query(`
CREATE OR REPLACE TRIGGER transactions_propagate_canonical
AFTER UPDATE ON public."Transactions"
FOR EACH ROW
EXECUTE FUNCTION transactions_propagate_canonical_function();`);

    // Create orphan blocks trigger
    await sequelize.query(`
CREATE OR REPLACE TRIGGER check_orphan_blocks_backward
AFTER INSERT ON public."Blocks" 
FOR EACH ROW
EXECUTE FUNCTION check_backward_orphans();`);

await sequelize.query(`
CREATE OR REPLACE TRIGGER check_orphan_blocks_upward
AFTER INSERT ON public."Blocks" 
FOR EACH ROW
EXECUTE FUNCTION check_upward_orphans();`);

    console.log("Trigger function and trigger have been created successfully.");
  } catch (error) {
    console.error("Unable to create tables:", error);
    throw error;
  }
}

export async function closeDatabase(): Promise<void> {
  try {
    await sequelize.close();
    console.log("Connection has been closed successfully.");
  } catch (error) {
    console.error("Unable to close the connection:", error);
    throw error;
  }
}
