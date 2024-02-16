variable "AWS_ACCESS_KEY_ID" {
  description = "AWS access key"
  type        = string
}

variable "AWS_SECRET_ACCESS_KEY" {
  description = "AWS secret key"
  type        = string
}

variable "AWS_ACCOUNT_ID" {
  description = "AWS account ID"
  type        = string
}

variable "AWS_USER_NAME" {
  description = "AWS user name"
  type        = string
}

provider "aws" {
  region     = "us-east-1"
  access_key = var.AWS_ACCESS_KEY_ID
  secret_key = var.AWS_SECRET_ACCESS_KEY
}

resource "aws_s3_bucket" "kadena_indexer_bucket" {
  bucket = "kadena-indexer-data"

  tags = {
    Name        = "My S3 Bucket"
    Environment = "Development"
  }
}

resource "aws_s3_bucket_policy" "kadena_indexer_bucket_policy" {
  bucket = aws_s3_bucket.kadena_indexer_bucket.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action    = ["s3:GetObject", "s3:PutObject", "s3:DeleteObject"],
        Effect    = "Allow",
        Resource  = "arn:aws:s3:::${aws_s3_bucket.kadena_indexer_bucket.bucket}/*",
        Principal = { "AWS" : "arn:aws:iam::${var.AWS_ACCOUNT_ID}:user/${var.AWS_USER_NAME}" }
      },
      {
        Action    = "s3:ListBucket",
        Effect    = "Allow",
        Resource  = aws_s3_bucket.kadena_indexer_bucket.arn,
        Principal = { "AWS" : "arn:aws:iam::${var.AWS_ACCOUNT_ID}:user/${var.AWS_USER_NAME}" }
      }
    ]
  })
}
