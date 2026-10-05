module "vpc" {
  source = "./modules/vpc"

  project_name = var.project_name
  environment  = var.environment
}

module "security_group" {
  source = "./modules/security-group"

  project_name = var.project_name
  vpc_id       = module.vpc.vpc_id
}

module "ec2" {
  source = "./modules/ec2"

  project_name      = var.project_name
  environment       = var.environment
  subnet_id         = module.vpc.subnet_id
  security_group_id = module.security_group.security_group_id
  instance_type     = var.instance_type
}

module "s3" {
  source = "./modules/s3"

  project_name = var.project_name
  environment  = var.environment
}
