# Configure the AWS Provider

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

# Configure AWS RDS

variable "AWS_DB_INSTANCE_CLASS" {
  description = "The instance type of the RDS instance"
  type        = string
  default     = "db.t3.medium"
}

variable "AWS_DB_NAME" {
  description = "The name of the database to create"
  type        = string
  default     = "indexer"
}

variable "AWS_DB_USERNAME" {
  description = "Username for the database"
  type        = string
  default     = "postgres"
}

variable "AWS_DB_PASSWORD" {
  description = "Password for the database"
  type        = string
}

variable "AWS_DB_ALLOCATED_STORAGE" {
  description = "The allocated storage size for the RDS instance (in gigabytes)"
  type        = number
  default     = 30
}

# Configure AWS S3

variable "AWS_S3_REGION" {
  description = "AWS S3 region"
  type        = string
}

variable "AWS_S3_BUCKET_NAME" {
  description = "AWS S3 bucket name"
  type        = string
}

# Configure DB

variable "DB_HOST" {
  description = "Database host"
  type        = string
}

variable "DB_USERNAME" {
  description = "Database username"
  type        = string
}

variable "DB_PASSWORD" {
  description = "Database password"
  type        = string
  sensitive   = true
}

variable "DB_NAME" {
  description = "Database name"
  type        = string
}

# Configure Sync

variable "SYNC_BASE_URL" {
  description = "Sync base URL"
  type        = string
}

variable "SYNC_MIN_HEIGHT" {
  description = "Sync min height"
  type        = string
}

variable "SYNC_FETCH_INTERVAL_IN_BLOCKS" {
  description = "Sync fetch interval in blocks"
  type        = string
}

variable "SYNC_TIME_BETWEEN_REQUESTS_IN_MS" {
  description = "Sync time between requests in ms"
  type        = string
}

variable "SYNC_ATTEMPTS_MAX_RETRY" {
  description = "Sync attempts max retry"
  type        = string
}

variable "SYNC_ATTEMPTS_INTERVAL_IN_MS" {
  description = "Sync attempts interval in ms"
  type        = string
}

variable "SYNC_NETWORK" {
  description = "Sync network"
  type        = string
}

# Resources

resource "aws_s3_bucket" "kadindexer" {
  bucket        = "kadena-indexer-data-002"
  force_destroy = true

  tags = {
    Name        = "KadIndexer S3 Bucket"
    Environment = "Development"
  }
}

resource "aws_s3_bucket_policy" "kadindexer" {
  bucket = aws_s3_bucket.kadindexer.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action    = ["s3:GetObject", "s3:PutObject", "s3:DeleteObject"],
        Effect    = "Allow",
        Resource  = "arn:aws:s3:::${aws_s3_bucket.kadindexer.bucket}/*",
        Principal = { "AWS" : "arn:aws:iam::${var.AWS_ACCOUNT_ID}:user/${var.AWS_USER_NAME}" }
      },
      {
        Action    = "s3:ListBucket",
        Effect    = "Allow",
        Resource  = aws_s3_bucket.kadindexer.arn,
        Principal = { "AWS" : "arn:aws:iam::${var.AWS_ACCOUNT_ID}:user/${var.AWS_USER_NAME}" }
      }
    ]
  })
}

resource "aws_vpc" "kadindexer" {
  enable_dns_support = true

  enable_dns_hostnames = true

  cidr_block = "10.0.0.0/16"

  tags = {
    Name = "kadindexer-vpc"
  }
}

resource "aws_subnet" "kadindexer" {
  cidr_block = "10.0.1.0/24"

  availability_zone = "us-east-1a"

  vpc_id = aws_vpc.kadindexer.id

  map_public_ip_on_launch = true

  tags = {
    Name = "kadindexer-subnet"
  }
}

resource "aws_subnet" "kadindexer-b" {
  cidr_block = "10.0.2.0/24"

  availability_zone = "us-east-1b"

  vpc_id = aws_vpc.kadindexer.id

  map_public_ip_on_launch = true

  tags = {
    Name = "kadindexer-subnet-b"
  }
}

resource "aws_db_subnet_group" "kadindexer" {
  name = "kadindexer_subnet_group"

  subnet_ids = [aws_subnet.kadindexer.id, aws_subnet.kadindexer-b.id]

  tags = {
    Name = "kadindexer-subnet-group"
  }
}

resource "aws_internet_gateway" "kadindexer" {
  vpc_id = aws_vpc.kadindexer.id

  tags = {
    Name = "kadindexer-gateway"
  }
}

resource "aws_route_table" "kadindexer" {
  vpc_id = aws_vpc.kadindexer.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.kadindexer.id
  }

  tags = {
    Name = "kadindexer-route-table"
  }
}

resource "aws_route_table_association" "kadindexer" {
  subnet_id      = aws_subnet.kadindexer.id
  route_table_id = aws_route_table.kadindexer.id
}

resource "aws_route_table_association" "kadindexer-b" {
  subnet_id      = aws_subnet.kadindexer-b.id
  route_table_id = aws_route_table.kadindexer.id
}

resource "aws_db_instance" "postgres_db" {
  identifier        = "kadena-indexer-db"
  instance_class    = var.AWS_DB_INSTANCE_CLASS
  allocated_storage = var.AWS_DB_ALLOCATED_STORAGE
  engine            = "postgres"
  engine_version    = "15.5"
  username          = var.AWS_DB_USERNAME
  password          = var.AWS_DB_PASSWORD
  db_name           = var.AWS_DB_NAME
  
  max_allocated_storage = 1000

  vpc_security_group_ids = [aws_security_group.postgres_sg.id]
  db_subnet_group_name   = aws_db_subnet_group.kadindexer.name

  skip_final_snapshot = true
  publicly_accessible = true

  tags = {
    Name        = "My PostgreSQL Database"
    Environment = "Development"
  }
}

output "postgres_db_host" {
  value = aws_db_instance.postgres_db.address
}

resource "aws_security_group" "postgres_sg" {
  name        = "postgres-traffic-only"
  description = "Allow only PostgreSQL traffic in both directions"
  vpc_id      = aws_vpc.kadindexer.id

  # Ingress: Allow incoming PostgreSQL traffic
  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # Replace with the actual CIDR blocks
  }

  # Egress: Allow outgoing PostgreSQL traffic
  egress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # Replace with the target PostgreSQL server's CIDR blocks
  }

  tags = {
    Name = "postgres-traffic-only"
  }
}

# Kadena Indexer

resource "aws_ecs_cluster" "kadindexer" {
  name = "kadindexer-cluster"
}

resource "aws_ecr_repository" "kadindexer" {
  name                 = "kadindexer-ecr"
  image_tag_mutability = "MUTABLE"
  force_delete         = true

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Environment = "Development"
  }
}

resource "aws_ecs_task_definition" "kadindexer" {
  family                   = "graphql-task"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = "512"
  memory                   = "2048"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  container_definitions = jsonencode([
    {
      name      = "kadena-indexer"
      image     = "${aws_ecr_repository.kadindexer.repository_url}:latest"
      cpu       = 512
      memory    = 2048
      essential = true
      portMappings = [
        {
          containerPort = 3000
          hostPort      = 3000
        }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = "/ecs/kadena-indexer"
          awslogs-region        = "us-east-1"
          awslogs-stream-prefix = "ecs"
        }
      }
      environment = [
        { name = "DB_HOST", value = var.DB_HOST },
        { name = "DB_USERNAME", value = var.DB_USERNAME },
        { name = "DB_PASSWORD", value = var.DB_PASSWORD },
        { name = "DB_NAME", value = var.DB_NAME },
        { name = "AWS_S3_REGION", value = var.AWS_S3_REGION },
        { name = "AWS_S3_BUCKET_NAME", value = var.AWS_S3_BUCKET_NAME },
        { name = "AWS_ACCESS_KEY_ID", value = var.AWS_ACCESS_KEY_ID },
        { name = "AWS_SECRET_ACCESS_KEY", value = var.AWS_SECRET_ACCESS_KEY },
        { name = "SYNC_BASE_URL", value = var.SYNC_BASE_URL },
        { name = "SYNC_MIN_HEIGHT", value = var.SYNC_MIN_HEIGHT },
        { name = "SYNC_FETCH_INTERVAL_IN_BLOCKS", value = var.SYNC_FETCH_INTERVAL_IN_BLOCKS },
        { name = "SYNC_TIME_BETWEEN_REQUESTS_IN_MS", value = var.SYNC_TIME_BETWEEN_REQUESTS_IN_MS },
        { name = "SYNC_ATTEMPTS_MAX_RETRY", value = var.SYNC_ATTEMPTS_MAX_RETRY },
        { name = "SYNC_ATTEMPTS_INTERVAL_IN_MS", value = var.SYNC_ATTEMPTS_INTERVAL_IN_MS },
        { name = "SYNC_NETWORK", value = var.SYNC_NETWORK },
        { name = "RUN_GRAPHQL_ON_START", value = "true" },
        { name = "RUN_STREAMING_ON_START", value = "false" },
        { name = "RUN_MISSING_BLOCKS_ON_START", value = "false" },
      ]
    }
  ])
  lifecycle {
    ignore_changes = [ container_definitions ]
  }
}

resource "aws_ecs_task_definition" "kadindexer_streaming" {
  family                   = "streaming-task"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = "512"
  memory                   = "2048"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  container_definitions = jsonencode([
    {
      name      = "kadena-indexer-streaming"
      image     = "${aws_ecr_repository.kadindexer.repository_url}:latest"
      cpu       = 512
      memory    = 2048
      essential = true
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = "/ecs/kadena-indexer-streaming"
          awslogs-region        = "us-east-1"
          awslogs-stream-prefix = "ecs"
        }
      }
      environment = [
        { name = "DB_HOST", value = var.DB_HOST },
        { name = "DB_USERNAME", value = var.DB_USERNAME },
        { name = "DB_PASSWORD", value = var.DB_PASSWORD },
        { name = "DB_NAME", value = var.DB_NAME },
        { name = "AWS_S3_REGION", value = var.AWS_S3_REGION },
        { name = "AWS_S3_BUCKET_NAME", value = var.AWS_S3_BUCKET_NAME },
        { name = "AWS_ACCESS_KEY_ID", value = var.AWS_ACCESS_KEY_ID },
        { name = "AWS_SECRET_ACCESS_KEY", value = var.AWS_SECRET_ACCESS_KEY },
        { name = "SYNC_BASE_URL", value = var.SYNC_BASE_URL },
        { name = "SYNC_MIN_HEIGHT", value = var.SYNC_MIN_HEIGHT },
        { name = "SYNC_FETCH_INTERVAL_IN_BLOCKS", value = var.SYNC_FETCH_INTERVAL_IN_BLOCKS },
        { name = "SYNC_TIME_BETWEEN_REQUESTS_IN_MS", value = var.SYNC_TIME_BETWEEN_REQUESTS_IN_MS },
        { name = "SYNC_ATTEMPTS_MAX_RETRY", value = var.SYNC_ATTEMPTS_MAX_RETRY },
        { name = "SYNC_ATTEMPTS_INTERVAL_IN_MS", value = var.SYNC_ATTEMPTS_INTERVAL_IN_MS },
        { name = "SYNC_NETWORK", value = var.SYNC_NETWORK },
        { name = "RUN_GRAPHQL_ON_START", value = "false" },
        { name = "RUN_STREAMING_ON_START", value = "true" },
        { name = "RUN_MISSING_BLOCKS_ON_START", value = "false" },
      ]
    }
  ])
  lifecycle {
    ignore_changes = [ container_definitions ]
  }
}

resource "aws_ecs_task_definition" "kadindexer_missing" {
  family                   = "missing-task"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = "2048"
  memory                   = "4096"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  container_definitions = jsonencode([
    {
      name      = "kadena-indexer-missing"
      image     = "${aws_ecr_repository.kadindexer.repository_url}:latest"
      cpu       = 2048
      memory    = 4096
      essential = true
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = "/ecs/kadena-indexer-missing"
          awslogs-region        = "us-east-1"
          awslogs-stream-prefix = "ecs"
        }
      }
      environment = [
        { name = "DB_HOST", value = var.DB_HOST },
        { name = "DB_USERNAME", value = var.DB_USERNAME },
        { name = "DB_PASSWORD", value = var.DB_PASSWORD },
        { name = "DB_NAME", value = var.DB_NAME },
        { name = "AWS_S3_REGION", value = var.AWS_S3_REGION },
        { name = "AWS_S3_BUCKET_NAME", value = var.AWS_S3_BUCKET_NAME },
        { name = "AWS_ACCESS_KEY_ID", value = var.AWS_ACCESS_KEY_ID },
        { name = "AWS_SECRET_ACCESS_KEY", value = var.AWS_SECRET_ACCESS_KEY },
        { name = "SYNC_BASE_URL", value = var.SYNC_BASE_URL },
        { name = "SYNC_MIN_HEIGHT", value = var.SYNC_MIN_HEIGHT },
        { name = "SYNC_FETCH_INTERVAL_IN_BLOCKS", value = var.SYNC_FETCH_INTERVAL_IN_BLOCKS },
        { name = "SYNC_TIME_BETWEEN_REQUESTS_IN_MS", value = var.SYNC_TIME_BETWEEN_REQUESTS_IN_MS },
        { name = "SYNC_ATTEMPTS_MAX_RETRY", value = var.SYNC_ATTEMPTS_MAX_RETRY },
        { name = "SYNC_ATTEMPTS_INTERVAL_IN_MS", value = var.SYNC_ATTEMPTS_INTERVAL_IN_MS },
        { name = "SYNC_NETWORK", value = var.SYNC_NETWORK },
        { name = "RUN_GRAPHQL_ON_START", value = "false" },
        { name = "RUN_STREAMING_ON_START", value = "false" },
        { name = "RUN_MISSING_BLOCKS_ON_START", value = "true" },
      ]
    }
  ])
}

resource "aws_iam_role" "ecs_task_execution_role" {
  name = "ecsTaskExecutionRole"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
        Effect = "Allow"
        Sid    = ""
      },
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution_role_policy" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_security_group" "kadindexer_sg" {
  name        = "kadindexer-traffic-only"
  description = "Allow only PostgreSQL traffic in both directions"
  vpc_id      = aws_vpc.kadindexer.id

  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # Replace with the actual CIDR blocks
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "kadindexer-traffic-only"
  }
}

resource "aws_ecs_service" "kadindexer" {
  name            = "kadindexer-graphql-service"
  cluster         = aws_ecs_cluster.kadindexer.id
  task_definition = aws_ecs_task_definition.kadindexer.arn
  desired_count   = 2
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = [aws_subnet.kadindexer.id, aws_subnet.kadindexer-b.id]
    security_groups  = [aws_security_group.kadindexer_sg.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.kadindexer_tg.arn
    container_name   = "kadena-indexer"
    container_port   = 3000
  }

  depends_on = [
    aws_lb_listener.kadindexer_listener
  ]
}

resource "aws_ecs_service" "kadindexer_streaming" {
  name            = "kadindexer-streaming-service"
  cluster         = aws_ecs_cluster.kadindexer.id
  task_definition = aws_ecs_task_definition.kadindexer_streaming.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = [aws_subnet.kadindexer.id, aws_subnet.kadindexer-b.id]
    security_groups  = [aws_security_group.kadindexer_sg.id]
    assign_public_ip = true
  }
}

resource "aws_ecs_service" "kadindexer_missing" {
  name            = "kadindexer-missing-service"
  cluster         = aws_ecs_cluster.kadindexer.id
  task_definition = aws_ecs_task_definition.kadindexer_missing.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = [aws_subnet.kadindexer.id, aws_subnet.kadindexer-b.id]
    security_groups  = [aws_security_group.kadindexer_sg.id]
    assign_public_ip = true
  }
}

resource "aws_cloudwatch_log_group" "kadena_indexer_log_group" {
  name              = "/ecs/kadena-indexer"
  retention_in_days = 30

  tags = {
    Name        = "KadenaIndexerLogGroup"
    Environment = "Development"
  }
}

resource "aws_cloudwatch_log_group" "kadena_indexer_streaming_log_group" {
  name              = "/ecs/kadena-indexer-streaming"
  retention_in_days = 30

  tags = {
    Name        = "KadenaIndexerStreamingLogGroup"
    Environment = "Development"
  }
}

resource "aws_cloudwatch_log_group" "kadena_indexer_missing_log_group" {
  name              = "/ecs/kadena-indexer-missing"
  retention_in_days = 30

  tags = {
    Name        = "KadenaIndexerMissingLogGroup"
    Environment = "Development"
  }
}

resource "aws_eip" "nlb_eip" {
  domain = "vpc"
}

resource "aws_lb" "kadindexer_nlb" {
  name               = "kadindexer-nlb"
  load_balancer_type = "network"

  enable_deletion_protection = false

  subnet_mapping {
    subnet_id     = aws_subnet.kadindexer.id
    allocation_id = aws_eip.nlb_eip.id
  }

  tags = {
    Name = "kadindexerNLB"
  }
}


resource "aws_lb_target_group" "kadindexer_tg" {
  name        = "kadindexer-tg"
  port        = 3000
  protocol    = "TCP"
  vpc_id      = aws_vpc.kadindexer.id
  target_type = "ip"

  health_check {
    protocol            = "TCP"
    port                = "traffic-port"
    interval            = 30
    timeout             = 10
    healthy_threshold   = 3
    unhealthy_threshold = 3
  }

  tags = {
    Name = "kadindexerTG"
  }
}


resource "aws_lb_listener" "kadindexer_listener" {
  load_balancer_arn = aws_lb.kadindexer_nlb.arn
  protocol          = "TCP"
  port              = 3000

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.kadindexer_tg.arn
  }
}
