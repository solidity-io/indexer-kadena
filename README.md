# Kadena Indexer

This project is a monorepo that contains the following packages:

- `@kadena-indexer/indexer`: The indexer package, which is responsible for scanning and storing blocks for Kadena blockchain.
- `@kadena-indexer/terraform`: The Terraform configuration for provisioning the infrastructure required to run the indexer and the node.

## Prerequisites

- [Terraform](https://www.terraform.io/downloads.html)
- [AWS CLI](https://aws.amazon.com/cli/)
- [AWS Account](https://aws.amazon.com/)
- [AWS Access Key](https://docs.aws.amazon.com/general/latest/gr/aws-sec-cred-types.html#access-keys-and-secret-access-keys)

### Dev Container

This project is configured to run in a dev container. You can use the `Dev Containers: Open Folder in Container` command in VSCode to open the project in a dev container. This will automatically install the required dependencies and set up the environment. To use the dev container, you need to have Docker installed on your machine.

If you don't have Dev Containers installed, you can install it from the [VSCode Marketplace](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers).

### Configure Environment Variables

Under the `/terraform` directory, create an `.env` file using the `.env.template` as a reference and set the environment variables accordingly.

```bash
cp terraform/.env.template terraform/.env
```

`TF_VAR_AWS_ACCESS_KEY_ID` is your AWS access key ID.
`TF_VAR_AWS_SECRET_ACCESS_KEY` is your AWS secret access key.
`TF_VAR_AWS_ACCOUNT_ID` is your AWS account ID.
`TF_VAR_AWS_USER_NAME` is the name of the user you created in AWS.
`TF_VAR_AWS_DB_USERNAME` is the username for the postgress database.
`TF_VAR_AWS_DB_PASSWORD` is the password for the postgress database.

Under the `/indexer` directory, create an `.env` file using the `.env.template` as a reference and set the environment variables accordingly.

```bash
cp indexer/.env.template indexer/.env
```

`AWS_S3_REGION` is the region where the S3 bucket is located.
`AWS_S3_BUCKET_NAME` is the name of the S3 bucket where the data will be stored.
`AWS_ACCESS_KEY_ID` is the access key ID for the S3 bucket.
`AWS_SECRET_ACCESS_KEY` is the secret access key for the S3 bucket.

`SYNC_BASE_URL` is the base URL for the Kadena node.
`SYNC_MIN_HEIGHT` is the minimum height to start syncing from.
`SYNC_FETCH_INTERVAL_IN_BLOCKS` is the interval in blocks to fetch.
`SYNC_TIME_BETWEEN_REQUESTS_IN_MS` is the time between requests in milliseconds.
`SYNC_ATTEMPTS_MAX_RETRY` is the maximum number of attempts to retry.
`SYNC_ATTEMPTS_INTERVAL_IN_MS` is the interval in milliseconds between attempts.
`SYNC_NETWORK` is the network to sync.

`DB_USERNAME` is the username for the postgress database.
`DB_PASSWORD` is the password for the postgress database.
`DB_NAME` is the name of the postgress database.
`DB_HOST` is the host for the postgress database. You have the host after the resource creation, so you can check for this information in the AWS console or in terraform output (postgres_db_host).

### Initialize Terraform

Initialize your Terraform workspace, which will download the provider and initialize it with the values provided in the terraform.`tfvars`` file.

```bash
terraform init
```

### Deploy Infrastructure

Plan and apply the Terraform configuration to provision your AWS resources:

```bash
yarn terraform plan
yarn terraform apply
```

### Destroy Infrastructure

If you want to destroy the infrastructure created, you can use the following command:

```bash
yarn terraform destroy
```

## Installation

Set up the indexer with the following commands:

```bash
yarn && yarn indexer build
```

## Features

### Run processing

Continuous process of streaming, headers, payloads and missing blocks from node to s3 bucket and from s3 bucket to database

```bash
yarn indexer dev:run
```

## Additional Commands

### Backfilling Blocks

Scan for and store historical blocks.

```bash
yarn indexer dev:backfill
```

### Streaming Blocks

Listen for new blocks and store them in real-time.

```bash
yarn indexer dev:streaming
```

### Identifying Missing Blocks

Scan for and store any blocks that were missed.

```bash
yarn indexer dev:missing
```

### Processing Headers

Start the header processing from S3 to the database.

```bash
yarn indexer dev:headers
```

### Processing Payloads

Start the payload processing from S3 to the database.

```bash
yarn indexer dev:payloads
```

## Advanced Usage

### Local Workflow Testing

For testing workflows locally, act is required. Install it using Homebrew:

```bash
brew install act
```

### Run Terraform Workflow Manually

If you want to run the terraform workflow manually, you can use the following command:

```bash
yarn run-terraform-workflow
```

### Run Indexer Workflow Manually

If you want to run the indexer workflow manually, you can use the following command:

```bash
yarn run-indexer-workflow
```
