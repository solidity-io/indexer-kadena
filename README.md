# Terraform

Terraform is an open-source infrastructure as code software tool created by HashiCorp. It enables users to define and provision a datacenter infrastructure using a declarative configuration language. This project use Terraform to create all the necessary resources to run the application.

## Prerequisites

- [Terraform](https://www.terraform.io/downloads.html)
- [AWS CLI](https://aws.amazon.com/cli/)
- [AWS Account](https://aws.amazon.com/)
- [AWS Access Key](https://docs.aws.amazon.com/general/latest/gr/aws-sec-cred-types.html#access-keys-and-secret-access-keys)

## Usage

### Install

```bash
wget https://releases.hashicorp.com/terraform/1.7.3/terraform_1.7.3_linux_amd64.zip
unzip terraform_1.7.3_linux_amd64.zip
sudo mv terraform /usr/local/bin/
terraform version
```

### Initialize

```bash
terraform init

export TF_VAR_AWS_ACCESS_KEY_ID="YOUR_ACCESS_KEY_ID"
export TF_VAR_AWS_SECRET_ACCESS_KEY="YOUR_SECRET_ACCESS_KEY"
export TF_VAR_AWS_ACCOUNT_ID="YOUR_AWS_ACCOUNT_ID"
export TF_VAR_AWS_USER_NAME="YOUR_AWS_USER_NAME"
```

### Plan

```bash
yarn terraform plan
```

### Apply

```bash
yarn terraform apply
```

# Kadena Indexer

This is a indexer for the Kadena blockchain. It is a work in progress and is not yet ready for production use.

## Getting Started

```bash
yarn && yarn indexer build
```

## Start Indexer::Filling

```bash
yarn indexer dev:startFill
```

## Start Indexer::Streaming

```bash
yarn indexer dev:startStreaming
```

## Start Indexer::Filling (Production)

```bash
yarn indexer prod:start
```

## Workflows

In order to test the workflows locally, you need to install [act](https://github.com/nektos/act).
You can install it using the following command:

```bash
brew install act
```

If you want to run the terraform workflow manually, you can use the following command:

```bash
yarn run-terraform-workflow
```

If you want to run the indexer workflow manually, you can use the following command:

```bash
yarn run-indexer-workflow
```
