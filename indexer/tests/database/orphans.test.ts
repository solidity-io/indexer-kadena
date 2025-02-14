import { assert } from 'console';
import { Client } from 'pg';
import { execSync } from 'child_process';

describe('check_backward_orphans Function with Dockerized Database', () => {
  let client: Client;

  before(async function () {
    this.timeout(120000); // 2 minutes

    const dockerComposeDir = __dirname;
    console.log('Starting Docker container in directory:', dockerComposeDir);
    try {
      execSync('docker-compose up -d test-db', { cwd: dockerComposeDir });
      console.log('Docker container started successfully.');
    } catch (error) {
      console.error('Failed to start Docker container:', error);
      throw error;
    }

    console.log('Waiting for the database to be ready...');

    await new Promise(resolve => setTimeout(resolve, 20000)); // Wait 20 seconds for the database to be ready
    console.log('Database should be ready now.');

    console.log('Connecting to the test database...');
    try {
      client = new Client({
        user: 'test_user',
        host: 'localhost',
        database: 'test_db',
        password: 'test_password',
        port: 5432,
      });
      await client.connect();
      console.log('Connected to the test database successfully.');
    } catch (error) {
      console.error('Failed to connect to the test database:', error);
      throw error;
    }
  });

  after(async function () {
    if (client) {
      console.log('Closing the database connection...');
      await client.end();
      console.log('Database connection closed.');
    }

    const dockerComposeDir = __dirname;
    console.log('Stopping and removing Docker container...');
    execSync('docker-compose down --volumes', { cwd: dockerComposeDir });
    console.log('Docker container stopped and removed.');
  });

  it('should correctly identify orphan blocks', async () => {
    /* GIVEN a block that is in the buffer zone
        WHEN the block is analyzed for canonical status
        THEN the block should not be marked as canonical */

    const res1 = await getBlock(5028930, 1, 'mainnet01');

    assert(
      res1.rows[0].canonical == null,
      'Block 5028930 should not have been analyzed for canonical status yet, because it is in buffer zone',
    );

    await client.query(`
            INSERT INTO public."Blocks" (nonce,"creationTime",parent,adjacents,target,"payloadHash","chainId",weight,height,"chainwebVersion","epochStart","featureFlags",hash,"minerData","transactionsHash","outputsHash",coinbase,canonical,"createdAt","updatedAt") VALUES ('10022758274919128455',1723326500041787,'7NXUqUY3AI6I070BN8u7o6OMNdDwwS0kZZXYZviGUjk','{"6": "CcU_QgckldBQTHDEheeX4ht_GljxUAR6DCyXUrICYYY", "11": "Ns7WjS4Q4tYz7Gbe4oh7Y7J9SHma65D0exW36LjrIxI", "16": "zmG3SHVzZHFCNUlxw3kNigCJ1-kcinU1kw2u8mLtQFM"}','jVwwSVNSFOea-OCLJty6HJcrg2xbX-v8EwAAAAAAAAA','J8i-GvdqQeWwRxk9mqWOLtK1FZfqoPTaMOVnovWoR84',1,'iQ9yYAhhZmgrWgEAAAAAAAAAAAAAAAAAAAAAAAAAAAA',5028937,'mainnet01',1723323640709427,0,'CX0nyqXxIkLa66m-kv1wEHYtQ8ak5Ko-sh1o5etTvM8','{"account": "k:e7f7130f359fb1f8c87873bf858a0e9cbc3c1059f62ae715ec72e760b055e9f3", "predicate": "keys-all", "public-keys": ["e7f7130f359fb1f8c87873bf858a0e9cbc3c1059f62ae715ec72e760b055e9f3"]}','9yNSeh7rTW_j1ziKYyubdYUCefnO5K63d5RfPkHQXiM','GAWcRP0tOrk2OlapaDDTqr6oNEHi5XhlDrX4xrgdUFY','{"gas": 0, "logs": "34ed4akeGyx1MyEhuBY7M7YNjEwwfbaKbt3VxViH-cQ", "txId": 11365414, "events": [{"name": "TRANSFER", "module": {"name": "coin", "namespace": null}, "params": ["", "k:e7f7130f359fb1f8c87873bf858a0e9cbc3c1059f62ae715ec72e760b055e9f3", 0.9773645], "moduleHash": "klFkrLfpyLW-M3xjVPSdqXEMgxPPJibRt_D6qiBws6s"}], "reqKey": "IjdOWFVxVVkzQUk2STA3MEJOOHU3bzZPTU5kRHd3UzBrWlpYWVp2aUdVamsi", "result": {"data": "Write succeeded", "status": "success"}, "metaData": null, "continuation": null}',NULL,'2024-08-10 18:48:26.982-03','2024-08-10 18:48:26.982-03')
        `);

    /* GIVEN a block that is not in the buffer zone
        WHEN the block is analyzed for canonical status and is not an orphan
        THEN the block should be marked as canonical */

    const validatedBlock = await getBlock(5028930, 1, 'mainnet01');

    assert(validatedBlock.rows[0].canonical == true, 'Block 5028930 should be marked as canonical');

    /* GIVEN a block that is in the buffer zone
        WHEN the block is analyzed for canonical status
        THEN the block should not be marked as canonical */

    const nonValidatedBlock = await getBlock(5028931, 1, 'mainnet01');

    assert(
      nonValidatedBlock.rows[0].canonical == null,
      'Block 5028931 should not have been analyzed for canonical status yet, because it is in buffer zone',
    );

    /* GIVEN a block that is not in the buffer zone
        WHEN the block is analyzed for canonical status and is an orphan
        THEN the block should not be marked as canonical */

    const orphanBlock = await getBlock(
      5028903,
      1,
      'mainnet01',
      'YdFEVJdW77DwN1Lp8WyH7mGWF5iRRn-XIz_ENRPMozw',
    );

    assert(orphanBlock.rows[0].canonical == false, 'Block 5028903 should be an orphan block');

    /* GIVEN a block that is not in the buffer zone
        WHEN the block is analyzed for canonical status and is not an orphan
        THEN the block should be marked as canonical */

    const nonOrphanBlock = await getBlock(
      5028903,
      1,
      'mainnet01',
      't-OSh9Zu0YCpwOAEsbD3pIHTEwO0c031O-hpqeSXwQc',
    );

    assert(nonOrphanBlock.rows[0].canonical == true, 'Block 5028903 should not be an orphan block');
  });

  function getBlock(height: number, chainId: number, chainwebVersion: string, hash?: string) {
    var query = `
            SELECT * from public."Blocks" WHERE "height" = ${height} and "chainId" = ${chainId} and "chainwebVersion" = '${chainwebVersion}' ${hash ? ` and "hash" = '${hash}'` : ''};
        `;
    return client.query(query);
  }
});
