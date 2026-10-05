variable "project_name" {
  type = string
}

variable "environment" {
  type = string
}

variable "subnet_id" {
  type = string
}

variable "security_group_id" {
  type = string
}

variable "instance_type" {
  type = string
}

data "aws_ami" "ubuntu" {
  most_recent = true

  owners = ["099720109477"]

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd-gp3/ubuntu-noble-24.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

resource "aws_instance" "this" {
  ami                         = data.aws_ami.ubuntu.id
  instance_type               = var.instance_type
  subnet_id                   = var.subnet_id
  vpc_security_group_ids      = [var.security_group_id]
  associate_public_ip_address = true

  user_data = <<-EOF
              #!/bin/bash
              apt-get update -y
              apt-get install -y apache2
              systemctl enable apache2
              systemctl start apache2

              cat > /var/www/html/index.html <<HTML
              <html>
              <head><title>ContentSphere</title></head>
              <body>
              <h1>ContentSphere</h1>
              <p>Student Name: Saad Momin</p>
              <p>Batch Code: DR501</p>
              <p>AWS Region: ap-south-1</p>
              <p>Environment: dev</p>
              <h2>Infrastructure Provisioned using Terraform</h2>
              </body>
              </html>
              HTML
              EOF

  tags = {
    Name        = "${var.project_name}-server"
    Project     = var.project_name
    Environment = var.environment
  }
}

resource "aws_eip" "this" {
  domain   = "vpc"
  instance = aws_instance.this.id

  tags = {
    Name = "${var.project_name}-eip"
  }
}
