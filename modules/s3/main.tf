variable "project_name" {
  type = string
}

variable "environment" {
  type = string
}

data "aws_caller_identity" "current" {}

resource "aws_s3_bucket" "this" {
  bucket = "${var.project_name}-${data.aws_caller_identity.current.account_id}"

  tags = {
    Name        = "${var.project_name}-bucket"
    Project     = var.project_name
    Environment = var.environment
  }
}
