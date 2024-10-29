-- DROP SCHEMA public;

-- CREATE SCHEMA public AUTHORIZATION pg_database_owner;

-- DROP TYPE public."enum_SyncErrors_source";

CREATE TYPE public."enum_SyncErrors_source" AS ENUM (
	's3',
	'api');

-- DROP TYPE public."enum_SyncStatuses_source";

CREATE TYPE public."enum_SyncStatuses_source" AS ENUM (
	's3',
	'api',
	'backfill',
	'streaming');

-- DROP SEQUENCE public."Balances_id_seq";

CREATE SEQUENCE public."Balances_id_seq"
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public."Blocks_id_seq";

CREATE SEQUENCE public."Blocks_id_seq"
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public."Contracts_id_seq";

CREATE SEQUENCE public."Contracts_id_seq"
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public."Events_id_seq";

CREATE SEQUENCE public."Events_id_seq"
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public."SyncErrors_id_seq";

CREATE SEQUENCE public."SyncErrors_id_seq"
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public."SyncStatuses_id_seq";

CREATE SEQUENCE public."SyncStatuses_id_seq"
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public."Transactions_id_seq";

CREATE SEQUENCE public."Transactions_id_seq"
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public."Transfers_id_seq";

CREATE SEQUENCE public."Transfers_id_seq"
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;-- public."Balances" definition

-- Drop table

-- DROP TABLE public."Balances";

CREATE TABLE public."Balances" (
	id serial4 NOT NULL,
	account varchar(255) NOT NULL,
	"chainId" int4 NOT NULL,
	balance numeric(50) DEFAULT 0 NOT NULL,
	"module" varchar(255) NOT NULL,
	qualname varchar(255) NOT NULL,
	"tokenId" varchar(255) NULL,
	network varchar(255) NOT NULL,
	"hasTokenId" bool DEFAULT false NOT NULL,
	"contractId" int4 NULL,
	"createdAt" timestamptz NOT NULL,
	"updatedAt" timestamptz NOT NULL,
	"transactionsCount" int8 NULL,
	CONSTRAINT "Balances_pkey" PRIMARY KEY (id)
);
CREATE UNIQUE INDEX balance_unique_constraint ON public."Balances" USING btree (network, "chainId", account, qualname, "tokenId");

-- public."Blocks" definition

-- Drop table

-- DROP TABLE public."Blocks";

CREATE TABLE public."Blocks" (
	id serial4 NOT NULL,
	nonce varchar(255) NULL,
	"creationTime" int8 NULL,
	parent varchar(255) NULL,
	adjacents jsonb NULL,
	target varchar(255) NULL,
	"payloadHash" varchar(255) NULL,
	"chainId" int4 NULL,
	weight varchar(255) NULL,
	height int4 NULL,
	"chainwebVersion" varchar(255) NULL,
	"epochStart" int8 NULL,
	"featureFlags" int4 NULL,
	hash varchar(255) NULL,
	"minerData" jsonb NULL,
	"transactionsHash" varchar(255) NULL,
	"outputsHash" varchar(255) NULL,
	coinbase jsonb NULL,
	canonical bool NULL,
	"createdAt" timestamptz NOT NULL,
	"updatedAt" timestamptz NOT NULL,
	"transactionsCount" int8 NULL,
	CONSTRAINT "Blocks_pkey" PRIMARY KEY (id)
);
CREATE UNIQUE INDEX "blocks_chainwebVersion_chainid_hash_unique_idx" ON public."Blocks" USING btree ("chainwebVersion", "chainId", hash);



-- public."Contracts" definition

-- Drop table

-- DROP TABLE public."Contracts";

CREATE TABLE public."Contracts" (
	id serial4 NOT NULL,
	network varchar(255) NOT NULL,
	"chainId" int4 NOT NULL,
	"type" varchar(255) NOT NULL,
	"module" varchar(255) NOT NULL,
	metadata json NULL,
	"tokenId" varchar(255) NULL,
	"precision" int4 NULL,
	"createdAt" timestamptz NOT NULL,
	"updatedAt" timestamptz NOT NULL,
	CONSTRAINT "Contracts_pkey" PRIMARY KEY (id)
);
CREATE UNIQUE INDEX contract_unique_constraint ON public."Contracts" USING btree (network, "chainId", module, "tokenId");


-- public."SyncErrors" definition

-- Drop table

-- DROP TABLE public."SyncErrors";

CREATE TABLE public."SyncErrors" (
	id serial4 NOT NULL,
	network varchar(255) NULL,
	"chainId" int4 NULL,
	"fromHeight" int4 NULL,
	"toHeight" int4 NULL,
	"payloadHash" varchar(255) NULL,
	endpoint varchar(255) NULL,
	"data" jsonb NULL,
	"source" public."enum_SyncErrors_source" NULL,
	"createdAt" timestamptz NOT NULL,
	"updatedAt" timestamptz NOT NULL,
	CONSTRAINT "SyncErrors_pkey" PRIMARY KEY (id)
);


-- public."SyncStatuses" definition

-- Drop table

-- DROP TABLE public."SyncStatuses";

CREATE TABLE public."SyncStatuses" (
	id serial4 NOT NULL,
	network varchar(255) NULL,
	"chainId" int4 NULL,
	"fromHeight" int4 NULL,
	"toHeight" int4 NULL,
	"key" varchar(255) NULL,
	prefix varchar(255) NULL,
	"source" public."enum_SyncStatuses_source" NULL,
	"createdAt" timestamptz NOT NULL,
	"updatedAt" timestamptz NOT NULL,
	CONSTRAINT "SyncStatuses_pkey" PRIMARY KEY (id)
);


-- public."Transactions" definition

-- Drop table

-- DROP TABLE public."Transactions";

CREATE TABLE public."Transactions" (
	id serial4 NOT NULL,
	"blockId" int4 NULL,
	"payloadHash" varchar(255) NULL,
	"chainId" int4 NULL,
	code jsonb NULL,
	continuation jsonb NULL,
	creationtime varchar(255) NULL,
	"data" jsonb NULL,
	gas varchar(255) NULL,
	gaslimit varchar(255) NULL,
	gasprice varchar(255) NULL,
	hash varchar(255) NULL,
	"result" jsonb NULL,
	logs jsonb NULL,
	metadata jsonb NULL,
	nonce varchar(255) NULL,
	num_events int4 NULL,
	pactid varchar(255) NULL,
	proof varchar(255) NULL,
	requestkey varchar(255) NULL,
	"rollback" bool NULL,
	sender varchar(255) NULL,
	sigs jsonb NULL,
	step int4 NULL,
	ttl varchar(255) NULL,
	txid varchar(255) NULL,
	canonical bool NULL,
	"createdAt" timestamptz NOT NULL,
	"updatedAt" timestamptz NOT NULL,
	CONSTRAINT "Transactions_pkey" PRIMARY KEY (id),
	CONSTRAINT "Transactions_blockId_fkey" FOREIGN KEY ("blockId") REFERENCES public."Blocks"(id) ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE INDEX "transactions_blockId_idx" ON public."Transactions" USING btree ("blockId");
CREATE INDEX transactions_requestkey_idx ON public."Transactions" USING btree (requestkey);

-- DROP FUNCTION public.transactions_propagate_canonical_function();

CREATE OR REPLACE FUNCTION public.transactions_propagate_canonical_function()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    UPDATE public."Transfers"
    SET canonical = NEW.canonical
    WHERE "transactionId" = NEW.id;
    RETURN NEW;
END;
$function$
;

-- Table Triggers

create trigger transactions_propagate_canonical after
update
    on
    public."Transactions" for each row execute function transactions_propagate_canonical_function();


-- public."Transfers" definition

-- Drop table

-- DROP TABLE public."Transfers";

CREATE TABLE public."Transfers" (
	id serial4 NOT NULL,
	"transactionId" int4 NULL,
	"type" varchar(255) NOT NULL,
	amount numeric NOT NULL,
	"payloadHash" varchar(255) NOT NULL,
	"chainId" int4 NOT NULL,
	from_acct varchar(255) NOT NULL,
	modulehash varchar(255) NOT NULL,
	modulename varchar(255) NOT NULL,
	requestkey varchar(255) NOT NULL,
	to_acct varchar(255) NOT NULL,
	network varchar(255) NOT NULL,
	"hasTokenId" bool NULL,
	"tokenId" varchar(255) NULL,
	"contractId" int4 NULL,
	canonical bool NULL,
	"createdAt" timestamptz NOT NULL,
	"updatedAt" timestamptz NOT NULL,
	CONSTRAINT "Transfers_pkey" PRIMARY KEY (id),
	CONSTRAINT "Transfers_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES public."Contracts"(id) ON DELETE SET NULL ON UPDATE CASCADE,
	CONSTRAINT "Transfers_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES public."Transactions"(id) ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE INDEX transfers_transactionid_idx ON public."Transfers" USING btree ("transactionId");
CREATE INDEX transfers_type_idx ON public."Transfers" USING btree (type);

-- DROP FUNCTION public.update_balances();

CREATE OR REPLACE FUNCTION public.update_balances()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
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
  $function$
;

-- Table Triggers

create trigger update_balances_trigger after
update
    on
    public."Transfers" for each row
    when ((new.canonical = true)) execute function update_balances();


-- public."Events" definition

-- Drop table

-- DROP TABLE public."Events";

CREATE TABLE public."Events" (
	id serial4 NOT NULL,
	"transactionId" int4 NULL,
	"payloadHash" varchar(255) NOT NULL,
	"chainId" int4 NOT NULL,
	"module" varchar(255) NOT NULL,
	modulehash varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	params jsonb NOT NULL,
	paramtext jsonb NOT NULL,
	qualname varchar(255) NOT NULL,
	requestkey varchar(255) NOT NULL,
	"createdAt" timestamptz NOT NULL,
	"updatedAt" timestamptz NOT NULL,
	CONSTRAINT "Events_pkey" PRIMARY KEY (id),
	CONSTRAINT "Events_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES public."Transactions"(id) ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE INDEX events_transactionid_idx ON public."Events" USING btree ("transactionId");


-- public.missing_block_ranges source

CREATE OR REPLACE VIEW public.missing_block_ranges
AS WITH missing_ranges AS (
         SELECT DISTINCT t."chainId",
            t."chainwebVersion",
            t.height + 1 AS missing_start,
            t.next_height - 1 AS missing_end
           FROM ( SELECT "Blocks"."chainId",
                    "Blocks"."chainwebVersion",
                    "Blocks".height,
                    lead("Blocks".height) OVER (PARTITION BY "Blocks"."chainId", "Blocks"."chainwebVersion" ORDER BY "Blocks".height) AS next_height
                   FROM "Blocks") t
          WHERE t.next_height IS NOT NULL AND t.next_height <> (t.height + 1)
        )
 SELECT DISTINCT missing_ranges."chainId",
    missing_ranges."chainwebVersion",
    missing_ranges.missing_start AS from_height,
    missing_ranges.missing_end AS to_height,
    missing_ranges.missing_end - missing_ranges.missing_start AS diff
   FROM missing_ranges
  WHERE (missing_ranges.missing_end - missing_ranges.missing_start) >= 0
  ORDER BY missing_ranges."chainId", missing_ranges."chainwebVersion", missing_ranges.missing_start;



-- DROP FUNCTION public.blocks_propagate_canonical_function();

CREATE OR REPLACE FUNCTION public.blocks_propagate_canonical_function()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    UPDATE public."Transactions"
    SET canonical = NEW.canonical
    WHERE "blockId" = NEW.id;
    RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.check_backward_orphans();

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
BEGIN
    -- Check the last 'depth' blocks
    FOR recent_blocks IN 
        SELECT * FROM public."Blocks"
        WHERE height >= ((NEW.height - buffer) - depth) AND height < (NEW.height - buffer)
	        AND "chainId" = NEW."chainId"
        	AND "chainwebVersion" = NEW."chainwebVersion"
            AND (canonical IS NULL OR canonical = TRUE)
        ORDER BY height DESC
		FOR UPDATE
    LOOP
        -- Set the first block
        IF block_count = 0 THEN
            first_block := recent_blocks;
        END IF;
	    
        IF previous_block IS NULL THEN
	    ELSE
	    -- Check for non-duplicated block
		    IF previous_block.height = recent_blocks.height
		    	AND (recent_blocks.canonical = FALSE OR recent_blocks.canonical IS NULL) THEN
	            PERFORM check_canonical(first_block.hash, recent_blocks.height, recent_blocks."chainId", recent_blocks."chainwebVersion", depth);
            ELSE
                UPDATE public."Blocks"
                SET canonical = TRUE
                WHERE hash = recent_blocks.hash
                AND "chainId" = NEW."chainId" 
                AND "chainwebVersion" = NEW."chainwebVersion";
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

    IF previous_block IS NULL THEN
        RETURN NEW;
    END IF;

    RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.check_canonical(varchar, int4, int4, varchar, int4);

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
      WHERE hash = (SELECT parent FROM public."Blocks" WHERE hash = new_hash AND "chainId" = chain_id AND "chainwebVersion" = chainweb_version)
	  FOR UPDATE;

      -- Base case: If parent block is not found
      IF parent_block IS NULL THEN
          RETURN FALSE;
      ELSIF parent_block.height = target_height THEN
          -- Update the parent block to be canonical if height matches
          UPDATE public."Blocks" 
          SET canonical = TRUE 
          WHERE hash = parent_block.hash;

          UPDATE public."Blocks"
          SET canonical = FALSE
          WHERE height = target_height
            AND "chainId" = chain_id
            AND "chainwebVersion" = chainweb_version
            AND hash != parent_block.hash;
        
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
;

-- DROP FUNCTION public.check_upward_orphans();

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
;



-- Table Triggers

create trigger check_orphan_blocks_upward after
insert
    on
    public."Blocks" for each row execute function check_upward_orphans();
create trigger blocks_propagate_canonical after
update
    on
    public."Blocks" for each row execute function blocks_propagate_canonical_function();
create trigger check_orphan_blocks_backward after
insert
    on
    public."Blocks" for each row execute function check_backward_orphans();


INSERT INTO public."Blocks" (nonce,"creationTime",parent,adjacents,target,"payloadHash","chainId",weight,height,"chainwebVersion","epochStart","featureFlags",hash,"minerData","transactionsHash","outputsHash",coinbase,canonical,"createdAt","updatedAt") VALUES
	 ('626483972916868317',1723325173023957,'fE9qVoOSCO1-eebybP3jczBeppygjQJ7GjchA3-FP_A','{"6": "DGumvoBrUaJCqQkKI7Lr1ZrYIBaJRXGbQtQDJ8LpWtU", "11": "TdH3a1-XmU2vQ6OxwDlZlsf5kEZBYI4ftmoroV2HVYI", "16": "6VkQUO1gxpgdWF0pGkVwWc4H4dEy2HQBtOS1iod2nB0"}','jVwwSVNSFOea-OCLJty6HJcrg2xbX-v8EwAAAAAAAAA','GX3_cBSgGJ9TsXF9KtcBJlrviFpzU8Wa98vMMCzBjxY',1,'afVbBWlJoQEpWgEAAAAAAAAAAAAAAAAAAAAAAAAAAAA',5028889,'mainnet01',1723323640709427,0,'eBvfXrgxVpOV2afYXYmtuxRPt4ORMOmRATFW3Zw7wqM','{"account": "99cb7008d7d70c94f138cc366a825f0d9c83a8a2f4ba82c86c666e0ab6fecf3a", "predicate": "keys-all", "public-keys": ["99cb7008d7d70c94f138cc366a825f0d9c83a8a2f4ba82c86c666e0ab6fecf3a"]}','g5dDASOa4cK0nAVmwkvXg-neTRAKG1hwfwRfbQyqpxU','cx4b_PSaS5ba2VWjc4cFDvZXmR7iDV6NUtMVehTLvOQ','{"gas": 0, "logs": "JmixHgsUA5ElaWv5djJ9bBssFUEnejhH3Qipwiak9pM", "txId": 11365201, "events": [{"name": "TRANSFER", "module": {"name": "coin", "namespace": null}, "params": ["", "99cb7008d7d70c94f138cc366a825f0d9c83a8a2f4ba82c86c666e0ab6fecf3a", 0.9773645], "moduleHash": "klFkrLfpyLW-M3xjVPSdqXEMgxPPJibRt_D6qiBws6s"}], "reqKey": "ImZFOXFWb09TQ08xLWVlYnliUDNqY3pCZXBweWdqUUo3R2pjaEEzLUZQX0Ei", "result": {"data": "Write succeeded", "status": "success"}, "metaData": null, "continuation": null}',NULL,'2024-08-10 18:26:20.854-03','2024-08-10 18:26:20.854-03'),
	 ('4242324485129661052',1723325225956029,'eBvfXrgxVpOV2afYXYmtuxRPt4ORMOmRATFW3Zw7wqM','{"6": "I5gFo6kj0gYzEqANK831Q1pdq8ikVfpsGxM8aPurFZk", "11": "4pplWhAIvsLfuyoKNCU7-mwELu8j1XZYsigZmilsu7Y", "16": "5JQD7tKXkiiRWp8GKMBFJeQdReZaI_j64B4FcXWrvs8"}','jVwwSVNSFOea-OCLJty6HJcrg2xbX-v8EwAAAAAAAAA','ESxx86aVCyagRjljZid6XpY86gvzEb7ibCHI90z7v54',1,'n8BBVzwPcA4pWgEAAAAAAAAAAAAAAAAAAAAAAAAAAAA',5028890,'mainnet01',1723323640709427,0,'Lg7FyIXcmNqkAO_McvCjIaAIOHTlUOvHeaVrrbX_19k','{"account": "k:e7f7130f359fb1f8c87873bf858a0e9cbc3c1059f62ae715ec72e760b055e9f3", "predicate": "keys-all", "public-keys": ["e7f7130f359fb1f8c87873bf858a0e9cbc3c1059f62ae715ec72e760b055e9f3"]}','Tx9vcMY9-GlhQpFG-9xU1hjnwyMh0UJS0Rlz0kF8RPE','1Ov-Snw37UmxGi1W2euMr6Bkfgn3CEhyFSKA0YnwWmE','{"gas": 0, "logs": "2ms6xZJ2iZBGt41QPvOvmoMiYCekrK2zOfur0yOnFR4", "txId": 11365202, "events": [{"name": "TRANSFER", "module": {"name": "coin", "namespace": null}, "params": ["", "k:e7f7130f359fb1f8c87873bf858a0e9cbc3c1059f62ae715ec72e760b055e9f3", 0.9773645], "moduleHash": "klFkrLfpyLW-M3xjVPSdqXEMgxPPJibRt_D6qiBws6s"}], "reqKey": "ImVCdmZYcmd4VnBPVjJhZllYWW10dXhSUHQ0T1JNT21SQVRGVzNadzd3cU0i", "result": {"data": "Write succeeded", "status": "success"}, "metaData": null, "continuation": null}',NULL,'2024-08-10 18:27:13.433-03','2024-08-10 18:27:13.433-03'),
	 ('2464920242540773718',1723325234078858,'Lg7FyIXcmNqkAO_McvCjIaAIOHTlUOvHeaVrrbX_19k','{"6": "C37BV6r-PVqIbfIAH5m54cCKI-NiG-z2YInwBu2gQ3A", "11": "sDMLuhdwFgnnc4pIMjtDP8aIQu84Q4mB_iXiVn4E12E", "16": "T6V983Vesy5HqIcHd4Oj4fhRW8b_sxHFt9zpNnkJ6cI"}','jVwwSVNSFOea-OCLJty6HJcrg2xbX-v8EwAAAAAAAAA','6ePe8npmUcPNxhVFpz6cxkqm-Q9PVNcZO7SBDaEgFys',1,'1YsnqQ_VPhspWgEAAAAAAAAAAAAAAAAAAAAAAAAAAAA',5028891,'mainnet01',1723323640709427,0,'6aEPwxcuknZzkZqxz1hzQSx78c7t6mEwDqB9B24oW9g','{"account": "k:251efb06f3b798dbe7bb3f58f535b67b0a9ed2da9aa4e2367be4abc07cc927fa", "predicate": "keys-all", "public-keys": ["251efb06f3b798dbe7bb3f58f535b67b0a9ed2da9aa4e2367be4abc07cc927fa"]}','jyRbntM1_MfdHunIXICLD_Knb1mnzNFznlVrge6gz90','WA1a4kdEJutuYF2u6Pt5q_RvOr4qsVbujMwadGsF0pQ','{"gas": 0, "logs": "Qlk5akdSsqH6tWi-FAt57hV0aLLhDlpEWAWb3OtiB-0", "txId": 11365215, "events": [{"name": "TRANSFER", "module": {"name": "coin", "namespace": null}, "params": ["", "k:251efb06f3b798dbe7bb3f58f535b67b0a9ed2da9aa4e2367be4abc07cc927fa", 0.9773645], "moduleHash": "klFkrLfpyLW-M3xjVPSdqXEMgxPPJibRt_D6qiBws6s"}], "reqKey": "IkxnN0Z5SVhjbU5xa0FPX01jdkNqSWFBSU9IVGxVT3ZIZWFWcnJiWF8xOWsi", "result": {"data": "Write succeeded", "status": "success"}, "metaData": null, "continuation": null}',NULL,'2024-08-10 18:27:31.201-03','2024-08-10 18:27:31.201-03'),
	 ('12499925805345800547',1723325268432815,'6aEPwxcuknZzkZqxz1hzQSx78c7t6mEwDqB9B24oW9g','{"6": "Sj8r1yPp45BItqd9pYaos5cWP5Jbf9P9BMij86rswq4", "11": "YAerk3yVsTTvxDQWvkGw_2NOKhKoVEm5u0plQuDdJuc", "16": "jjXfgaocPv944JLRSpSUCvElKJGTCtXBp0q4m8PqKpE"}','jVwwSVNSFOea-OCLJty6HJcrg2xbX-v8EwAAAAAAAAA','Wwyc9y_owUGV5UdeNCyp-SsXFXkPYt_kSMXdM3KwBLc',1,'C1cN--KaDSgpWgEAAAAAAAAAAAAAAAAAAAAAAAAAAAA',5028892,'mainnet01',1723323640709427,0,'Ur73KMSGc6g87xv0cBLxsq4-A40T08_HTT34ekzI8bA','{"account": "k:e7f7130f359fb1f8c87873bf858a0e9cbc3c1059f62ae715ec72e760b055e9f3", "predicate": "keys-all", "public-keys": ["e7f7130f359fb1f8c87873bf858a0e9cbc3c1059f62ae715ec72e760b055e9f3"]}','9yNSeh7rTW_j1ziKYyubdYUCefnO5K63d5RfPkHQXiM','HR3XmVqrqr34EQFKaszxS5Vve745szBVSY0eHcNqBh4','{"gas": 0, "logs": "a20gBo80gvHdm6I0-15jVMOFuLEQLB_k3DROQ4NdWfE", "txId": 11365219, "events": [{"name": "TRANSFER", "module": {"name": "coin", "namespace": null}, "params": ["", "k:e7f7130f359fb1f8c87873bf858a0e9cbc3c1059f62ae715ec72e760b055e9f3", 0.9773645], "moduleHash": "klFkrLfpyLW-M3xjVPSdqXEMgxPPJibRt_D6qiBws6s"}], "reqKey": "IjZhRVB3eGN1a25aemtacXh6MWh6UVN4NzhjN3Q2bUV3RHFCOUIyNG9XOWci", "result": {"data": "Write succeeded", "status": "success"}, "metaData": null, "continuation": null}',NULL,'2024-08-10 18:27:50.247-03','2024-08-10 18:27:50.247-03'),
	 ('2789020783523411074',172332528763788,'Ur73KMSGc6g87xv0cBLxsq4-A40T08_HTT34ekzI8bA','{"6": "SjKHTpfmS7-avLKElwo4PBJ60Z3ccx7ltR_opgQ3nrE", "11": "wvq0pXfT0UoEgO5IThgyHhDBc2UYPHvFodnij97uEFw", "16": "PAkkoUugWNyToMrKEzz_T1QYW7aQhd4UbINo2T7OMuM"}','jVwwSVNSFOea-OCLJty6HJcrg2xbX-v8EwAAAAAAAAA','7hv7c9S41WE51fGUFYY5AP7Xk-6vD4cYNAOGXZgl-Gk',1,'QSLzTLZg3DQpWgEAAAAAAAAAAAAAAAAAAAAAAAAAAAA',5028893,'mainnet01',1723323640709427,0,'Z32CIUvzuoIG8JKoExIljZfpB8qA6cT_AXxrPYQbogw','{"account": "k:251efb06f3b798dbe7bb3f58f535b67b0a9ed2da9aa4e2367be4abc07cc927fa", "predicate": "keys-all", "public-keys": ["251efb06f3b798dbe7bb3f58f535b67b0a9ed2da9aa4e2367be4abc07cc927fa"]}','H6QJOv3FxSPhkviKuHB5zQN6a9cvpZA4DckYTuColwo','8HOEA0Km54JGrrAIfZ2pFt1Xp0nzjJk7qlpQVS7ZUVk','{"gas": 0, "logs": "P17N-h4rzqjYz50rINd87GBmHVI5fsMHWk7DQOBGOqY", "txId": 11365220, "events": [{"name": "TRANSFER", "module": {"name": "coin", "namespace": null}, "params": ["", "k:251efb06f3b798dbe7bb3f58f535b67b0a9ed2da9aa4e2367be4abc07cc927fa", 0.9773645], "moduleHash": "klFkrLfpyLW-M3xjVPSdqXEMgxPPJibRt_D6qiBws6s"}], "reqKey": "IlVyNzNLTVNHYzZnODd4djBjQkx4c3E0LUE0MFQwOF9IVFQzNGVrekk4YkEi", "result": {"data": "Write succeeded", "status": "success"}, "metaData": null, "continuation": null}',NULL,'2024-08-10 18:28:07.438-03','2024-08-10 18:28:07.438-03'),
	 ('10453694574294697665',1723325298507130,'Z32CIUvzuoIG8JKoExIljZfpB8qA6cT_AXxrPYQbogw','{"6": "mtYHiY0ZymogaSn9ms0IQB--W0ARZ5cPXUZEdocXMgI", "11": "uh43yPVdKtXAJm-PiJNQ-pKs-I5f3O8_G72-ZQ9omX8", "16": "dEDQeRedQhBvQTJoecBPS7VfRY0Q3dS6PR9SEMYS33s"}','jVwwSVNSFOea-OCLJty6HJcrg2xbX-v8EwAAAAAAAAA','BZhjVm20KNjsPyjBhyNuKKDJVOmSJ16W-qBlwYt8TYQ',1,'d-3Ynokmq0EpWgEAAAAAAAAAAAAAAAAAAAAAAAAAAAA',5028894,'mainnet01',1723323640709427,0,'V5Xl5tBYSgCBg5gGbkrM-Yl5aziXHeyJ4Iy7ZsYVqyM','{"account": "99cb7008d7d70c94f138cc366a825f0d9c83a8a2f4ba82c86c666e0ab6fecf3a", "predicate": "keys-all", "public-keys": ["99cb7008d7d70c94f138cc366a825f0d9c83a8a2f4ba82c86c666e0ab6fecf3a"]}','g5dDASOa4cK0nAVmwkvXg-neTRAKG1hwfwRfbQyqpxU','9V9MXygJJhVtkCsst6OZrRrL-U9hs7mwgWADhKUO0D4','{"gas": 0, "logs": "0e8SGXvOhGHm1Pn6mmpwydcZNNRnkG1SvNiR-De4cxg", "txId": 11365230, "events": [{"name": "TRANSFER", "module": {"name": "coin", "namespace": null}, "params": ["", "99cb7008d7d70c94f138cc366a825f0d9c83a8a2f4ba82c86c666e0ab6fecf3a", 0.9773645], "moduleHash": "klFkrLfpyLW-M3xjVPSdqXEMgxPPJibRt_D6qiBws6s"}], "reqKey": "IlozMkNJVXZ6dW9JRzhKS29FeElsalpmcEI4cUE2Y1RfQVh4clBZUWJvZ3ci", "result": {"data": "Write succeeded", "status": "success"}, "metaData": null, "continuation": null}',NULL,'2024-08-10 18:28:25.894-03','2024-08-10 18:28:25.894-03'),
	 ('1329732280460081296',1723325322265290,'V5Xl5tBYSgCBg5gGbkrM-Yl5aziXHeyJ4Iy7ZsYVqyM','{"6": "n0C0gsBY7z05w8BbDpNiuckj98BR_aFW0eSIZsFOAY8", "11": "O9jWpSz9LffWWBCyzmQH-uq_UGKzeA-DpOZjMX42JOU", "16": "QXywWqOpcn3Dbnw-Ka3xDRUbhz-KNT6SHcUP6vPR5xo"}','jVwwSVNSFOea-OCLJty6HJcrg2xbX-v8EwAAAAAAAAA','YLds3gUkwfz9jW9wkIDpGWL5ad0G_z8ozGk1Bp-2O6E',1,'rbi-8FzseU4pWgEAAAAAAAAAAAAAAAAAAAAAAAAAAAA',5028895,'mainnet01',1723323640709427,0,'hEp8-NBIrEiryZLcezNWYm--QWqI1KOM757O3-N8jlk','{"account": "k:e7f7130f359fb1f8c87873bf858a0e9cbc3c1059f62ae715ec72e760b055e9f3", "predicate": "keys-all", "public-keys": ["e7f7130f359fb1f8c87873bf858a0e9cbc3c1059f62ae715ec72e760b055e9f3"]}','9yNSeh7rTW_j1ziKYyubdYUCefnO5K63d5RfPkHQXiM','ZoGV14MgB1D-wve0lEHxDdlM3DP1SmZiuFYq4VNV3VQ','{"gas": 0, "logs": "xEbZTHFD7vWDkt284b7cgWPwjmNjL-o-r_x3MkR6Ch4", "txId": 11365231, "events": [{"name": "TRANSFER", "module": {"name": "coin", "namespace": null}, "params": ["", "k:e7f7130f359fb1f8c87873bf858a0e9cbc3c1059f62ae715ec72e760b055e9f3", 0.9773645], "moduleHash": "klFkrLfpyLW-M3xjVPSdqXEMgxPPJibRt_D6qiBws6s"}], "reqKey": "IlY1WGw1dEJZU2dDQmc1Z0dia3JNLVlsNWF6aVhIZXlKNEl5N1pzWVZxeU0i", "result": {"data": "Write succeeded", "status": "success"}, "metaData": null, "continuation": null}',NULL,'2024-08-10 18:29:02.682-03','2024-08-10 18:29:02.682-03'),
	 ('12490299737889180212',1723325361055882,'hEp8-NBIrEiryZLcezNWYm--QWqI1KOM757O3-N8jlk','{"6": "4T6cDD0CvgEpue8yYk33nyzuHPQuvy4_QOk_zIe2zyk", "11": "B5RubmlpNlBp_Q2y3PJX0Mc8tN5w1wppzXwmfbOSB-M", "16": "sb2tep5TtjKRD9TrPhH6HEjxBHEJVEgtFZCpJEJT5IU"}','jVwwSVNSFOea-OCLJty6HJcrg2xbX-v8EwAAAAAAAAA','09agSvUwRm6CT59G9LrZ8_UxPGPdd9-3GYXDPE9dxb8',1,'44OkQjCySFspWgEAAAAAAAAAAAAAAAAAAAAAAAAAAAA',5028896,'mainnet01',1723323640709427,0,'lpHy2JfL2xZM90k9TOKC31MPrI6xOg5Aq0nsh1iA30Q','{"account": "k:251efb06f3b798dbe7bb3f58f535b67b0a9ed2da9aa4e2367be4abc07cc927fa", "predicate": "keys-all", "public-keys": ["251efb06f3b798dbe7bb3f58f535b67b0a9ed2da9aa4e2367be4abc07cc927fa"]}','LDDLwuMUVkIFEI3QMpktTMVu511KgiH43ae9h4ITEf8','W5Bea_Cqc0TI_w02zmus-I4w1hPVsWMpeHNLNfxaLQQ','{"gas": 0, "logs": "PKOCnO-8Afvf4zzxw14zxD1HABY4PQHeC_uwuG-roX0", "txId": 11365232, "events": [{"name": "TRANSFER", "module": {"name": "coin", "namespace": null}, "params": ["", "k:251efb06f3b798dbe7bb3f58f535b67b0a9ed2da9aa4e2367be4abc07cc927fa", 0.9773645], "moduleHash": "klFkrLfpyLW-M3xjVPSdqXEMgxPPJibRt_D6qiBws6s"}], "reqKey": "ImhFcDgtTkJJckVpcnlaTGNlek5XWW0tLVFXcUkxS09NNzU3TzMtTjhqbGsi", "result": {"data": "Write succeeded", "status": "success"}, "metaData": null, "continuation": null}',NULL,'2024-08-10 18:29:39.362-03','2024-08-10 18:29:39.362-03'),
	 ('7512132316490635716',1723325441502586,'lpHy2JfL2xZM90k9TOKC31MPrI6xOg5Aq0nsh1iA30Q','{"6": "ZpHlP0xdwoY_dN7hCEPUqgxFBOGgTiHbl2504WGUZAw", "11": "FPLBqlX39IDP8tKVMog_ocEv44dL-x4MAAKgyumv920", "16": "hN64twoF5JTvzD9pg3yM8mtZplDxHdECtCLlXv0MPLo"}','jVwwSVNSFOea-OCLJty6HJcrg2xbX-v8EwAAAAAAAAA','sxLyeYXYdaZfr2hea35r3C7pfmBETcOpR7OdQj89Sno',1,'GU-KlAN4F2gpWgEAAAAAAAAAAAAAAAAAAAAAAAAAAAA',5028897,'mainnet01',1723323640709427,0,'hAadBoeairUZTRQePTMfasLvxYhQdHMW5qKOPL_gfnk','{"account": "k:e7f7130f359fb1f8c87873bf858a0e9cbc3c1059f62ae715ec72e760b055e9f3", "predicate": "keys-all", "public-keys": ["e7f7130f359fb1f8c87873bf858a0e9cbc3c1059f62ae715ec72e760b055e9f3"]}','9yNSeh7rTW_j1ziKYyubdYUCefnO5K63d5RfPkHQXiM','TnCBUI6qA-FrQhBaeMSVwPJSA_UzoFq0vPDAeEq1zsM','{"gas": 0, "logs": "giCys5hoNkcgNzdd0T9bFxsorVjlZvt2My6fJemRysI", "txId": 11365241, "events": [{"name": "TRANSFER", "module": {"name": "coin", "namespace": null}, "params": ["", "k:e7f7130f359fb1f8c87873bf858a0e9cbc3c1059f62ae715ec72e760b055e9f3", 0.9773645], "moduleHash": "klFkrLfpyLW-M3xjVPSdqXEMgxPPJibRt_D6qiBws6s"}], "reqKey": "ImxwSHkySmZMMnhaTTkwazlUT0tDMzFNUHJJNnhPZzVBcTBuc2gxaUEzMFEi", "result": {"data": "Write succeeded", "status": "success"}, "metaData": null, "continuation": null}',NULL,'2024-08-10 18:30:48.892-03','2024-08-10 18:30:48.892-03'),
	 ('12130776320301796746',1723325472683843,'hAadBoeairUZTRQePTMfasLvxYhQdHMW5qKOPL_gfnk','{"6": "acxptuOinSdDkwRKIdkCRmwzdPsijwyBEw6sQiNbX_0", "11": "cQr4oECvVfmBBhFdCUa_4gscgint9QWlRJ3KFqDF7RA", "16": "Pr1U_FmSwhYhmoBEDxXb7mvZ8ZJtaXOsZUDH9_mD_Xc"}','jVwwSVNSFOea-OCLJty6HJcrg2xbX-v8EwAAAAAAAAA','ohLbT4jPmztqLXqwcIQXIAHJ7RfgOJiLY_tHEP-0SaI',1,'Txpw5tY95nQpWgEAAAAAAAAAAAAAAAAAAAAAAAAAAAA',5028898,'mainnet01',1723323640709427,0,'7YhlhStalrf2mmoIZEPSRldQ4NwWZOlkG7qOkSTyYyo','{"account": "99cb7008d7d70c94f138cc366a825f0d9c83a8a2f4ba82c86c666e0ab6fecf3a", "predicate": "keys-all", "public-keys": ["99cb7008d7d70c94f138cc366a825f0d9c83a8a2f4ba82c86c666e0ab6fecf3a"]}','FImR1Za995oUXBKKV0BGdsQeKXwHapGynYY0nrQjE3I','54ZxRiOVNV0WdzqZkwfFJx5AlLRn2xDoR_7ioKomTSU','{"gas": 0, "logs": "RgOaZO8L099wpzGx7zvc-rSK9xqN0S1pIrB7Rxf8NS8", "txId": 11365242, "events": [{"name": "TRANSFER", "module": {"name": "coin", "namespace": null}, "params": ["", "99cb7008d7d70c94f138cc366a825f0d9c83a8a2f4ba82c86c666e0ab6fecf3a", 0.9773645], "moduleHash": "klFkrLfpyLW-M3xjVPSdqXEMgxPPJibRt_D6qiBws6s"}], "reqKey": "ImhBYWRCb2VhaXJVWlRSUWVQVE1mYXNMdnhZaFFkSE1XNXFLT1BMX2dmbmsi", "result": {"data": "Write succeeded", "status": "success"}, "metaData": null, "continuation": null}',NULL,'2024-08-10 18:31:25.068-03','2024-08-10 18:31:25.068-03');

INSERT INTO public."Blocks" (nonce,"creationTime",parent,adjacents,target,"payloadHash","chainId",weight,height,"chainwebVersion","epochStart","featureFlags",hash,"minerData","transactionsHash","outputsHash",coinbase,canonical,"createdAt","updatedAt") VALUES
	 ('3227150122562225254',1723325476499107,'7YhlhStalrf2mmoIZEPSRldQ4NwWZOlkG7qOkSTyYyo','{"6": "546zYCTkfG-qM4d66MgcfflAlveILF8K6h4lyxC2S7M", "11": "o7vTVisva1hPPaYnt7gaERZudY7cK617qaMlOGTI8Gk", "16": "h3lCdTLYwYLD5LU0FAPpYmaZ_2ozNGfozs6Lq2aqpaM"}','jVwwSVNSFOea-OCLJty6HJcrg2xbX-v8EwAAAAAAAAA','icaeTgi4RTgOUzysDBK3-DwgYSz4sN5Nxje4g9cqhE0',1,'heVVOKoDtYEpWgEAAAAAAAAAAAAAAAAAAAAAAAAAAAA',5028899,'mainnet01',1723323640709427,0,'Fbt5Yb9RlXGStFQrOk5PyVXwOWLiMX-ZThyiDT8MsPs','{"account": "c50b9acb49ca25f59193b95b4e08e52e2ec89fa1bf308e6436f39a40ac2dc4f3", "predicate": "keys-all", "public-keys": ["c50b9acb49ca25f59193b95b4e08e52e2ec89fa1bf308e6436f39a40ac2dc4f3"]}','-okFYac9M9VCB-ou8upTvR7yAIhXj3viKSBVpFxTEX4','cUBpG00ktzytCNlwUe_FRlmWhtnF6vmoJJEiK5I1SCE','{"gas": 0, "logs": "xDJsHq3VlyDknYORr7qfQn4659Zr7iL7iCli1iyxQTc", "txId": 11365249, "events": [{"name": "TRANSFER", "module": {"name": "coin", "namespace": null}, "params": ["", "c50b9acb49ca25f59193b95b4e08e52e2ec89fa1bf308e6436f39a40ac2dc4f3", 0.9773645], "moduleHash": "klFkrLfpyLW-M3xjVPSdqXEMgxPPJibRt_D6qiBws6s"}], "reqKey": "IjdZaGxoU3RhbHJmMm1tb0laRVBTUmxkUTROd1daT2xrRzdxT2tTVHlZeW8i", "result": {"data": "Write succeeded", "status": "success"}, "metaData": null, "continuation": null}',NULL,'2024-08-10 18:31:25.066-03','2024-08-10 18:31:25.066-03'),
	 ('1701430156297327513',1723325516051984,'Fbt5Yb9RlXGStFQrOk5PyVXwOWLiMX-ZThyiDT8MsPs','{"6": "nohp-SoCn5_t53TDENJ7AOENjXneyrVOJqtDPHe6OP4", "11": "f7wi5kYBUAD8kZa4qRnrBW1UKNgZ09dVMrnnOkXZczM", "16": "TpMl87wQPA6EZ5kY8afqbTVRM7ltKl8OgvN5vhMc-F8"}','jVwwSVNSFOea-OCLJty6HJcrg2xbX-v8EwAAAAAAAAA','iIHhTrNnwEwx8keRMvDRtI-oDbr8Z3JoF76Z80IFurs',1,'u7A7in3Jg44pWgEAAAAAAAAAAAAAAAAAAAAAAAAAAAA',5028900,'mainnet01',1723323640709427,0,'KSYADOSLEt_uCFkejILSZNrao0ZogmNrXLIvnp5sFzI','{"account": "k:251efb06f3b798dbe7bb3f58f535b67b0a9ed2da9aa4e2367be4abc07cc927fa", "predicate": "keys-all", "public-keys": ["251efb06f3b798dbe7bb3f58f535b67b0a9ed2da9aa4e2367be4abc07cc927fa"]}','T_QMP3hdWT87uFacq_D8GX0X1a5pr8V68l_XXZqU3_c','1v4Ql60jcoqJQGwPD87qLJxbspkFQpg2jj2QIt21NjE','{"gas": 0, "logs": "WbmWT8xgjcUCjdeRkQr8pQhf13ixw2hTq2YomEUjDuo", "txId": 11365256, "events": [{"name": "TRANSFER", "module": {"name": "coin", "namespace": null}, "params": ["", "k:251efb06f3b798dbe7bb3f58f535b67b0a9ed2da9aa4e2367be4abc07cc927fa", 0.9773645], "moduleHash": "klFkrLfpyLW-M3xjVPSdqXEMgxPPJibRt_D6qiBws6s"}], "reqKey": "IkZidDVZYjlSbFhHU3RGUXJPazVQeVZYd09XTGlNWC1aVGh5aURUOE1zUHMi", "result": {"data": "Write succeeded", "status": "success"}, "metaData": null, "continuation": null}',NULL,'2024-08-10 18:31:58.557-03','2024-08-10 18:31:58.557-03'),
	 ('12987556589465112655',1723325534552241,'KSYADOSLEt_uCFkejILSZNrao0ZogmNrXLIvnp5sFzI','{"6": "jXFKf9ZKwc_1iSW2MYKURwz1Qijr_1GzhKKpwDK8Jn8", "11": "o2U0K0AMvWT_87xzSyX9e75EGBx4A7b_jhBoayt7hoQ", "16": "CZB3Wtg_1Kqsm05495MEyyW24CRRpHYBMWo_0N5n4bU"}','jVwwSVNSFOea-OCLJty6HJcrg2xbX-v8EwAAAAAAAAA','Im9qJZLs0mGJH6xRfUGB9Hw0VgcveOQCmsf4LZriYYo',1,'8Xsh3FCPUpspWgEAAAAAAAAAAAAAAAAAAAAAAAAAAAA',5028901,'mainnet01',1723323640709427,0,'fktISrr1jL0XtLl8XBJmwMq8cVIwZxudfzAxOrO3pV0','{"account": "k:251efb06f3b798dbe7bb3f58f535b67b0a9ed2da9aa4e2367be4abc07cc927fa", "predicate": "keys-all", "public-keys": ["251efb06f3b798dbe7bb3f58f535b67b0a9ed2da9aa4e2367be4abc07cc927fa"]}','qSBow5Cqw6azzclst6d9geaNRQS84dsIJZFxbO6QRlY','KLD__TdOU3XOS1e5cDVDmvSMaopYmlvpxiJRBPZbMG0','{"gas": 0, "logs": "EaIWBYezhwKhUVw7oYNW22c5o-acQpTcPX3hTbuyCEI", "txId": 11365257, "events": [{"name": "TRANSFER", "module": {"name": "coin", "namespace": null}, "params": ["", "k:251efb06f3b798dbe7bb3f58f535b67b0a9ed2da9aa4e2367be4abc07cc927fa", 0.9773645], "moduleHash": "klFkrLfpyLW-M3xjVPSdqXEMgxPPJibRt_D6qiBws6s"}], "reqKey": "IktTWUFET1NMRXRfdUNGa2VqSUxTWk5yYW8wWm9nbU5yWExJdm5wNXNGekki", "result": {"data": "Write succeeded", "status": "success"}, "metaData": null, "continuation": null}',NULL,'2024-08-10 18:32:17.966-03','2024-08-10 18:32:17.966-03'),
	 ('11907933106650301873',1723325582393943,'fktISrr1jL0XtLl8XBJmwMq8cVIwZxudfzAxOrO3pV0','{"6": "Cp9nFO2iENq5u7DjqJyCUpoAA_CB7buqXINoBzAJhTg", "11": "TUldThf0xrTkYU1zOHcBn3hiCqwr3-4xjMHASzpQQL8", "16": "rN3XDV5k1O8LCRzW_FAyrMuTdD1XqGZfVUQzNt_EcAA"}','jVwwSVNSFOea-OCLJty6HJcrg2xbX-v8EwAAAAAAAAA','8Y_lCet-y6Wml3efpTTb2N3AspP6CJ1i3Or6s9Pyb3w',1,'J0cHLiRVIagpWgEAAAAAAAAAAAAAAAAAAAAAAAAAAAA',5028902,'mainnet01',1723323640709427,0,'7A1Vlkv-XJD-JP3WUrsOBCFVXGBuABsXS06ZoBsUZ-A','{"account": "k:e7f7130f359fb1f8c87873bf858a0e9cbc3c1059f62ae715ec72e760b055e9f3", "predicate": "keys-all", "public-keys": ["e7f7130f359fb1f8c87873bf858a0e9cbc3c1059f62ae715ec72e760b055e9f3"]}','9yNSeh7rTW_j1ziKYyubdYUCefnO5K63d5RfPkHQXiM','SH9iLdqWc4x76-lVK_k0sgic9qAxTqIrACN-Y8bglQo','{"gas": 0, "logs": "ZkPkcgONoC5vCGk70GeUyInBan0jv6p5-bwt9gptq1I", "txId": 11365261, "events": [{"name": "TRANSFER", "module": {"name": "coin", "namespace": null}, "params": ["", "k:e7f7130f359fb1f8c87873bf858a0e9cbc3c1059f62ae715ec72e760b055e9f3", 0.9773645], "moduleHash": "klFkrLfpyLW-M3xjVPSdqXEMgxPPJibRt_D6qiBws6s"}], "reqKey": "ImZrdElTcnIxakwwWHRMbDhYQkptd01xOGNWSXdaeHVkZnpBeE9yTzNwVjAi", "result": {"data": "Write succeeded", "status": "success"}, "metaData": null, "continuation": null}',NULL,'2024-08-10 18:33:09.769-03','2024-08-10 18:33:09.769-03'),
	 ('6680931616952027882',1723325593093567,'7A1Vlkv-XJD-JP3WUrsOBCFVXGBuABsXS06ZoBsUZ-A','{"6": "suh5323_2MTJPKHMovkyFHCQx7GZ0oqk2ayqiZRH6BU", "11": "k9_4TiMUxhrUP80WanVY2Em3N8Zy_xJ0L4mi5DLER6c", "16": "aS7Xg93Gf5PSVdaGfXFoGgt7v2FjTz0cl6Pxjdpq8LE"}','jVwwSVNSFOea-OCLJty6HJcrg2xbX-v8EwAAAAAAAAA','_NjNgabt_At3kgKJEZBE5I6RYYyIKvNI1phrJprZF5g',1,'XRLtf_ca8LQpWgEAAAAAAAAAAAAAAAAAAAAAAAAAAAA',5028903,'mainnet01',1723323640709427,0,'t-OSh9Zu0YCpwOAEsbD3pIHTEwO0c031O-hpqeSXwQc','{"account": "k:251efb06f3b798dbe7bb3f58f535b67b0a9ed2da9aa4e2367be4abc07cc927fa", "predicate": "keys-all", "public-keys": ["251efb06f3b798dbe7bb3f58f535b67b0a9ed2da9aa4e2367be4abc07cc927fa"]}','4L991Kq2cDVH1ms2vcspiLhx3IsPcSBsVNk-3__I8MI','q8aiMviGn3T04kBBtLqRQmPOakYzqMZ2X5R8Nk1jZLs','{"gas": 0, "logs": "QP9B8iKk65HY8EHtw10MXJYJZrKv9b9QHDySAQD_Jig", "txId": 11365262, "events": [{"name": "TRANSFER", "module": {"name": "coin", "namespace": null}, "params": ["", "k:251efb06f3b798dbe7bb3f58f535b67b0a9ed2da9aa4e2367be4abc07cc927fa", 0.9773645], "moduleHash": "klFkrLfpyLW-M3xjVPSdqXEMgxPPJibRt_D6qiBws6s"}], "reqKey": "IjdBMVZsa3YtWEpELUpQM1dVcnNPQkNGVlhHQnVBQnNYUzA2Wm9Cc1VaLUEi", "result": {"data": "Write succeeded", "status": "success"}, "metaData": null, "continuation": null}',NULL,'2024-08-10 18:33:25.837-03','2024-08-10 18:33:25.837-03'),
	 ('7425588189140767286',1723325592159584,'7A1Vlkv-XJD-JP3WUrsOBCFVXGBuABsXS06ZoBsUZ-A','{"6": "suh5323_2MTJPKHMovkyFHCQx7GZ0oqk2ayqiZRH6BU", "11": "k9_4TiMUxhrUP80WanVY2Em3N8Zy_xJ0L4mi5DLER6c", "16": "aS7Xg93Gf5PSVdaGfXFoGgt7v2FjTz0cl6Pxjdpq8LE"}','jVwwSVNSFOea-OCLJty6HJcrg2xbX-v8EwAAAAAAAAA','mh9U_MC7TjbX4I7_R0N8OeD6jRvb0qVW8dWjJflZHYk',1,'XRLtf_ca8LQpWgEAAAAAAAAAAAAAAAAAAAAAAAAAAAA',5028903,'mainnet01',1723323640709427,0,'YdFEVJdW77DwN1Lp8WyH7mGWF5iRRn-XIz_ENRPMozw','{"account": "k:251efb06f3b798dbe7bb3f58f535b67b0a9ed2da9aa4e2367be4abc07cc927fa", "predicate": "keys-all", "public-keys": ["251efb06f3b798dbe7bb3f58f535b67b0a9ed2da9aa4e2367be4abc07cc927fa"]}','T_QMP3hdWT87uFacq_D8GX0X1a5pr8V68l_XXZqU3_c','ShaPN55n0tb3mysCBYLNPAMlRzhfrUC1xgpiR6dXNwU','{"gas": 0, "logs": "QP9B8iKk65HY8EHtw10MXJYJZrKv9b9QHDySAQD_Jig", "txId": 11365262, "events": [{"name": "TRANSFER", "module": {"name": "coin", "namespace": null}, "params": ["", "k:251efb06f3b798dbe7bb3f58f535b67b0a9ed2da9aa4e2367be4abc07cc927fa", 0.9773645], "moduleHash": "klFkrLfpyLW-M3xjVPSdqXEMgxPPJibRt_D6qiBws6s"}], "reqKey": "IjdBMVZsa3YtWEpELUpQM1dVcnNPQkNGVlhHQnVBQnNYUzA2Wm9Cc1VaLUEi", "result": {"data": "Write succeeded", "status": "success"}, "metaData": null, "continuation": null}',NULL,'2024-08-10 18:33:25.785-03','2024-08-10 18:33:25.785-03'),
	 ('895901499982902259',1723325640617167,'t-OSh9Zu0YCpwOAEsbD3pIHTEwO0c031O-hpqeSXwQc','{"6": "UQkkRKW36FTuqRwkKFqYExrJtDTEKZyP9MIOtMG3ryQ", "11": "Hb9a8RuY3MQjQ3aRk1IkphIIm8a9rsmjg7HLh8xUk2g", "16": "GNi83YvVPWCSR6ruE4hhG5tqiwcG6uvcRH38SfJ_dmI"}','jVwwSVNSFOea-OCLJty6HJcrg2xbX-v8EwAAAAAAAAA','HpE_VhF7yZs1cTerj9LwIkIO7zxKZ_1RC2_AYSkJgt4',1,'k93S0crgvsEpWgEAAAAAAAAAAAAAAAAAAAAAAAAAAAA',5028904,'mainnet01',1723323640709427,0,'ggW26EeGJ46WyN5n4SaXwgNV3CXQbdD60VKcre3WzIA','{"account": "k:e7f7130f359fb1f8c87873bf858a0e9cbc3c1059f62ae715ec72e760b055e9f3", "predicate": "keys-all", "public-keys": ["e7f7130f359fb1f8c87873bf858a0e9cbc3c1059f62ae715ec72e760b055e9f3"]}','9yNSeh7rTW_j1ziKYyubdYUCefnO5K63d5RfPkHQXiM','FnPdnr9kH32R1PtDxOkhMAZxzIvVW0sDfQNEE0NVrz4','{"gas": 0, "logs": "T4NwUMXS2bDPh7DfrOhXmvKKk8BdHhDAMaVZLaH1OZY", "txId": 11365266, "events": [{"name": "TRANSFER", "module": {"name": "coin", "namespace": null}, "params": ["", "k:e7f7130f359fb1f8c87873bf858a0e9cbc3c1059f62ae715ec72e760b055e9f3", 0.9773645], "moduleHash": "klFkrLfpyLW-M3xjVPSdqXEMgxPPJibRt_D6qiBws6s"}], "reqKey": "InQtT1NoOVp1MFlDcHdPQUVzYkQzcElIVEV3TzBjMDMxTy1ocHFlU1h3UWMi", "result": {"data": "Write succeeded", "status": "success"}, "metaData": null, "continuation": null}',NULL,'2024-08-10 18:34:03.087-03','2024-08-10 18:34:03.087-03'),
	 ('6174499486460891392',1723325657523024,'ggW26EeGJ46WyN5n4SaXwgNV3CXQbdD60VKcre3WzIA','{"6": "7AgajIMtRH1VEH5VhdUbDcMyXo2S6LQkWq33aHA3kSY", "11": "YgY1XGpGB8p78XkNB2Kc6yhC1CdzKm30XL0zscmIspA", "16": "3s_gCTBES4SEvlIR4tN3hPb1uGa_SPmrzxBmG9nS1m0"}','jVwwSVNSFOea-OCLJty6HJcrg2xbX-v8EwAAAAAAAAA','NUUgXdoZqU9GnJtMTIMps6NoFlitTs0_mhQBxRU4vJg',1,'yai4I56mjc4pWgEAAAAAAAAAAAAAAAAAAAAAAAAAAAA',5028905,'mainnet01',1723323640709427,0,'r68-xGt0kXCyHrFpSV9TYiAF7wDtzlFCdoCuBTmb3A8','{"account": "99cb7008d7d70c94f138cc366a825f0d9c83a8a2f4ba82c86c666e0ab6fecf3a", "predicate": "keys-all", "public-keys": ["99cb7008d7d70c94f138cc366a825f0d9c83a8a2f4ba82c86c666e0ab6fecf3a"]}','MA7T-OLUCtFX0mXJmCQSWe78f9CW_Z0_9mdcA6AbOpE','MUyUmA9x__tAgBg1Gw1KEaaDmmJzMgFcDOBKzwq5C0o','{"gas": 0, "logs": "8jj12NVhaE16GTldkXK3vevSCd_p0fIQwCbK4p7J_gg", "txId": 11365267, "events": [{"name": "TRANSFER", "module": {"name": "coin", "namespace": null}, "params": ["", "99cb7008d7d70c94f138cc366a825f0d9c83a8a2f4ba82c86c666e0ab6fecf3a", 0.9773645], "moduleHash": "klFkrLfpyLW-M3xjVPSdqXEMgxPPJibRt_D6qiBws6s"}], "reqKey": "ImdnVzI2RWVHSjQ2V3lONW40U2FYd2dOVjNDWFFiZEQ2MFZLY3JlM1d6SUEi", "result": {"data": "Write succeeded", "status": "success"}, "metaData": null, "continuation": null}',NULL,'2024-08-10 18:34:36.506-03','2024-08-10 18:34:36.506-03'),
	 ('8063143995681160718',1723325670771048,'r68-xGt0kXCyHrFpSV9TYiAF7wDtzlFCdoCuBTmb3A8','{"6": "urHq-lACDit9QS24I-Fk5gyLZOoBfAD9dh38s2StRdA", "11": "P_NufwvS3iRrC0kreBTN1nCXoYARArx-I4QJUlaT_Z4", "16": "pny1dNmsGbS7dP2T7qmhy_4NsjAqkJ94DmdxyA_dLmc"}','jVwwSVNSFOea-OCLJty6HJcrg2xbX-v8EwAAAAAAAAA','6Rl0qXSC1-YcQZNpFRC3OMwg7XYtv14EAYfspLhTaRY',1,'_3OedXFsXNspWgEAAAAAAAAAAAAAAAAAAAAAAAAAAAA',5028906,'mainnet01',1723323640709427,0,'jxm3v0kj8Z4FS3RpacjJ_Gz-aylxj9x6MyfEDhLoS3s','{"account": "k:e7f7130f359fb1f8c87873bf858a0e9cbc3c1059f62ae715ec72e760b055e9f3", "predicate": "keys-all", "public-keys": ["e7f7130f359fb1f8c87873bf858a0e9cbc3c1059f62ae715ec72e760b055e9f3"]}','9yNSeh7rTW_j1ziKYyubdYUCefnO5K63d5RfPkHQXiM','LU7EpGf4kLdJUKA5QjanoKsSevy42zBVfboePVJRBFM','{"gas": 0, "logs": "J3ZuoPZE5NafQ8UfHtlJ5ZDJ3FnCTCSsUywk80l-Zf4", "txId": 11365277, "events": [{"name": "TRANSFER", "module": {"name": "coin", "namespace": null}, "params": ["", "k:e7f7130f359fb1f8c87873bf858a0e9cbc3c1059f62ae715ec72e760b055e9f3", 0.9773645], "moduleHash": "klFkrLfpyLW-M3xjVPSdqXEMgxPPJibRt_D6qiBws6s"}], "reqKey": "InI2OC14R3Qwa1hDeUhyRnBTVjlUWWlBRjd3RHR6bEZDZG9DdUJUbWIzQTgi", "result": {"data": "Write succeeded", "status": "success"}, "metaData": null, "continuation": null}',NULL,'2024-08-10 18:34:36.527-03','2024-08-10 18:34:36.527-03'),
	 ('10472094428854862195',1723325702128850,'jxm3v0kj8Z4FS3RpacjJ_Gz-aylxj9x6MyfEDhLoS3s','{"6": "5KadsIFcoCLLQYmkjc0BiS4U5qGN5rIWdEYIeUa0T_k", "11": "cRsKy3rD_fMdONBdpVXWM9N8xECFAzyV-OKgY2b8DDQ", "16": "cOQlSq05enAcmzse94QEyv_LqVkf63aVSA1Y6Aaz2hY"}','jVwwSVNSFOea-OCLJty6HJcrg2xbX-v8EwAAAAAAAAA','UPOFHSrm7PJWY1u3249th13CXdQlSqrsCj1ltb_Q7bw',1,'NT-Ex0QyK-gpWgEAAAAAAAAAAAAAAAAAAAAAAAAAAAA',5028907,'mainnet01',1723323640709427,0,'8JwX20qEDxxp215VKzVR36-G9m30wS-3VVYy31FqCMo','{"account": "99cb7008d7d70c94f138cc366a825f0d9c83a8a2f4ba82c86c666e0ab6fecf3a", "predicate": "keys-all", "public-keys": ["99cb7008d7d70c94f138cc366a825f0d9c83a8a2f4ba82c86c666e0ab6fecf3a"]}','8miHoATeHvhW8efsSa-K5Jzvqn3Q64ljndRmpeTtT7o','CjYLLEqAb6NZcyf2Fsggw3EBCdbueQtgXGCrnaaTXj8','{"gas": 0, "logs": "_3TiXk-38d5FuAaRn5yRt4wpHaDN5av894OH_MaWNj4", "txId": 11365278, "events": [{"name": "TRANSFER", "module": {"name": "coin", "namespace": null}, "params": ["", "99cb7008d7d70c94f138cc366a825f0d9c83a8a2f4ba82c86c666e0ab6fecf3a", 0.9773645], "moduleHash": "klFkrLfpyLW-M3xjVPSdqXEMgxPPJibRt_D6qiBws6s"}], "reqKey": "Imp4bTN2MGtqOFo0RlMzUnBhY2pKX0d6LWF5bHhqOXg2TXlmRURoTG9TM3Mi", "result": {"data": "Write succeeded", "status": "success"}, "metaData": null, "continuation": null}',NULL,'2024-08-10 18:35:13.741-03','2024-08-10 18:35:13.741-03');

INSERT INTO public."Blocks" (nonce,"creationTime",parent,adjacents,target,"payloadHash","chainId",weight,height,"chainwebVersion","epochStart","featureFlags",hash,"minerData","transactionsHash","outputsHash",coinbase,canonical,"createdAt","updatedAt") VALUES
	 ('10153250036580425281',1723325713941155,'8JwX20qEDxxp215VKzVR36-G9m30wS-3VVYy31FqCMo','{"6": "szln4xHjAQJPbjyL5TkLhW-KFCXRnF52DCb-AMmHHa8", "11": "mqC7Yfp7BU_uH9Kk6YcYUMPg8LWuR50Mqi50eGtrLY8", "16": "nr4f9_Ri6kMqC5Rc53X4nQyWQnXEmbr8nJEoYlf8D1k"}','jVwwSVNSFOea-OCLJty6HJcrg2xbX-v8EwAAAAAAAAA','QRqDqw5XNWO0XGtr8q0kswHyuIrXMDItTCpth0pijfw',1,'awpqGRj4-fQpWgEAAAAAAAAAAAAAAAAAAAAAAAAAAAA',5028908,'mainnet01',1723323640709427,0,'qvu-hNR6fP0BYiOJY2qjB-uuyMJw0_IM_v0l8BzIjz8','{"account": "c50b9acb49ca25f59193b95b4e08e52e2ec89fa1bf308e6436f39a40ac2dc4f3", "predicate": "keys-all", "public-keys": ["c50b9acb49ca25f59193b95b4e08e52e2ec89fa1bf308e6436f39a40ac2dc4f3"]}','pfhaNWjwO07GlTRp4p5QN1sSEmpOW8uneUnzbTVtCw8','78j4P4wAie_ANFT-INpMdnLhsfQa7D6-ZKusSuV_7qY','{"gas": 0, "logs": "0kymu7leLG3csHiv5T6C0JUy3321XRGCyGsokdU_6wc", "txId": 11365297, "events": [{"name": "TRANSFER", "module": {"name": "coin", "namespace": null}, "params": ["", "c50b9acb49ca25f59193b95b4e08e52e2ec89fa1bf308e6436f39a40ac2dc4f3", 0.9773645], "moduleHash": "klFkrLfpyLW-M3xjVPSdqXEMgxPPJibRt_D6qiBws6s"}], "reqKey": "IjhKd1gyMHFFRHh4cDIxNVZLelZSMzYtRzltMzB3Uy0zVlZZeTMxRnFDTW8i", "result": {"data": "Write succeeded", "status": "success"}, "metaData": null, "continuation": null}',NULL,'2024-08-10 18:35:31.269-03','2024-08-10 18:35:31.269-03'),
	 ('11911861506249724474',1723325733579298,'qvu-hNR6fP0BYiOJY2qjB-uuyMJw0_IM_v0l8BzIjz8','{"6": "m4Smzxofdpu1dYwooRpd6YrMGuh_0TAKwxHdn24sZ2E", "11": "vKqsxaWefxbQeFgzfCAWviyEHRfFpZ39RCq7UJlSWDY", "16": "_r5zoibWQzXl8ST14FZxWl7FEDfKVKevym78gmqb2RA"}','jVwwSVNSFOea-OCLJty6HJcrg2xbX-v8EwAAAAAAAAA','HlMfGJCzLUuJwZ-5ik1TJOO0mujmo0axMvZ_UGgxXqU',1,'odVPa-u9yAEqWgEAAAAAAAAAAAAAAAAAAAAAAAAAAAA',5028909,'mainnet01',1723323640709427,0,'dZJPB2ZQHmt01NutwNzwSrrmJPXaOATJUBnaoxSnskA','{"account": "c50b9acb49ca25f59193b95b4e08e52e2ec89fa1bf308e6436f39a40ac2dc4f3", "predicate": "keys-all", "public-keys": ["c50b9acb49ca25f59193b95b4e08e52e2ec89fa1bf308e6436f39a40ac2dc4f3"]}','pfhaNWjwO07GlTRp4p5QN1sSEmpOW8uneUnzbTVtCw8','nYBHybl5pnVqWn9AFpTtLOoCLgrIgXVfETcQ6H4v7zc','{"gas": 0, "logs": "M7-dhXYLUIMlnDci7MPfJIIfTO6X2_tQzg-MKWaZ1n8", "txId": 11365298, "events": [{"name": "TRANSFER", "module": {"name": "coin", "namespace": null}, "params": ["", "c50b9acb49ca25f59193b95b4e08e52e2ec89fa1bf308e6436f39a40ac2dc4f3", 0.9773645], "moduleHash": "klFkrLfpyLW-M3xjVPSdqXEMgxPPJibRt_D6qiBws6s"}], "reqKey": "InF2dS1oTlI2ZlAwQllpT0pZMnFqQi11dXlNSncwX0lNX3YwbDhCeklqejgi", "result": {"data": "Write succeeded", "status": "success"}, "metaData": null, "continuation": null}',NULL,'2024-08-10 18:35:47.884-03','2024-08-10 18:35:47.884-03'),
	 ('5408122719510021691',1723325754135899,'dZJPB2ZQHmt01NutwNzwSrrmJPXaOATJUBnaoxSnskA','{"6": "2OwgBxpg74Nb8010iySi8uEP26Ykp30CKk0blPSqbs4", "11": "O-mh3f2IIKg3xoSLSlVUIlkl9-auvl1t2Leom7D8iw0", "16": "osyjDG-R2z9xVQS26ls3piUwHZ8zmz6YkcKb87jQyWQ"}','jVwwSVNSFOea-OCLJty6HJcrg2xbX-v8EwAAAAAAAAA','2fPpa_XsdiFVFXZN_kh39qYOLcSYXUCIRfnljjbRSN0',1,'16A1vb6Dlw4qWgEAAAAAAAAAAAAAAAAAAAAAAAAAAAA',5028910,'mainnet01',1723323640709427,0,'KWT-HGkgYtE9lxXladRXbOz2h37TPP9D1xNZx3NPdE4','{"account": "k:251efb06f3b798dbe7bb3f58f535b67b0a9ed2da9aa4e2367be4abc07cc927fa", "predicate": "keys-all", "public-keys": ["251efb06f3b798dbe7bb3f58f535b67b0a9ed2da9aa4e2367be4abc07cc927fa"]}','ydusIJOQOWIED3tGVAVfSSDgejz9nmqqomUJaJma_QI','F5L4F1ehpVNHw0qiTR1vhl6qPj0CdutNyjId20ZQPOA','{"gas": 0, "logs": "wG-2TLNfasH_n7td4F-JUQBSuzsJCfWv-WsvZ2nJiQo", "txId": 11365299, "events": [{"name": "TRANSFER", "module": {"name": "coin", "namespace": null}, "params": ["", "k:251efb06f3b798dbe7bb3f58f535b67b0a9ed2da9aa4e2367be4abc07cc927fa", 0.9773645], "moduleHash": "klFkrLfpyLW-M3xjVPSdqXEMgxPPJibRt_D6qiBws6s"}], "reqKey": "ImRaSlBCMlpRSG10MDFOdXR3Tnp3U3JybUpQWGFPQVRKVUJuYW94U25za0Ei", "result": {"data": "Write succeeded", "status": "success"}, "metaData": null, "continuation": null}',NULL,'2024-08-10 18:36:05.975-03','2024-08-10 18:36:05.975-03'),
	 ('10719466446142177911',1723325784820674,'KWT-HGkgYtE9lxXladRXbOz2h37TPP9D1xNZx3NPdE4','{"6": "RM_EVMKFL3a_gsTgScVBc3wd9cJ_hk_DXwKfqQ6GM80", "11": "_F84rhfhiAUc64mW6kMzfoKE79eD4ip4Qr-iUyTy3EM", "16": "SewWaLJ1w3ZcYAQ55dUqpxjEXAJyvE9QzJwvvHj3f7w"}','jVwwSVNSFOea-OCLJty6HJcrg2xbX-v8EwAAAAAAAAA','hbiPOvr9VXpCj7j4tgd_-rZkYaOnMkMdUAgYN9xpy9U',1,'DWwbD5JJZhsqWgEAAAAAAAAAAAAAAAAAAAAAAAAAAAA',5028911,'mainnet01',1723323640709427,0,'HP82Zl63MLa7o0b44vGopaYycHIJ0B5NKHWUDKFLvKM','{"account": "k:e7f7130f359fb1f8c87873bf858a0e9cbc3c1059f62ae715ec72e760b055e9f3", "predicate": "keys-all", "public-keys": ["e7f7130f359fb1f8c87873bf858a0e9cbc3c1059f62ae715ec72e760b055e9f3"]}','9yNSeh7rTW_j1ziKYyubdYUCefnO5K63d5RfPkHQXiM','1ejxGgG0SQC6UyvP6WcYJeHDNudiVHT39O94YUGALko','{"gas": 0, "logs": "ezL-zZZdCnR-zlmGlyQxnLSYad1w14HsPP9pQlH3qs4", "txId": 11365306, "events": [{"name": "TRANSFER", "module": {"name": "coin", "namespace": null}, "params": ["", "k:e7f7130f359fb1f8c87873bf858a0e9cbc3c1059f62ae715ec72e760b055e9f3", 0.9773645], "moduleHash": "klFkrLfpyLW-M3xjVPSdqXEMgxPPJibRt_D6qiBws6s"}], "reqKey": "IktXVC1IR2tnWXRFOWx4WGxhZFJYYk96MmgzN1RQUDlEMXhOWngzTlBkRTQi", "result": {"data": "Write succeeded", "status": "success"}, "metaData": null, "continuation": null}',NULL,'2024-08-10 18:36:42.584-03','2024-08-10 18:36:42.584-03'),
	 ('9257934036711131324',1723325810363459,'HP82Zl63MLa7o0b44vGopaYycHIJ0B5NKHWUDKFLvKM','{"6": "4RlFBeDfP0pP-6i7GluOreem466MqBv0sVhYzsXMcyo", "11": "SsCblouXV57pPa42-jmbIpxcsXZqp8QHuWIXfo9O9K8", "16": "Z9YEAXa2OKRNrDOg6_B0MfA0qlHCk8k2cBeHSNt7Ovs"}','jVwwSVNSFOea-OCLJty6HJcrg2xbX-v8EwAAAAAAAAA','IHMC0YGmnDLzXBcI5rB7kXEClxJUPSnG0fQ2fE45YxQ',1,'QzcBYWUPNSgqWgEAAAAAAAAAAAAAAAAAAAAAAAAAAAA',5028912,'mainnet01',1723323640709427,0,'6mo1Pjo5f9oONd2nUq3c0FLV9Jf1acJKVnQF2clQj0w','{"account": "k:251efb06f3b798dbe7bb3f58f535b67b0a9ed2da9aa4e2367be4abc07cc927fa", "predicate": "keys-all", "public-keys": ["251efb06f3b798dbe7bb3f58f535b67b0a9ed2da9aa4e2367be4abc07cc927fa"]}','78so-aNL5R6Fo-3Hij1v9tcd_jM5DErFv-HXq6OaX-k','-aslkJXr9ojExXrMVmSHGuT1L-oEE72t--Vc95HRUao','{"gas": 0, "logs": "l0gbjoEYiLMircIKgJamVD56RYsgZdvHJnctws761T8", "txId": 11365307, "events": [{"name": "TRANSFER", "module": {"name": "coin", "namespace": null}, "params": ["", "k:251efb06f3b798dbe7bb3f58f535b67b0a9ed2da9aa4e2367be4abc07cc927fa", 0.9773645], "moduleHash": "klFkrLfpyLW-M3xjVPSdqXEMgxPPJibRt_D6qiBws6s"}], "reqKey": "IkhQODJabDYzTUxhN28wYjQ0dkdvcGFZeWNISUowQjVOS0hXVURLRkx2S00i", "result": {"data": "Write succeeded", "status": "success"}, "metaData": null, "continuation": null}',NULL,'2024-08-10 18:37:01.08-03','2024-08-10 18:37:01.08-03'),
	 ('344689961576330387',1723325829364000,'6mo1Pjo5f9oONd2nUq3c0FLV9Jf1acJKVnQF2clQj0w','{"6": "sh-ttP7fq31oDAv7zYZMqvh6BM0ytFnge36gH2gb4KM", "11": "QK0ARZT53XKB8L2jtvX-gqwsHU3lDBc1SAnFqnwMtmo", "16": "OQ4H4JDNx7udtIcKs59KDA6aFOGWxFdqjXiG70AUaIM"}','jVwwSVNSFOea-OCLJty6HJcrg2xbX-v8EwAAAAAAAAA','PPYbFHou_FbF-kQ_gBGi3QnxYjwhnxebXbUvzQMklsc',1,'eQLnsjjVAzUqWgEAAAAAAAAAAAAAAAAAAAAAAAAAAAA',5028913,'mainnet01',1723323640709427,0,'e1XX4GhovKg9fkVqWEvxaoEj788QC5vdoTfP3Xu4z6E','{"account": "k:e7f7130f359fb1f8c87873bf858a0e9cbc3c1059f62ae715ec72e760b055e9f3", "predicate": "keys-all", "public-keys": ["e7f7130f359fb1f8c87873bf858a0e9cbc3c1059f62ae715ec72e760b055e9f3"]}','9yNSeh7rTW_j1ziKYyubdYUCefnO5K63d5RfPkHQXiM','Rd9Q25hGdcRVXRTPLHuCWOI19uqW3NrtarnhNEQNf_A','{"gas": 0, "logs": "FuxyheT0Dw7OJkgJB0ky-s1Gv5Koow7u7rBBz_L80gY", "txId": 11365317, "events": [{"name": "TRANSFER", "module": {"name": "coin", "namespace": null}, "params": ["", "k:e7f7130f359fb1f8c87873bf858a0e9cbc3c1059f62ae715ec72e760b055e9f3", 0.9773645], "moduleHash": "klFkrLfpyLW-M3xjVPSdqXEMgxPPJibRt_D6qiBws6s"}], "reqKey": "IjZtbzFQam81ZjlvT05kMm5VcTNjMEZMVjlKZjFhY0pLVm5RRjJjbFFqMHci", "result": {"data": "Write succeeded", "status": "success"}, "metaData": null, "continuation": null}',NULL,'2024-08-10 18:37:21.275-03','2024-08-10 18:37:21.275-03'),
	 ('9950243795763884361',1723325843042281,'e1XX4GhovKg9fkVqWEvxaoEj788QC5vdoTfP3Xu4z6E','{"6": "Hmp9fgdE_r_ECNJs7l8bb23X11sqsmEHs3xj1uFTujQ", "11": "rl7QUlviuxvV9d7uOXQJrKoBEZ5--fj3KZTSEFy_5Cc", "16": "R-7wVoV2cWG0g0ZRflmEs0Q-OwKEGdcIVGurc-I4Psk"}','jVwwSVNSFOea-OCLJty6HJcrg2xbX-v8EwAAAAAAAAA','OONI8kOm1wYJXJ5PEV7pMfotqCM7kA4tztLEmh_D-bI',1,'r83MBAyb0kEqWgEAAAAAAAAAAAAAAAAAAAAAAAAAAAA',5028914,'mainnet01',1723323640709427,0,'f3u_RO-b7TKB2ypcg0lP2BMmYJHoMyRKZ-Q5cH-9pXo','{"account": "99cb7008d7d70c94f138cc366a825f0d9c83a8a2f4ba82c86c666e0ab6fecf3a", "predicate": "keys-all", "public-keys": ["99cb7008d7d70c94f138cc366a825f0d9c83a8a2f4ba82c86c666e0ab6fecf3a"]}','g5dDASOa4cK0nAVmwkvXg-neTRAKG1hwfwRfbQyqpxU','4QwOUy9X0qwcq2tNcx8FqDhTL23JuL16-BzOgw7b50E','{"gas": 0, "logs": "9lz2UwsV6bYqiE-og_ESh6ga3kUc1_fewb7lv1I9zG8", "txId": 11365318, "events": [{"name": "TRANSFER", "module": {"name": "coin", "namespace": null}, "params": ["", "99cb7008d7d70c94f138cc366a825f0d9c83a8a2f4ba82c86c666e0ab6fecf3a", 0.9773645], "moduleHash": "klFkrLfpyLW-M3xjVPSdqXEMgxPPJibRt_D6qiBws6s"}], "reqKey": "ImUxWFg0R2hvdktnOWZrVnFXRXZ4YW9Fajc4OFFDNXZkb1RmUDNYdTR6NkUi", "result": {"data": "Write succeeded", "status": "success"}, "metaData": null, "continuation": null}',NULL,'2024-08-10 18:37:38.212-03','2024-08-10 18:37:38.212-03'),
	 ('7401357256496990617',1723325895572326,'f3u_RO-b7TKB2ypcg0lP2BMmYJHoMyRKZ-Q5cH-9pXo','{"6": "seO8LqQiCOre_sWOkx3m-r-gz1DpPjbj-d7KBTZTQN0", "11": "TE_XIkoXU2OF0TNpGkr7QKC2lfhmQqJXXsrdTA9_KmM", "16": "5P-azwsytThrTrZwnB45QJxVNMb0fwrYW6Di_zaU9aA"}','jVwwSVNSFOea-OCLJty6HJcrg2xbX-v8EwAAAAAAAAA','Dm--x7rVFhQI3UOzbtGMG8Hv3PWt6g_tMrod62-eZh0',1,'5ZiyVt9goU4qWgEAAAAAAAAAAAAAAAAAAAAAAAAAAAA',5028915,'mainnet01',1723323640709427,0,'R2qBbwDcndJJjxLW648KK8_bqg2exN0so0oysNspWZA','{"account": "k:251efb06f3b798dbe7bb3f58f535b67b0a9ed2da9aa4e2367be4abc07cc927fa", "predicate": "keys-all", "public-keys": ["251efb06f3b798dbe7bb3f58f535b67b0a9ed2da9aa4e2367be4abc07cc927fa"]}','_n8kTkrzibrcKYjrBBeNFxKmS-eCw22e-jEJnnOXJn4','mZrPjudnRTX9VCB5UdEdxJfmUxoMmqGt3EkW57EUj0A','{"gas": 0, "logs": "K7JI0IPWfGOEhz-lLMuoAfCn2gBVgt35DEwgplTvxSk", "txId": 11365319, "events": [{"name": "TRANSFER", "module": {"name": "coin", "namespace": null}, "params": ["", "k:251efb06f3b798dbe7bb3f58f535b67b0a9ed2da9aa4e2367be4abc07cc927fa", 0.9773645], "moduleHash": "klFkrLfpyLW-M3xjVPSdqXEMgxPPJibRt_D6qiBws6s"}], "reqKey": "ImYzdV9STy1iN1RLQjJ5cGNnMGxQMkJNbVlKSG9NeVJLWi1RNWNILTlwWG8i", "result": {"data": "Write succeeded", "status": "success"}, "metaData": null, "continuation": null}',NULL,'2024-08-10 18:38:32.385-03','2024-08-10 18:38:32.385-03'),
	 ('5149426419196905883',1723325908538834,'R2qBbwDcndJJjxLW648KK8_bqg2exN0so0oysNspWZA','{"6": "UXCnZu7qKdVuEa5Ycd85_j_utGd1Ki2Eaq0esCL6wv0", "11": "EmRz1uaB_fQ0hS7WkxB7rBw0nMO1mrXk9z7qFXyNvOo", "16": "orPpYlkPr28rnd2oeo601bmm4RY5DV5m6vPv4FBXKz4"}','jVwwSVNSFOea-OCLJty6HJcrg2xbX-v8EwAAAAAAAAA','F61rDkTGoBZuoYbMe149pq_iD0JtIqgZUT8FuUXOMsQ',1,'G2SYqLImcFsqWgEAAAAAAAAAAAAAAAAAAAAAAAAAAAA',5028916,'mainnet01',1723323640709427,0,'9H7XmCqbAjYnHAJ7qc92_7tUWtY7evPSj5QyhF2Lukk','{"account": "k:251efb06f3b798dbe7bb3f58f535b67b0a9ed2da9aa4e2367be4abc07cc927fa", "predicate": "keys-all", "public-keys": ["251efb06f3b798dbe7bb3f58f535b67b0a9ed2da9aa4e2367be4abc07cc927fa"]}','T_QMP3hdWT87uFacq_D8GX0X1a5pr8V68l_XXZqU3_c','_8yfYkWhcDM71Sg3BPxV-HvC4mtkEYwnDQUpQYJd0x4','{"gas": 0, "logs": "WUt8ckhEgbPC3ZwhQONI7nhVY3LBw0DZQCLn8elP1Eg", "txId": 11365323, "events": [{"name": "TRANSFER", "module": {"name": "coin", "namespace": null}, "params": ["", "k:251efb06f3b798dbe7bb3f58f535b67b0a9ed2da9aa4e2367be4abc07cc927fa", 0.9773645], "moduleHash": "klFkrLfpyLW-M3xjVPSdqXEMgxPPJibRt_D6qiBws6s"}], "reqKey": "IlIycUJid0RjbmRKSmp4TFc2NDhLSzhfYnFnMmV4TjBzbzBveXNOc3BXWkEi", "result": {"data": "Write succeeded", "status": "success"}, "metaData": null, "continuation": null}',NULL,'2024-08-10 18:38:34.91-03','2024-08-10 18:38:34.91-03'),
	 ('8239924524758733605',1723325936210563,'9H7XmCqbAjYnHAJ7qc92_7tUWtY7evPSj5QyhF2Lukk','{"6": "ip3H2J7E23DO_t-qjKiY3a8RDGhLLFWvL8t82L8wIBM", "11": "TVVt-pZV3ClXOVrvUhE_b7oBel0L5ghcLBkrv1TW57o", "16": "d-wGQRbgxoDXrnrnUOzILFslBgKzeuvNb9gzI-OctSE"}','jVwwSVNSFOea-OCLJty6HJcrg2xbX-v8EwAAAAAAAAA','gsyL5qnrsrZjaYaZyCf2HW0ipH9AvZXPX1thyb55Crc',1,'US9--oXsPmgqWgEAAAAAAAAAAAAAAAAAAAAAAAAAAAA',5028917,'mainnet01',1723323640709427,0,'Z_DFnfOObRvbKRFJ-C3YyOfgtTg3-LrT-vCHH-xzCFI','{"account": "k:251efb06f3b798dbe7bb3f58f535b67b0a9ed2da9aa4e2367be4abc07cc927fa", "predicate": "keys-all", "public-keys": ["251efb06f3b798dbe7bb3f58f535b67b0a9ed2da9aa4e2367be4abc07cc927fa"]}','y0xhOv_m6xaZNVgShYGWpEk2maKDtYj9Yjt8ncHBl9I','L-5ntfAK4O8zWacCfHdEaq0NpqZG_n5heRPE5LDWOYU','{"gas": 0, "logs": "nVAWYLp37VaghKpfDOU5ku_H96Q2stpTlH940ZeQ8rE", "txId": 11365324, "events": [{"name": "TRANSFER", "module": {"name": "coin", "namespace": null}, "params": ["", "k:251efb06f3b798dbe7bb3f58f535b67b0a9ed2da9aa4e2367be4abc07cc927fa", 0.9773645], "moduleHash": "klFkrLfpyLW-M3xjVPSdqXEMgxPPJibRt_D6qiBws6s"}], "reqKey": "IjlIN1htQ3FiQWpZbkhBSjdxYzkyXzd0VVd0WTdldlBTajVReWhGMkx1a2si", "result": {"data": "Write succeeded", "status": "success"}, "metaData": null, "continuation": null}',NULL,'2024-08-10 18:39:09.582-03','2024-08-10 18:39:09.582-03');

INSERT INTO public."Blocks" (nonce,"creationTime",parent,adjacents,target,"payloadHash","chainId",weight,height,"chainwebVersion","epochStart","featureFlags",hash,"minerData","transactionsHash","outputsHash",coinbase,canonical,"createdAt","updatedAt") VALUES
	 ('8914139019908563979',1723325946423512,'Z_DFnfOObRvbKRFJ-C3YyOfgtTg3-LrT-vCHH-xzCFI','{"6": "LrtB2gk7quvYbP3p0hr5eQYUly_cCBTlUjfAkghqkiE", "11": "5t6EZcEn74H7YJm38DpCRTcBAuMTeTTT4weiYW5XZpM", "16": "9Mcu6chCzRjyjo0VSEkz1W1dy-hZWOjUmNsFgXJza4M"}','jVwwSVNSFOea-OCLJty6HJcrg2xbX-v8EwAAAAAAAAA','chreIswCZw9o2tXKH4aQMqEngrip6s7AHgm4Yqzuz9o',1,'h_pjTFmyDXUqWgEAAAAAAAAAAAAAAAAAAAAAAAAAAAA',5028918,'mainnet01',1723323640709427,0,'bVY2vdiRLcbfB4DgO7QpmYhPvgKG_KZIne7eBwOx5kA','{"account": "k:e7f7130f359fb1f8c87873bf858a0e9cbc3c1059f62ae715ec72e760b055e9f3", "predicate": "keys-all", "public-keys": ["e7f7130f359fb1f8c87873bf858a0e9cbc3c1059f62ae715ec72e760b055e9f3"]}','WmP00SOrZ83TQdJpQURT5S4_5btXZizCtwbo1zOta54','oszHC2IqHG_-wKgN-vzozPk-K-ilB3K9lPLgy8lDRL0','{"gas": 0, "logs": "Wdbtkj9VGbRyaQHxRam7CWcHKojZU3rwCfMQhNb1nzM", "txId": 11365331, "events": [{"name": "TRANSFER", "module": {"name": "coin", "namespace": null}, "params": ["", "k:e7f7130f359fb1f8c87873bf858a0e9cbc3c1059f62ae715ec72e760b055e9f3", 0.9773645], "moduleHash": "klFkrLfpyLW-M3xjVPSdqXEMgxPPJibRt_D6qiBws6s"}], "reqKey": "IlpfREZuZk9PYlJ2YktSRkotQzNZeU9mZ3RUZzMtTHJULXZDSEgteHpDRkki", "result": {"data": "Write succeeded", "status": "success"}, "metaData": null, "continuation": null}',NULL,'2024-08-10 18:39:09.592-03','2024-08-10 18:39:09.592-03'),
	 ('5918125680094548357',1723325978279087,'bVY2vdiRLcbfB4DgO7QpmYhPvgKG_KZIne7eBwOx5kA','{"6": "KRwn14jm20pyXnnil3Aefv3DR0j2ywf1E8ycakhz0dc", "11": "kZ0YSc5OqvrvbLg_qr8HO2JJpgZJkdDe0-GPsrngP_Q", "16": "LcWfUxM_waxByvhzBpYOg60ZJn_Dep7C9QWFe8YdT8c"}','jVwwSVNSFOea-OCLJty6HJcrg2xbX-v8EwAAAAAAAAA','3z3y3_Xq8KR0Lz5rsYa612yCPyxNvEACtwxzcPEkMcA',1,'vcVJnix43IEqWgEAAAAAAAAAAAAAAAAAAAAAAAAAAAA',5028919,'mainnet01',1723323640709427,0,'oXXaWotOFptd_6VSwxFjZPaZfJ_VJkQQ0_YQDWesz0o','{"account": "99cb7008d7d70c94f138cc366a825f0d9c83a8a2f4ba82c86c666e0ab6fecf3a", "predicate": "keys-all", "public-keys": ["99cb7008d7d70c94f138cc366a825f0d9c83a8a2f4ba82c86c666e0ab6fecf3a"]}','g5dDASOa4cK0nAVmwkvXg-neTRAKG1hwfwRfbQyqpxU','F2SD4stiTkkfI5avVUrtMzNQdxvH-nbBAsc5I254P2Y','{"gas": 0, "logs": "vCQr1o5GfvqBOidi_9_PDXBdl2GpxNBZvJVuOwYNaPs", "txId": 11365335, "events": [{"name": "TRANSFER", "module": {"name": "coin", "namespace": null}, "params": ["", "99cb7008d7d70c94f138cc366a825f0d9c83a8a2f4ba82c86c666e0ab6fecf3a", 0.9773645], "moduleHash": "klFkrLfpyLW-M3xjVPSdqXEMgxPPJibRt_D6qiBws6s"}], "reqKey": "ImJWWTJ2ZGlSTGNiZkI0RGdPN1FwbVloUHZnS0dfS1pJbmU3ZUJ3T3g1a0Ei", "result": {"data": "Write succeeded", "status": "success"}, "metaData": null, "continuation": null}',NULL,'2024-08-10 18:40:05.703-03','2024-08-10 18:40:05.703-03'),
	 ('7537226526443707722',1723326018146697,'oXXaWotOFptd_6VSwxFjZPaZfJ_VJkQQ0_YQDWesz0o','{"6": "OoGaxClVPL2NrHYBDosYMjbPzGY7ZlBKGxCm0jombv0", "11": "CgbaU3ogHCa1jE3sjiUsJq7d4AA6fpbw3RESUFI6xcU", "16": "uYerEtEZr-Xjd0poM7vWFxOE365Azl85jufyUkx-Xng"}','jVwwSVNSFOea-OCLJty6HJcrg2xbX-v8EwAAAAAAAAA','2UvT7Zz7iTf8Tq8P_GJyP-GzBXiB7GaQiPrWz1gHbl8',1,'85Av8P89q44qWgEAAAAAAAAAAAAAAAAAAAAAAAAAAAA',5028920,'mainnet01',1723323640709427,0,'R-vrWlqPi884QvVzFsRD_9EB4aUQuk4pGuhpAuCyAoc','{"account": "k:251efb06f3b798dbe7bb3f58f535b67b0a9ed2da9aa4e2367be4abc07cc927fa", "predicate": "keys-all", "public-keys": ["251efb06f3b798dbe7bb3f58f535b67b0a9ed2da9aa4e2367be4abc07cc927fa"]}','T_QMP3hdWT87uFacq_D8GX0X1a5pr8V68l_XXZqU3_c','OJ9_tpCjLwTTYFNhRdy3aeymOwI0I08wzzrlzTTf8-s','{"gas": 0, "logs": "fEXKqTxtlfArpjP-li_3pEyPhU6EbY5EMYCvxHwjxVk", "txId": 11365336, "events": [{"name": "TRANSFER", "module": {"name": "coin", "namespace": null}, "params": ["", "k:251efb06f3b798dbe7bb3f58f535b67b0a9ed2da9aa4e2367be4abc07cc927fa", 0.9773645], "moduleHash": "klFkrLfpyLW-M3xjVPSdqXEMgxPPJibRt_D6qiBws6s"}], "reqKey": "Im9YWGFXb3RPRnB0ZF82VlN3eEZqWlBhWmZKX1ZKa1FRMF9ZUURXZXN6MG8i", "result": {"data": "Write succeeded", "status": "success"}, "metaData": null, "continuation": null}',NULL,'2024-08-10 18:40:24.109-03','2024-08-10 18:40:24.109-03'),
	 ('8570772790415608949',1723326060826285,'R-vrWlqPi884QvVzFsRD_9EB4aUQuk4pGuhpAuCyAoc','{"6": "nBTA57Eva8dBsp3zGBqVBzWtIhe42EZAj9ZODo7CDl4", "11": "cnT6XcDy_2QKQ_LxKiN4WAYXed0TAy0G_AmDkp904tI", "16": "723plbBcCy6qD5iufn1bOpNqlYB3spJCIDeasZK9-5A"}','jVwwSVNSFOea-OCLJty6HJcrg2xbX-v8EwAAAAAAAAA','fVUnAELWf49qVrqd7PtQSYDPYPG77fCa8Qfq9Wx1pZ0',1,'KVwVQtMDepsqWgEAAAAAAAAAAAAAAAAAAAAAAAAAAAA',5028921,'mainnet01',1723323640709427,0,'nEXqmYVzkmQcnfJvXLh5EHpa7XQjs-_j8buEL5AwTs8','{"account": "k:e7f7130f359fb1f8c87873bf858a0e9cbc3c1059f62ae715ec72e760b055e9f3", "predicate": "keys-all", "public-keys": ["e7f7130f359fb1f8c87873bf858a0e9cbc3c1059f62ae715ec72e760b055e9f3"]}','BAYVFuAFwrzFGxBGaR8s8yZ4aFQCx2SnFy9ggU_Qr10','oFWkQmLKkOEs6wkYoFyxBIecoKQgdRVa8HCCSCLLDEQ','{"gas": 0, "logs": "s0R-lokuZ0PxEUV0gaBmcsWwXGt2F-mdI-M5KblgA2U", "txId": 11365337, "events": [{"name": "TRANSFER", "module": {"name": "coin", "namespace": null}, "params": ["", "k:e7f7130f359fb1f8c87873bf858a0e9cbc3c1059f62ae715ec72e760b055e9f3", 0.9773645], "moduleHash": "klFkrLfpyLW-M3xjVPSdqXEMgxPPJibRt_D6qiBws6s"}], "reqKey": "IlItdnJXbHFQaTg4NFF2VnpGc1JEXzlFQjRhVVF1azRwR3VocEF1Q3lBb2Mi", "result": {"data": "Write succeeded", "status": "success"}, "metaData": null, "continuation": null}',NULL,'2024-08-10 18:41:14.94-03','2024-08-10 18:41:14.94-03'),
	 ('10262581242973924528',1723326126447523,'nEXqmYVzkmQcnfJvXLh5EHpa7XQjs-_j8buEL5AwTs8','{"6": "SRIyvC-H8iGhIW4Jf6-u6vUXmEogDd51Vv7U0ie63K0", "11": "e5E7nIagBrm36xtERqgb-jw9k7DIUGZU5rB1oysMREo", "16": "X2IBxaW8TIrT3U9FeXFZnky7GehcrQqMRRlxmj6IWMA"}','jVwwSVNSFOea-OCLJty6HJcrg2xbX-v8EwAAAAAAAAA','0Z8ISSqCrUd45NAlIiDm1O0yRJYjvmxJRvRRb4GYctQ',1,'Xyf7k6bJSKgqWgEAAAAAAAAAAAAAAAAAAAAAAAAAAAA',5028922,'mainnet01',1723323640709427,0,'OgiZZ11wWtdpUMVR5khfr6dCwBSnQRjGMEKyyKrlCDI','{"account": "k:e7f7130f359fb1f8c87873bf858a0e9cbc3c1059f62ae715ec72e760b055e9f3", "predicate": "keys-all", "public-keys": ["e7f7130f359fb1f8c87873bf858a0e9cbc3c1059f62ae715ec72e760b055e9f3"]}','7IwcsSLNDZbgvHEPf5OzKY2iBo1v8MaTmkWwvoEBKg8','nteXkhTC_TuKYqItxsut-pGWaH8_AOPvNSNZ8pu4JDg','{"gas": 0, "logs": "iam5eUBhsNAveBsI1-2dcHXq-vrY8jlZJt4oMTfXitk", "txId": 11365341, "events": [{"name": "TRANSFER", "module": {"name": "coin", "namespace": null}, "params": ["", "k:e7f7130f359fb1f8c87873bf858a0e9cbc3c1059f62ae715ec72e760b055e9f3", 0.9773645], "moduleHash": "klFkrLfpyLW-M3xjVPSdqXEMgxPPJibRt_D6qiBws6s"}], "reqKey": "Im5FWHFtWVZ6a21RY25mSnZYTGg1RUhwYTdYUWpzLV9qOGJ1RUw1QXdUczgi", "result": {"data": "Write succeeded", "status": "success"}, "metaData": null, "continuation": null}',NULL,'2024-08-10 18:42:22.662-03','2024-08-10 18:42:22.662-03'),
	 ('8957205041245590759',1723326130359483,'OgiZZ11wWtdpUMVR5khfr6dCwBSnQRjGMEKyyKrlCDI','{"6": "jncwNqb9wv441YyNKzh2BDXCC7jwxOUxrSEJOCEQ4S8", "11": "27o4Us4JdAmND6th0p2envASXQFWUiEc1QcFnDxjf6Q", "16": "U-yHe8QnBJGmEi2ICTHXhJ0Clvbua6VKV8T7Yxpi7Z4"}','jVwwSVNSFOea-OCLJty6HJcrg2xbX-v8EwAAAAAAAAA','owM0Sz7O-PehfmCK1tYTskEJNH_ZjWD25CeBJl9l3Gc',1,'lfLg5XmPF7UqWgEAAAAAAAAAAAAAAAAAAAAAAAAAAAA',5028923,'mainnet01',1723323640709427,0,'FePgvx8wZFw_yMRVxdnUFt3N8phbAV2xhJg7-vgMKMQ','{"account": "k:251efb06f3b798dbe7bb3f58f535b67b0a9ed2da9aa4e2367be4abc07cc927fa", "predicate": "keys-all", "public-keys": ["251efb06f3b798dbe7bb3f58f535b67b0a9ed2da9aa4e2367be4abc07cc927fa"]}','9qymTrkCNlczDaC6ONuiqRlcwyZEONsbksD5WR62j14','mqwqe5YghV7GJBWVapgQK3szqhtB3Fct-xqIFcZkcU8','{"gas": 0, "logs": "dTmDbkm1PxUpLQUNOHSY7IwioVcOrOX_wGYPUJ3aZA8", "txId": 11365345, "events": [{"name": "TRANSFER", "module": {"name": "coin", "namespace": null}, "params": ["", "k:251efb06f3b798dbe7bb3f58f535b67b0a9ed2da9aa4e2367be4abc07cc927fa", 0.9773645], "moduleHash": "klFkrLfpyLW-M3xjVPSdqXEMgxPPJibRt_D6qiBws6s"}], "reqKey": "Ik9naVpaMTF3V3RkcFVNVlI1a2hmcjZkQ3dCU25RUmpHTUVLeXlLcmxDREki", "result": {"data": "Write succeeded", "status": "success"}, "metaData": null, "continuation": null}',NULL,'2024-08-10 18:42:22.716-03','2024-08-10 18:42:22.716-03'),
	 ('3952120148318697530',1723326181285496,'FePgvx8wZFw_yMRVxdnUFt3N8phbAV2xhJg7-vgMKMQ','{"6": "s5p554genLKgX22YPys5fNswc-mqKygtHM776W0HnxY", "11": "DZvngVshE8p7q-917RMyfh59p4GxnYAsCuMENND8-YQ", "16": "QBhs9A4MwqVis3P6X-izzaweziYl7fQNvJj30US38f4"}','jVwwSVNSFOea-OCLJty6HJcrg2xbX-v8EwAAAAAAAAA','qDWUQ3MjcMMt0pJwlVUqNzy1_HBtyVne9oxx59S43SA',1,'y73GN01V5sEqWgEAAAAAAAAAAAAAAAAAAAAAAAAAAAA',5028924,'mainnet01',1723323640709427,0,'V6J3EQXrwfYjRHTrWwU5zYC_nVcpCUUy3ZwoLW3Zjuo','{"account": "k:e7f7130f359fb1f8c87873bf858a0e9cbc3c1059f62ae715ec72e760b055e9f3", "predicate": "keys-all", "public-keys": ["e7f7130f359fb1f8c87873bf858a0e9cbc3c1059f62ae715ec72e760b055e9f3"]}','-8LRuS61IU9mMMTMNLu_ArDOPaVSFixU9YPudK-hJV4','TCldtBl_LTOg31rYGmWRwoFFvLUZOuU-8qYA_DRPkhg','{"gas": 0, "logs": "H3_sn2pvT0mZtpOitPqtit5IzSFIHyJyISTC-PQi0JI", "txId": 11365355, "events": [{"name": "TRANSFER", "module": {"name": "coin", "namespace": null}, "params": ["", "k:e7f7130f359fb1f8c87873bf858a0e9cbc3c1059f62ae715ec72e760b055e9f3", 0.9773645], "moduleHash": "klFkrLfpyLW-M3xjVPSdqXEMgxPPJibRt_D6qiBws6s"}], "reqKey": "IkZlUGd2eDh3WkZ3X3lNUlZ4ZG5VRnQzTjhwaGJBVjJ4aEpnNy12Z01LTVEi", "result": {"data": "Write succeeded", "status": "success"}, "metaData": null, "continuation": null}',NULL,'2024-08-10 18:43:16.617-03','2024-08-10 18:43:16.617-03'),
	 ('11934451834503051337',1723326192771138,'V6J3EQXrwfYjRHTrWwU5zYC_nVcpCUUy3ZwoLW3Zjuo','{"6": "SLZBeShBG2L15u8p0kXhbtqWVXizJYvJZo6APGXBpUs", "11": "vcjF5PJGmhuog8fQ1o_7eOjK0zP8p7xT7p_s1DlQ7q8", "16": "9Fd40X0rna3uNWited4fVzgOQlNCoPVTDJeqhghKaPY"}','jVwwSVNSFOea-OCLJty6HJcrg2xbX-v8EwAAAAAAAAA','-qZ83zBw8hFMBbazbCHSA4dIO5YnKK45BoHyXol4tRk',1,'AYmsiSAbtc4qWgEAAAAAAAAAAAAAAAAAAAAAAAAAAAA',5028925,'mainnet01',1723323640709427,0,'e1iD7W30IidOBmHq2NhRbI37tzw9sDutdvPgcONgfuo','{"account": "c50b9acb49ca25f59193b95b4e08e52e2ec89fa1bf308e6436f39a40ac2dc4f3", "predicate": "keys-all", "public-keys": ["c50b9acb49ca25f59193b95b4e08e52e2ec89fa1bf308e6436f39a40ac2dc4f3"]}','5CIDBGQImUknQaakuns0_U3O_nWy2B2hXs9rjIwFXTM','mHe_bXYCRbnMjivJBfN6H-SOX6zMFoJk73c7mPEkgLk','{"gas": 0, "logs": "60RvWqO8aQjkK0vDGjYwke_rNeRcYVMYPx6TNjrup00", "txId": 11365370, "events": [{"name": "TRANSFER", "module": {"name": "coin", "namespace": null}, "params": ["", "c50b9acb49ca25f59193b95b4e08e52e2ec89fa1bf308e6436f39a40ac2dc4f3", 0.9773645], "moduleHash": "klFkrLfpyLW-M3xjVPSdqXEMgxPPJibRt_D6qiBws6s"}], "reqKey": "IlY2SjNFUVhyd2ZZalJIVHJXd1U1ellDX25WY3BDVVV5M1p3b0xXM1pqdW8i", "result": {"data": "Write succeeded", "status": "success"}, "metaData": null, "continuation": null}',NULL,'2024-08-10 18:43:16.707-03','2024-08-10 18:43:16.707-03'),
	 ('12689324720806261506',1723326239188308,'e1iD7W30IidOBmHq2NhRbI37tzw9sDutdvPgcONgfuo','{"6": "vwEm2wGG4nPlP0FGm4EirKO1In9mR76T6Q3YYlElZfs", "11": "AlhJBke3b0SG_11cCslulTEkJttXwg2wiPxw9KXYK3k", "16": "n_H6hLXANwLIKobltyxokED_AM_3xj2W-wQrbwyIBJg"}','jVwwSVNSFOea-OCLJty6HJcrg2xbX-v8EwAAAAAAAAA','cIt2dFPegQrY_u-4N2zfQ4vKGRVJ1vKCu7Bi1pmmGyY',1,'N1SS2_Pgg9sqWgEAAAAAAAAAAAAAAAAAAAAAAAAAAAA',5028926,'mainnet01',1723323640709427,0,'ptvmYQCPLzBeRKt69gDeL_zHmQvPbxW5U1Si_GMz1OM','{"account": "k:e7f7130f359fb1f8c87873bf858a0e9cbc3c1059f62ae715ec72e760b055e9f3", "predicate": "keys-all", "public-keys": ["e7f7130f359fb1f8c87873bf858a0e9cbc3c1059f62ae715ec72e760b055e9f3"]}','9yNSeh7rTW_j1ziKYyubdYUCefnO5K63d5RfPkHQXiM','Tbma4LuBpGXY6_739AWPNHI9640Bm0-XCaZyh0gbYuI','{"gas": 0, "logs": "duT6z7SUj1uv6rnSPxrkG5lVzIpPUIlXkLFb6p-yZN8", "txId": 11365374, "events": [{"name": "TRANSFER", "module": {"name": "coin", "namespace": null}, "params": ["", "k:e7f7130f359fb1f8c87873bf858a0e9cbc3c1059f62ae715ec72e760b055e9f3", 0.9773645], "moduleHash": "klFkrLfpyLW-M3xjVPSdqXEMgxPPJibRt_D6qiBws6s"}], "reqKey": "ImUxaUQ3VzMwSWlkT0JtSHEyTmhSYkkzN3R6dzlzRHV0ZHZQZ2NPTmdmdW8i", "result": {"data": "Write succeeded", "status": "success"}, "metaData": null, "continuation": null}',NULL,'2024-08-10 18:44:13.292-03','2024-08-10 18:44:13.292-03'),
	 ('1638854726024436573',1723326250503617,'ptvmYQCPLzBeRKt69gDeL_zHmQvPbxW5U1Si_GMz1OM','{"6": "lJsQ17-jTAHIL58E4N-CIno3jS3Kjlpug1qvmsPdGM8", "11": "TJsFp0o9n-o7yJMSEFLmznDu2iE69-gqeLhBZ6Rjgfs", "16": "8597SdOVyGE4jL2ON3daqIEj_eCB5HdbGvEy2EOR2cw"}','jVwwSVNSFOea-OCLJty6HJcrg2xbX-v8EwAAAAAAAAA','gfsvAMToOQFCg8sIxigqB4Q3S7qfRgSP_uonF_a553k',1,'bR94LcemUugqWgEAAAAAAAAAAAAAAAAAAAAAAAAAAAA',5028927,'mainnet01',1723323640709427,0,'J90jnPWkR6hinh2nxw9eCK2GuL1yzahNxCgF95R0iWc','{"account": "99cb7008d7d70c94f138cc366a825f0d9c83a8a2f4ba82c86c666e0ab6fecf3a", "predicate": "keys-all", "public-keys": ["99cb7008d7d70c94f138cc366a825f0d9c83a8a2f4ba82c86c666e0ab6fecf3a"]}','wJU1cO5nAexN3aSqlBttTs4sqpABkLe3r_f_wkjRyf4','uHTqXhIS0q7sD6LGXKpEPyEmJFMtAAeUmy89dcwmgc4','{"gas": 0, "logs": "iQNMdkei_MIFtLpBPf8LHjISR2CZfc3nPEW-Lw_IJH4", "txId": 11365375, "events": [{"name": "TRANSFER", "module": {"name": "coin", "namespace": null}, "params": ["", "99cb7008d7d70c94f138cc366a825f0d9c83a8a2f4ba82c86c666e0ab6fecf3a", 0.9773645], "moduleHash": "klFkrLfpyLW-M3xjVPSdqXEMgxPPJibRt_D6qiBws6s"}], "reqKey": "InB0dm1ZUUNQTHpCZVJLdDY5Z0RlTF96SG1RdlBieFc1VTFTaV9HTXoxT00i", "result": {"data": "Write succeeded", "status": "success"}, "metaData": null, "continuation": null}',NULL,'2024-08-10 18:44:30.007-03','2024-08-10 18:44:30.007-03');

INSERT INTO public."Blocks" (nonce,"creationTime",parent,adjacents,target,"payloadHash","chainId",weight,height,"chainwebVersion","epochStart","featureFlags",hash,"minerData","transactionsHash","outputsHash",coinbase,canonical,"createdAt","updatedAt") VALUES
	 ('12594872213516910694',1723326266455879,'J90jnPWkR6hinh2nxw9eCK2GuL1yzahNxCgF95R0iWc','{"6": "rrnIr_pcqN41oLsmyPDtao-WvJFKZQjl2rDGUJXxmW0", "11": "4Xk2dWxQs4p6E9bPkYIzc1TrLSXec4xrnO5tgic5uEU", "16": "ROU0KXieq_f8KtzHhrkKHd2g_6JSzXd38HQXIivB-lM"}','jVwwSVNSFOea-OCLJty6HJcrg2xbX-v8EwAAAAAAAAA','MW-rx7iE-eCQzQkEcirKZ7fHyTgDegVznYioRSHEUgU',1,'o-pdf5psIfUqWgEAAAAAAAAAAAAAAAAAAAAAAAAAAAA',5028928,'mainnet01',1723323640709427,0,'cNFNWLmZJaDGAtWiSttnyhxpi7ehtUnMoYU5k94_IQs','{"account": "c50b9acb49ca25f59193b95b4e08e52e2ec89fa1bf308e6436f39a40ac2dc4f3", "predicate": "keys-all", "public-keys": ["c50b9acb49ca25f59193b95b4e08e52e2ec89fa1bf308e6436f39a40ac2dc4f3"]}','9TbIkPWqU3ofulY8gVUV_qq7myce09CQWecFtt8thzg','m3Kh-WmjsobEiv0pSCzPTUcmdu4FzfZhF36uTGgMlEI','{"gas": 0, "logs": "pue93LeeMVEa3V9zMVHCdAJq0MZZqG6RDifEDk7jHqU", "txId": 11365379, "events": [{"name": "TRANSFER", "module": {"name": "coin", "namespace": null}, "params": ["", "c50b9acb49ca25f59193b95b4e08e52e2ec89fa1bf308e6436f39a40ac2dc4f3", 0.9773645], "moduleHash": "klFkrLfpyLW-M3xjVPSdqXEMgxPPJibRt_D6qiBws6s"}], "reqKey": "Iko5MGpuUFdrUjZoaW5oMm54dzllQ0syR3VMMXl6YWhOeENnRjk1UjBpV2Mi", "result": {"data": "Write succeeded", "status": "success"}, "metaData": null, "continuation": null}',NULL,'2024-08-10 18:44:49.168-03','2024-08-10 18:44:49.168-03'),
	 ('5076475562260316931',1723326284920591,'cNFNWLmZJaDGAtWiSttnyhxpi7ehtUnMoYU5k94_IQs','{"6": "3OtwISETeknqZ-2dhT4RkhMG2So-33sM4Yx5takJI-A", "11": "OIqnJ-_4Pdp3Ll7E8neAGLUIL63dH9aI62NMRDkzYb0", "16": "j-8YzPkUM44iUNwfci1xMwVmV-nPId0mAqKddJJ5N1g"}','jVwwSVNSFOea-OCLJty6HJcrg2xbX-v8EwAAAAAAAAA','f8tDdhk17WJMHRXKWzwBzvBUEzA8YnJgfrsFO9YvGbQ',1,'2bVD0W0y8AErWgEAAAAAAAAAAAAAAAAAAAAAAAAAAAA',5028929,'mainnet01',1723323640709427,0,'3hjFS8O1mri-anACvtzjEOuofwELNlt9zrG8FHkP94Y','{"account": "k:e7f7130f359fb1f8c87873bf858a0e9cbc3c1059f62ae715ec72e760b055e9f3", "predicate": "keys-all", "public-keys": ["e7f7130f359fb1f8c87873bf858a0e9cbc3c1059f62ae715ec72e760b055e9f3"]}','jM3EPaPYXtqjvN9sauHNMr2LvXD5KmECjMkqj7WUnb8','hmhyANOPRK_XVDwPby54S3OqNbwdztBznX_Wn3is6Wk','{"gas": 0, "logs": "a5Le6Lv5EzISt5PqaN3PFaufb09Y3f9crhno_hvQcaQ", "txId": 11365385, "events": [{"name": "TRANSFER", "module": {"name": "coin", "namespace": null}, "params": ["", "k:e7f7130f359fb1f8c87873bf858a0e9cbc3c1059f62ae715ec72e760b055e9f3", 0.9773645], "moduleHash": "klFkrLfpyLW-M3xjVPSdqXEMgxPPJibRt_D6qiBws6s"}], "reqKey": "ImNORk5XTG1aSmFER0F0V2lTdHRueWh4cGk3ZWh0VW5Nb1lVNWs5NF9JUXMi", "result": {"data": "Write succeeded", "status": "success"}, "metaData": null, "continuation": null}',NULL,'2024-08-10 18:44:49.167-03','2024-08-10 18:44:49.167-03'),
	 ('5344163401924028629',1723326338396721,'3hjFS8O1mri-anACvtzjEOuofwELNlt9zrG8FHkP94Y','{"6": "s3eweWqlrXDs45GLMkfBSx7ZWuIwyWD0Mfg1xjIDXIo", "11": "TGSG7oUQ6ERPLlTiipOQrbgAizy24ukE4pUIIB1yKus", "16": "9nyCQIh9bgqAgEhw4iKBepOK8eQtBnmJVH_5P1y6sAo"}','jVwwSVNSFOea-OCLJty6HJcrg2xbX-v8EwAAAAAAAAA','X8I1MQAmII-0UMQsbj5Xwk_ibbzmK-0e1iF5WZDTHV4',1,'D4EpI0H4vg4rWgEAAAAAAAAAAAAAAAAAAAAAAAAAAAA',5028930,'mainnet01',1723323640709427,0,'mO59QIewDOlYUwLxvKIVwL-LGafgsA0vJ-CCI47inIM','{"account": "k:251efb06f3b798dbe7bb3f58f535b67b0a9ed2da9aa4e2367be4abc07cc927fa", "predicate": "keys-all", "public-keys": ["251efb06f3b798dbe7bb3f58f535b67b0a9ed2da9aa4e2367be4abc07cc927fa"]}','IPrq2672iNbp4ru1_2BGEumSZhhwIKVdcOvdf_tEooQ','10Fb64IS4MVi9W_uN7d5eBTHjYcHKC4_KzUrZBOfz6c','{"gas": 0, "logs": "wWonHWP22OGrJtiYgNWG3RV1Nul0_yKVIlIwu1lapfU", "txId": 11365389, "events": [{"name": "TRANSFER", "module": {"name": "coin", "namespace": null}, "params": ["", "k:251efb06f3b798dbe7bb3f58f535b67b0a9ed2da9aa4e2367be4abc07cc927fa", 0.9773645], "moduleHash": "klFkrLfpyLW-M3xjVPSdqXEMgxPPJibRt_D6qiBws6s"}], "reqKey": "IjNoakZTOE8xbXJpLWFuQUN2dHpqRU91b2Z3RUxObHQ5enJHOEZIa1A5NFki", "result": {"data": "Write succeeded", "status": "success"}, "metaData": null, "continuation": null}',NULL,'2024-08-10 18:45:58.574-03','2024-08-10 18:45:58.574-03'),
	 ('4416853577263830722',1723326351951436,'mO59QIewDOlYUwLxvKIVwL-LGafgsA0vJ-CCI47inIM','{"6": "5flAwOU59UrFM9nVI6eYXdNds-a2OJxnyG9M67vRYlo", "11": "sRKOgGa1VxLFbs6S1Hbqu9JVx66P2LsI-JmTemkWqGg", "16": "RxADjCgpVwTZjzXH_m42ziRKV00io3gH01yQI63en-A"}','jVwwSVNSFOea-OCLJty6HJcrg2xbX-v8EwAAAAAAAAA','Z4ynsKG9rwWZGqsLSmRDLYPC4APjwQWsVJEa6gUPCN0',1,'RUwPdRS-jRsrWgEAAAAAAAAAAAAAAAAAAAAAAAAAAAA',5028931,'mainnet01',1723323640709427,0,'SG2IH8yxO9PIS1PNC2Qtdi7ahupB04Yp0Q4iQRzqkOU','{"account": "k:251efb06f3b798dbe7bb3f58f535b67b0a9ed2da9aa4e2367be4abc07cc927fa", "predicate": "keys-all", "public-keys": ["251efb06f3b798dbe7bb3f58f535b67b0a9ed2da9aa4e2367be4abc07cc927fa"]}','T_QMP3hdWT87uFacq_D8GX0X1a5pr8V68l_XXZqU3_c','17VXbDkLeaetZpGwCRTmPcrcUlK7ncyUoWa0csTjw18','{"gas": 0, "logs": "6LEbds4sJZwhPI0acm560uOv6PDprUdIq1lCzh6IzIg", "txId": 11365396, "events": [{"name": "TRANSFER", "module": {"name": "coin", "namespace": null}, "params": ["", "k:251efb06f3b798dbe7bb3f58f535b67b0a9ed2da9aa4e2367be4abc07cc927fa", 0.9773645], "moduleHash": "klFkrLfpyLW-M3xjVPSdqXEMgxPPJibRt_D6qiBws6s"}], "reqKey": "Im1PNTlRSWV3RE9sWVV3THh2S0lWd0wtTEdhZmdzQTB2Si1DQ0k0N2luSU0i", "result": {"data": "Write succeeded", "status": "success"}, "metaData": null, "continuation": null}',NULL,'2024-08-10 18:45:58.592-03','2024-08-10 18:45:58.592-03'),
	 ('4874131663433790634',1723326388235345,'SG2IH8yxO9PIS1PNC2Qtdi7ahupB04Yp0Q4iQRzqkOU','{"6": "GCoJWserDpoW2Sn_T1KKARoBTOoZg1AEbZ5aacIOkWE", "11": "heoX-VcHM0fpcjb9xDuCgoB7Pv2_HeIOPtHhViW57L8", "16": "A5Dqc7IK4D9BPJWS2GmY3RHg0XmOSWZyAg2m_0KqibU"}','jVwwSVNSFOea-OCLJty6HJcrg2xbX-v8EwAAAAAAAAA','GXpQza66OjCZ-4r0EsySSJgtZTQOYP_MgX6JHwvaGmU',1,'exf1xueDXCgrWgEAAAAAAAAAAAAAAAAAAAAAAAAAAAA',5028932,'mainnet01',1723323640709427,0,'Wxd5_3DUDlLETOiPIS_sm2vkw0TlLh4PJk6-sWrQMP0','{"account": "k:e7f7130f359fb1f8c87873bf858a0e9cbc3c1059f62ae715ec72e760b055e9f3", "predicate": "keys-all", "public-keys": ["e7f7130f359fb1f8c87873bf858a0e9cbc3c1059f62ae715ec72e760b055e9f3"]}','9yNSeh7rTW_j1ziKYyubdYUCefnO5K63d5RfPkHQXiM','AqoIM8SFwyZcXERDyEqe5Pw5ItTkx5LxQh5UHy2cCn0','{"gas": 0, "logs": "4-qt1AOnqG2TVCE8rpJBdEjf-Z79JI7Y1WM1HxPDEHs", "txId": 11365397, "events": [{"name": "TRANSFER", "module": {"name": "coin", "namespace": null}, "params": ["", "k:e7f7130f359fb1f8c87873bf858a0e9cbc3c1059f62ae715ec72e760b055e9f3", 0.9773645], "moduleHash": "klFkrLfpyLW-M3xjVPSdqXEMgxPPJibRt_D6qiBws6s"}], "reqKey": "IlNHMklIOHl4TzlQSVMxUE5DMlF0ZGk3YWh1cEIwNFlwMFE0aVFSenFrT1Ui", "result": {"data": "Write succeeded", "status": "success"}, "metaData": null, "continuation": null}',NULL,'2024-08-10 18:46:32.95-03','2024-08-10 18:46:32.95-03'),
	 ('9599168347288979823',1723326419080404,'Wxd5_3DUDlLETOiPIS_sm2vkw0TlLh4PJk6-sWrQMP0','{"6": "CPF3XSmX1Ic8QKhCI52Lje5BodA3Qv0-ilfDK_ELhdk", "11": "_lTCdsj_F7sMe0Ans2rGQxwkMm6E-Y2-b19kFCFRc24", "16": "VjFI7bHGdMt2Ha8VBJigY1qfCFqOEJZBeo8Z3oDxpwg"}','jVwwSVNSFOea-OCLJty6HJcrg2xbX-v8EwAAAAAAAAA','710wFhl_ZyhalexiF1BBtV6ohwV2EqGnMtRXVNcAweU',1,'seLaGLtJKzUrWgEAAAAAAAAAAAAAAAAAAAAAAAAAAAA',5028933,'mainnet01',1723323640709427,0,'tIVqUavngymHm8bA3aFqBAoZS6h4giOx9obmJDsOCSA','{"account": "k:251efb06f3b798dbe7bb3f58f535b67b0a9ed2da9aa4e2367be4abc07cc927fa", "predicate": "keys-all", "public-keys": ["251efb06f3b798dbe7bb3f58f535b67b0a9ed2da9aa4e2367be4abc07cc927fa"]}','3GOPjVyPxCjmpfKkQMtNlu5Y28isJkFxVJtkAMzjw18','Cpi4rsX1O9n8vdwihQkB4NF3GDOKRsT-yqyH-fTBH1c','{"gas": 0, "logs": "Ye3C7Ugemmaq8H1raDUJCTHRWyq_CLG2lDRCNSwsahw", "txId": 11365398, "events": [{"name": "TRANSFER", "module": {"name": "coin", "namespace": null}, "params": ["", "k:251efb06f3b798dbe7bb3f58f535b67b0a9ed2da9aa4e2367be4abc07cc927fa", 0.9773645], "moduleHash": "klFkrLfpyLW-M3xjVPSdqXEMgxPPJibRt_D6qiBws6s"}], "reqKey": "Ild4ZDVfM0RVRGxMRVRPaVBJU19zbTJ2a3cwVGxMaDRQSms2LXNXclFNUDAi", "result": {"data": "Write succeeded", "status": "success"}, "metaData": null, "continuation": null}',NULL,'2024-08-10 18:47:14.313-03','2024-08-10 18:47:14.313-03'),
	 ('8460043757973625117',1723326434854365,'tIVqUavngymHm8bA3aFqBAoZS6h4giOx9obmJDsOCSA','{"6": "joCOOxjYKlNCdaqDy5woNQOSheZqKMb5Ccb3562zDt4", "11": "MlhAyf_A8px_XeleIaIvJtRlzIblcYRWi4UsD_sOGkI", "16": "yV89c6FAg-WbckBMFYv5U-SsXhFB74jnA-aMRNyXUcI"}','jVwwSVNSFOea-OCLJty6HJcrg2xbX-v8EwAAAAAAAAA','w7B4jdWnSPmkNk38_7NQl9T28egP2idFfXF7ZT1L3Fs',1,'563Aao4P-kErWgEAAAAAAAAAAAAAAAAAAAAAAAAAAAA',5028934,'mainnet01',1723323640709427,0,'eYPYmcsDlv67PtiWSZlnYKjr2ibC5q2qRCUSWLtUIqM','{"account": "k:e7f7130f359fb1f8c87873bf858a0e9cbc3c1059f62ae715ec72e760b055e9f3", "predicate": "keys-all", "public-keys": ["e7f7130f359fb1f8c87873bf858a0e9cbc3c1059f62ae715ec72e760b055e9f3"]}','9yNSeh7rTW_j1ziKYyubdYUCefnO5K63d5RfPkHQXiM','VkKDvlkaZqPtECqfVtAXJ697p_HkuED4lLUb-8dpSxE','{"gas": 0, "logs": "JSGiLojsd77Ac0KLSBsc9OSq4fp01zuQEwFZctcsFdg", "txId": 11365402, "events": [{"name": "TRANSFER", "module": {"name": "coin", "namespace": null}, "params": ["", "k:e7f7130f359fb1f8c87873bf858a0e9cbc3c1059f62ae715ec72e760b055e9f3", 0.9773645], "moduleHash": "klFkrLfpyLW-M3xjVPSdqXEMgxPPJibRt_D6qiBws6s"}], "reqKey": "InRJVnFVYXZuZ3ltSG04YkEzYUZxQkFvWlM2aDRnaU94OW9ibUpEc09DU0Ei", "result": {"data": "Write succeeded", "status": "success"}, "metaData": null, "continuation": null}',NULL,'2024-08-10 18:47:30.477-03','2024-08-10 18:47:30.477-03'),
	 ('3278539444414199279',1723326446486490,'eYPYmcsDlv67PtiWSZlnYKjr2ibC5q2qRCUSWLtUIqM','{"6": "MeLnUaY8pqIN2JEoBDxqat0mSh88Ahm5goMlnUr5Psk", "11": "8FscmJhBvy4YmpZrYbUAPvxPWoqZnUMv_qeVaYkstsM", "16": "oe2wqZoaY5JoTuw_B0iCICBzxcHNr6bb4JB9O4dHGCw"}','jVwwSVNSFOea-OCLJty6HJcrg2xbX-v8EwAAAAAAAAA','kPZZefjvRjpkKcZ2X33cKTAr8b2ZBKA8VgBCeSX60L8',1,'HXmmvGHVyE4rWgEAAAAAAAAAAAAAAAAAAAAAAAAAAAA',5028935,'mainnet01',1723323640709427,0,'Pv9tgSsEAjmr7-gbvkaa_Lz9DAEi0DBDXAW2n6GdU1E','{"account": "k:251efb06f3b798dbe7bb3f58f535b67b0a9ed2da9aa4e2367be4abc07cc927fa", "predicate": "keys-all", "public-keys": ["251efb06f3b798dbe7bb3f58f535b67b0a9ed2da9aa4e2367be4abc07cc927fa"]}','6qlL-s8sBQtJH2_Gm3n3-2KM10wV3GUhtPczL536Jnk','oqRPGogNQriZXSQEF2_N-TKD0bwsWDiTPCJRBbEv84E','{"gas": 0, "logs": "jL7pzhKKn5xDBwkNGh6T3SweKc3TOxD1AbtTj4BU7iY", "txId": 11365403, "events": [{"name": "TRANSFER", "module": {"name": "coin", "namespace": null}, "params": ["", "k:251efb06f3b798dbe7bb3f58f535b67b0a9ed2da9aa4e2367be4abc07cc927fa", 0.9773645], "moduleHash": "klFkrLfpyLW-M3xjVPSdqXEMgxPPJibRt_D6qiBws6s"}], "reqKey": "ImVZUFltY3NEbHY2N1B0aVdTWmxuWUtqcjJpYkM1cTJxUkNVU1dMdFVJcU0i", "result": {"data": "Write succeeded", "status": "success"}, "metaData": null, "continuation": null}',NULL,'2024-08-10 18:47:33.006-03','2024-08-10 18:47:33.006-03'),
	 ('1815707750662429817',1723326478358588,'Pv9tgSsEAjmr7-gbvkaa_Lz9DAEi0DBDXAW2n6GdU1E','{"6": "U15bHLRrTx4eArCn09zsOaYh2NT6l-O24d-k_n5u6Jw", "11": "PqRr_vEGTDwGzQMiZgKS8-2b8n1cIaFSoFrROcFf2NY", "16": "MEuXXKH_JbgxAD1sjYaHJqi0NvxdqqvLt07JShqdjF8"}','jVwwSVNSFOea-OCLJty6HJcrg2xbX-v8EwAAAAAAAAA','QWbeXC2ZN5M3Q61UEgh7BVlaR5BmJ3X8bp97RDUIE5w',1,'U0SMDjWbl1srWgEAAAAAAAAAAAAAAAAAAAAAAAAAAAA',5028936,'mainnet01',1723323640709427,0,'7NXUqUY3AI6I070BN8u7o6OMNdDwwS0kZZXYZviGUjk','{"account": "k:251efb06f3b798dbe7bb3f58f535b67b0a9ed2da9aa4e2367be4abc07cc927fa", "predicate": "keys-all", "public-keys": ["251efb06f3b798dbe7bb3f58f535b67b0a9ed2da9aa4e2367be4abc07cc927fa"]}','mE79HOEokZDuc1a9J4nlSRIrSqBJ6MHYFubUWMrNTQg','hVWKx6mpemMcqpnfk2z9edRmmYeIyXxor6R_ykcjOTI','{"gas": 0, "logs": "yAb__hIkO4c8rPihrxOIodtYsLG8f36JWBxMbHpng5I", "txId": 11365410, "events": [{"name": "TRANSFER", "module": {"name": "coin", "namespace": null}, "params": ["", "k:251efb06f3b798dbe7bb3f58f535b67b0a9ed2da9aa4e2367be4abc07cc927fa", 0.9773645], "moduleHash": "klFkrLfpyLW-M3xjVPSdqXEMgxPPJibRt_D6qiBws6s"}], "reqKey": "IlB2OXRnU3NFQWptcjctZ2J2a2FhX0x6OURBRWkwREJEWEFXMm42R2RVMUUi", "result": {"data": "Write succeeded", "status": "success"}, "metaData": null, "continuation": null}',NULL,'2024-08-10 18:48:07.473-03','2024-08-10 18:48:07.473-03');
