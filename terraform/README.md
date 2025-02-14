# Kadena Indexer - Terraform Configuration

### 🚀 Getting Started
- [Introduction](#1-introduction)
- [Prerequisites](#2-prerequisites)

### ⚙️ Configuration
- [Environment Setup](#3-environment-setup)
  - [Configure AWS Credentials](#31-configure-aws-credentials)
  - [Environment Variables](#32-environment-variables)

### 🛠️ Infrastructure Management
- [Terraform Operations](#4-terraform-operations)
  - [Initialize](#41-initialize-terraform)
  - [Deploy](#42-deploy-infrastructure)
  - [Destroy](#43-destroy-infrastructure)
  - [Local Testing](#44-local-workflow-testing)

## 1. Introduction
This directory contains the infrastructure configuration for running the Kadena indexer assuming that you have already set up your Kadena node.

## 2. Prerequisites
- [Terraform](https://www.terraform.io/downloads.html)
- [AWS CLI](https://aws.amazon.com/cli/)
- [AWS Account](https://aws.amazon.com/)
- [AWS Access Key](https://docs.aws.amazon.com/general/latest/gr/aws-sec-cred-types.html#access-keys-and-secret-access-keys)

## 3. Environment Setup

### 3.1. Configure AWS Credentials
Create an `.env` file using the `.env.template` as a reference:
```bash
cp .env.template .env
```

### 3.2. Environment Variables
Required variables:
- `TF_VAR_AWS_ACCESS_KEY_ID`: Your AWS access key ID
- `TF_VAR_AWS_SECRET_ACCESS_KEY`: Your AWS secret access key
- `TF_VAR_AWS_ACCOUNT_ID`: Your AWS account ID
- `TF_VAR_AWS_USER_NAME`: The name of the user created in AWS
- `TF_VAR_AWS_DB_USERNAME`: Username for the PostgreSQL database
- `TF_VAR_AWS_DB_PASSWORD`: Password for the PostgreSQL database

Don't forget to define the remaining variables. Their values are described in [Environment Variables Reference](../indexer/README.md#32-environment-variables-reference).

## 4. Terraform Operations

### 4.1. Initialize Terraform
```bash
terraform init
```

### 4.2. Deploy Infrastructure
```bash
yarn terraform plan
yarn terraform apply
```

### 4.3. Destroy Infrastructure
```bash
yarn terraform destroy
```

### 4.4. Local Workflow Testing

**NOTE:** This is not being actively maintained at the moment.

Install act for local testing:
```bash
# For MacOS
brew install act

# For Linux
sudo apt-get update
sudo apt-get install act
```

Run the terraform workflow:
```bash
yarn run-terraform-workflow
```
