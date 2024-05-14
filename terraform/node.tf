# variable "pvt_key" {
#   description = "Path for SSH"
#   type        = string
#   default     = "~/.ssh/id_rsa"
# }

# variable "pub_key" {
#   description = "Path for Pub SSH"
#   type        = string
#   default     = "~/.ssh/id_rsa.pub"
# }

# variable "db_sync_server" {
#   description = "Kadena chainweb-node host"
#   type        = string
#   default     = "us-e1.chainweb.com"
# }

# variable "kadena_network" {
#   description = "Kadena network"
#   type        = string
#   default     = "mainnet01"
# }

# variable "db_username" {
#   description = "DB username"
#   type        = string
#   default     = "doadmin"
# }

# variable "db_password" {
#   description = "DB password"
#   type        = string
# }

# # Security group configuration

# # The "aws_security_group" block defines a security group that allows incoming traffic on specific ports and enables SSH connections.
# # The security group also allows all outbound traffic.
# resource "aws_security_group" "indexer" {
#   name = "indexer-security-group"

#   description = "Allow indexer incgress trafic"

#   vpc_id = aws_vpc.indexer.id

#   tags = {
#     Name = "indexer-security-group"
#   }

#   ingress {
#     from_port   = 5432
#     to_port     = 5432
#     protocol    = "tcp"
#     cidr_blocks = ["0.0.0.0/0"]
#   }

#   ingress {
#     from_port   = 443
#     to_port     = 443
#     protocol    = "tcp"
#     cidr_blocks = ["0.0.0.0/0"]
#   }

#   ingress {
#     from_port   = 80
#     to_port     = 80
#     protocol    = "tcp"
#     cidr_blocks = ["0.0.0.0/0"]
#   }

#   ingress {
#     from_port   = 22
#     to_port     = 22
#     protocol    = "tcp"
#     cidr_blocks = ["0.0.0.0/0"]
#   }

#   ingress {
#     from_port   = 0
#     to_port     = 0
#     protocol    = "tcp"
#     cidr_blocks = ["0.0.0.0/0"]
#   }
# }

# resource "aws_vpc" "indexer" {
#   enable_dns_support = true

#   enable_dns_hostnames = true

#   cidr_block = "10.0.0.0/16"

#   tags = {
#     Name = "indexer-vpc"
#   }
# }

# resource "aws_subnet" "indexer" {
#   cidr_block = "10.0.1.0/24"

#   availability_zone = "us-east-1a"

#   vpc_id = aws_vpc.indexer.id

#   map_public_ip_on_launch = true

#   tags = {
#     Name = "indexer-subnet"
#   }
# }

# resource "aws_subnet" "indexer-b" {
#   cidr_block = "10.0.2.0/24"

#   availability_zone = "us-east-1b"

#   vpc_id = aws_vpc.indexer.id

#   map_public_ip_on_launch = true

#   tags = {
#     Name = "indexer-subnet-b"
#   }
# }

# resource "aws_db_subnet_group" "indexer" {
#   name = "indexer_subnet_group"

#   subnet_ids = [aws_subnet.indexer.id, aws_subnet.indexer-b.id]

#   tags = {
#     Name = "indexer-subnet-group"
#   }
# }

# resource "aws_internet_gateway" "indexer" {
#   vpc_id = aws_vpc.indexer.id

#   tags = {
#     Name = "indexer-gateway"
#   }
# }

# resource "aws_route_table" "indexer" {
#   vpc_id = aws_vpc.indexer.id

#   route {
#     cidr_block = "0.0.0.0/0"
#     gateway_id = aws_internet_gateway.indexer.id
#   }

#   tags = {
#     Name = "indexer-route-table"
#   }
# }

# resource "aws_route_table_association" "indexer" {
#   subnet_id      = aws_subnet.indexer.id
#   route_table_id = aws_route_table.indexer.id
# }

# resource "aws_route_table_association" "indexer-b" {
#   subnet_id      = aws_subnet.indexer-b.id
#   route_table_id = aws_route_table.indexer.id
# }

# # The "aws_db_instance" resource block describes an Amazon RDS database instance named "chainweb-database" that runs PostgreSQL version 14.6. It is a t3.medium instance class, with a username and password set via variables. It has a 25GB gp2 storage volume and is not configured for multi-AZ deployment. It's associated with a security group and a subnet group.
# resource "aws_db_instance" "chainweb_database" {
#   identifier          = "chainweb-database"
#   engine              = "postgres"
#   db_name             = "indexer"
#   engine_version      = "14.6"
#   instance_class      = "db.t3.medium"
#   username            = var.db_username
#   password            = var.db_password
#   publicly_accessible = true
#   skip_final_snapshot = true
#   allocated_storage   = 25
#   storage_type        = "gp2"
#   multi_az            = false

#   vpc_security_group_ids = ["${aws_security_group.indexer.id}"]

#   db_subnet_group_name = aws_db_subnet_group.indexer.name

#   tags = {
#     Name = "indexer-db-instance-chainweb-database"
#   }
# }

# # The "null_resource" block is used to run an arbitrary local command that does not create any infrastructure resources. In this case, it is used to initialize a database by executing an SQL file located at the specified path.
# resource "null_resource" "init_db" {
#   triggers = {
#     schema_file = filebase64sha256(
#       "assets/chainweb-data/src/init.sql"
#     )
#   }

#   provisioner "local-exec" {
#     command = <<EOF
#       export PGPASSWORD=${aws_db_instance.chainweb_database.password}

#       psql -h ${aws_db_instance.chainweb_database.address} -U ${aws_db_instance.chainweb_database.username} -d ${aws_db_instance.chainweb_database.db_name} -p 5432 -f assets/chainweb-data/src/init.sql
#     EOF
#   }
# }

# # This resource block is creating an Elastic IP (EIP) in AWS and associating it with the EC2 chainweb-node instance. An EIP is an AWS public static IPv4 address that you can allocate to your AWS account. You can attach an EIP to any instance or network interface for Internet connectivity.
# resource "aws_eip" "chainweb_node_ip" {
#   instance = aws_instance.chainweb_node.id
# }

# # Create default ssh publique key
# resource "aws_key_pair" "opact-ssh" {
#   key_name   = "opact-ssh"
#   public_key = file(var.pub_key)
# }

# # This resource block creates an EC2 instance on AWS with a specified AMI (Amazon Machine Image) and an instance type of t2.micro. This instance is configured to associate a public IP address and launch within a specific subnet within the VPC. The instance is tagged with the name chainweb-data and the security configuration is defined through a specific security group. Additionally, the instance is provisioned with Docker and other settings related to chainweb-data.
# resource "aws_instance" "chainweb_data" {
#   instance_type = "t2.micro"

#   ami = "ami-053b0d53c279acc90"

#   associate_public_ip_address = true

#   subnet_id = aws_subnet.indexer.id

#   key_name = aws_key_pair.opact-ssh.key_name

#   tags = {
#     Name = "chainweb-data"
#   }

#   depends_on = [
#     null_resource.init_db,
#     aws_instance.chainweb_node,
#   ]

#   vpc_security_group_ids = ["${aws_security_group.indexer.id}"]

#   connection {
#     type        = "ssh"
#     user        = "ubuntu"
#     private_key = file(var.pvt_key)
#     host        = self.public_ip
#   }

#   provisioner "file" {
#     source      = "assets/chainweb-data"
#     destination = "."
#   }

#   provisioner "remote-exec" {
#     inline = [
#       "sudo apt-get update",
#       "sudo apt-get remove docker docker-engine docker.io containerd runc",
#       "sudo apt-get install -y apt-transport-https ca-certificates curl gnupg lsb-release",
#       "curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg",
#       "echo \"deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable\" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null",
#       "sudo apt-get update",
#       "sudo apt-get install -y docker-ce docker-ce-cli containerd.io",
#       "sudo groupadd docker",
#       "sudo usermod -aG docker ubuntu",
#       "sudo systemctl enable docker.service",
#       "sudo systemctl enable containerd.service",
#       "sudo apt-get install -y jq",
#       "cd ./chainweb-data",
#       "echo \"CWD_DB_HOST=${aws_db_instance.chainweb_database.address}\" | sudo tee .env",
#       "echo \"CWD_DB_USER=${aws_db_instance.chainweb_database.username}\" | sudo tee -a .env",
#       "echo \"CWD_DB_PASS=${aws_db_instance.chainweb_database.password}\" | sudo tee -a .env",
#       "echo \"CWD_DB_PORT=5432\" | sudo tee -a .env",
#       "echo \"CWD_DB_NAME=indexer\" | sudo tee -a .env",
#       "echo \"CWD_NODE=146.190.198.163\" | sudo tee -a .env",
#       "sudo setfacl --modify user:ubuntu:rw /var/run/docker.sock",
#       "sudo docker compose up chainweb-data -d",
#     ]
#   }
# }

# # In summary, this resource defines the creation of an AWS EC2 instance named "chainweb-node"
# # with specific configuration and provisions it with necessary software and configurations to run a Kadena's Chainweb Node.
# resource "aws_instance" "chainweb_node" {
#   ami = "ami-053b0d53c279acc90"

#   instance_type = "t2.large"

#   associate_public_ip_address = true

#   subnet_id = aws_subnet.indexer.id

#   key_name = aws_key_pair.opact-ssh.key_name

#   tags = {
#     Name = "chainweb-node"
#   }

#   vpc_security_group_ids = ["${aws_security_group.indexer.id}"]

#   connection {
#     type        = "ssh"
#     user        = "ubuntu"
#     private_key = file(var.pvt_key)
#     host        = self.public_ip
#   }

#   provisioner "file" {
#     source      = "assets/chainweb-node"
#     destination = "."
#   }

#   root_block_device {
#     volume_type = "gp2"
#     volume_size = 256
#   }

#   provisioner "remote-exec" {
#     inline = [
#       "sudo mv chainweb-node/src/cwnode.service /etc/systemd/system/cwnode.service",
#       "sudo apt-get update",
#       "sudo apt-get remove docker docker-engine docker.io containerd runc",
#       "sudo apt-get install -y apt-transport-https ca-certificates curl gnupg lsb-release",
#       "curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg",
#       "echo \"deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable\" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null",
#       "sudo apt-get update",
#       "sudo apt-get install -y docker-ce docker-ce-cli containerd.io",
#       "sudo groupadd docker",
#       "sudo usermod -aG docker ubuntu",
#       "sudo systemctl enable docker.service",
#       "sudo systemctl enable containerd.service",
#       "sudo apt-get install -y jq",
#       "echo \"DB_SYNC_SERVER=${var.db_sync_server}\" | sudo tee ./chainweb-node/.env",
#       "echo \"KADENA_NETWORK=${var.kadena_network}\" | sudo tee -a ./chainweb-node/.env",
#       "cd chainweb-node",
#       "sudo systemctl daemon-reload",
#       "sudo systemctl enable cwnode.service",
#       "sudo systemctl start cwnode.service"
#     ]
#   }
# }d
