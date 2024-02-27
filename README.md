# Kadena Indexer

This project is a monorepo that contains the following packages:

- `@kadena-indexer/indexer`: The indexer package, which is responsible for scanning and storing blocks for Kadena blockchain.
- `@kadena-indexer/terraform`: The Terraform configuration for provisioning the infrastructure required to run the indexer and the node.

## Prerequisites

- [Terraform](https://www.terraform.io/downloads.html)
- [AWS CLI](https://aws.amazon.com/cli/)
- [AWS Account](https://aws.amazon.com/)
- [AWS Access Key](https://docs.aws.amazon.com/general/latest/gr/aws-sec-cred-types.html#access-keys-and-secret-access-keys)

## Quick Start

### Terraform Setup

```bash
wget https://releases.hashicorp.com/terraform/1.7.3/terraform_1.7.3_linux_amd64.zip
unzip terraform_1.7.3_linux_amd64.zip
sudo mv terraform /usr/local/bin/
terraform version
```

### Configure Environment Variables

Create an `.env` file using the `.env.template` as a reference and set the environment variables accordingly.

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

## Installation

Set up the indexer with the following commands:

```bash
yarn && yarn indexer build
```

## Features

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
