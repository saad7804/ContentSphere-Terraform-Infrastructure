# ContentSphere – Infrastructure as Code Deployment and Automation using Terraform

## 1. Project Overview

ContentSphere is an Infrastructure as Code (IaC) project that demonstrates how cloud infrastructure can be provisioned, managed, and reproduced using Terraform.

The project provisions AWS resources including:

- Amazon VPC
- Public Subnet
- Internet Gateway
- Route Table
- Security Group
- EC2 Instance
- Elastic IP
- Amazon S3 Bucket
- Remote Terraform State stored in Amazon S3

The project also demonstrates infrastructure provisioning using AWS CloudFormation and AWS CDK for comparison with Terraform.

---

## 2. Project Objectives

The main objectives of this project are:

1. Understand Infrastructure as Code.
2. Provision AWS infrastructure using Terraform.
3. Use Terraform modules for reusable infrastructure.
4. Configure networking components such as VPC, subnet, route table, and Internet Gateway.
5. Deploy an EC2 web server using Terraform.
6. Create and manage an Amazon S3 bucket.
7. Configure remote Terraform state using Amazon S3.
8. Demonstrate Terraform drift detection.
9. Understand CloudFormation and AWS CDK as alternative IaC tools.
10. Store the project source code in Git and GitHub.

---

## 3. AWS Infrastructure

The Terraform configuration creates the following architecture:

```text
                         Internet
                            |
                    Internet Gateway
                            |
                    Public Route Table
                            |
                     Public Subnet
                            |
              +-------------+-------------+
              |                           |
        Security Group                EC2 Instance
              |                           |
       SSH Port 22                  Apache Web Server
       HTTP Port 80                       |
                                          |
                                   Elastic IP
                                          |
                                      Website
4. Terraform Modules

The Terraform project uses reusable modules.

VPC Module

Location:

modules/vpc/

The VPC module creates:

VPC
Public Subnet
Internet Gateway
Public Route Table
Route Table Association

VPC CIDR:

10.0.0.0/16

Public subnet CIDR:

10.0.1.0/24
Security Group Module

Location:

modules/security-group/

The security group allows:

SSH - TCP 22
HTTP - TCP 80
Outbound traffic
EC2 Module

Location:

modules/ec2/

The EC2 module:

Finds a compatible Ubuntu AMI.
Creates a t3.micro EC2 instance.
Installs Apache.
Creates the ContentSphere web page.
Creates an Elastic IP.

The web server displays:

ContentSphere
Student Name: Saad Momin
Batch Code: DR501
AWS Region: ap-south-1
Environment: dev
Infrastructure Provisioned using Terraform
S3 Module

Location:

modules/s3/

The S3 module creates the project bucket:

contentsphere-888869353635
5. Terraform Remote State

Terraform state is stored remotely in Amazon S3.

Backend bucket:

contentsphere-terraform-state-888869353635

State key:

contentsphere/terraform.tfstate

Region:

ap-south-1

Remote state provides centralized state management and allows Terraform to maintain the infrastructure state outside the local machine.

S3 bucket versioning is enabled for the Terraform state bucket.

6. Terraform Files

The main Terraform files are:

provider.tf
main.tf
variables.tf
outputs.tf
terraform.tfvars.example

The root module calls the reusable modules:

modules/vpc
modules/security-group
modules/ec2
modules/s3
7. Terraform Initialization

Terraform was initialized using:

terraform init

This downloaded the required AWS provider and configured the remote S3 backend.

8. Terraform Validation

The configuration was validated using:

terraform validate

Terraform validation confirmed that the configuration syntax and module references were valid.

9. Terraform Formatting

Terraform configuration was formatted using:

terraform fmt -recursive

This ensures consistent formatting across the project.

10. Terraform Plan

The infrastructure changes were reviewed using:

terraform plan

Terraform generated an execution plan showing which AWS resources would be created or modified.

11. Terraform Apply

The infrastructure was provisioned using:

terraform apply

Terraform successfully created the required ContentSphere infrastructure.

12. EC2 Web Server

The EC2 instance runs Ubuntu with Apache HTTP Server.

Apache was installed automatically using Terraform EC2 user data.

The user data performs:

apt-get update
apt-get install apache2
systemctl enable apache2
systemctl start apache2

The website was successfully verified using HTTP requests.

Example:

curl -I http://<ELASTIC-IP>

Expected response:

HTTP/1.1 200 OK
Server: Apache
13. Terraform Outputs

The Terraform configuration exposes important infrastructure information through outputs.

Examples include:

vpc_id
subnet_id
security_group_id
ec2_instance_id
ec2_public_ip
elastic_ip
s3_bucket_name

These values can be displayed using:

terraform output
14. Infrastructure Drift Detection

Terraform drift detection was demonstrated by manually modifying the Name tag of the S3 bucket outside Terraform.

The bucket tag was changed to:

DRIFT-TEST

Terraform detected the difference during:

terraform plan

The plan showed that Terraform would change the tag back to:

contentsphere-bucket

The configuration was then corrected using:

terraform apply

This demonstrated how Terraform can detect and correct infrastructure drift.

15. CloudFormation

A CloudFormation template was created at:

cloudformation/contentsphere-stack.yaml

The template was validated using:

aws cloudformation validate-template \
  --template-body file://cloudformation/contentsphere-stack.yaml \
  --region ap-south-1

The template validation was successful.

A CloudFormation deployment was also attempted.

The deployment could not complete because the AWS account had reached its service limits for VPCs and Internet Gateways.

The failure was therefore caused by AWS account resource limits rather than a CloudFormation template syntax problem.

The CloudFormation stack was subsequently removed.

16. AWS CDK

An AWS CDK implementation was also created in:

cdk/

The CDK project contains infrastructure definitions for:

VPC
Public Subnet
Security Group
EC2 Instance
S3 Bucket

The CDK TypeScript project was compiled using:

npm run build

The CDK application was synthesized using:

cdk synth

Both build and synthesis were completed successfully.

CDK deployment was not performed because the AWS account had reached VPC and Internet Gateway service limits.

17. Terraform vs CloudFormation vs AWS CDK
Feature	Terraform	CloudFormation	AWS CDK
IaC Type	Declarative	Declarative	Code-based
Main Language	HCL	YAML/JSON	TypeScript
AWS Support	Excellent	Native	Native
Multi-cloud	Yes	No	Primarily AWS
State Management	Terraform State	AWS managed	CloudFormation
Reusable Modules	Terraform Modules	Nested Stacks	Constructs
Project Used	Yes	Yes	Yes

Terraform was selected as the primary IaC tool because it provides reusable modules, declarative configuration, remote state management, and strong infrastructure lifecycle management.

18. Infrastructure Lifecycle

The project follows this Terraform workflow:

Write Configuration
        |
        v
terraform init
        |
        v
terraform fmt
        |
        v
terraform validate
        |
        v
terraform plan
        |
        v
terraform apply
        |
        v
AWS Infrastructure
        |
        v
terraform plan
        |
        v
Detect Drift / Changes
19. Project Structure
ContentSphere-Terraform-Infrastructure/
|
├── README.md
├── provider.tf
├── main.tf
├── variables.tf
├── outputs.tf
├── terraform.tfvars.example
├── .gitignore
|
├── modules/
│   ├── vpc/
│   │   ├── main.tf
│   │   └── outputs.tf
│   │
│   ├── security-group/
│   │   ├── main.tf
│   │   └── outputs.tf
│   │
│   ├── ec2/
│   │   ├── main.tf
│   │   └── outputs.tf
│   │
│   └── s3/
│       ├── main.tf
│       └── outputs.tf
│
├── cloudformation/
│   └── contentsphere-stack.yaml
│
├── cdk/
│   ├── bin/
│   ├── lib/
│   ├── package.json
│   └── tsconfig.json
│
└── documentation/
20. Security Considerations

The project uses a security group to control network access.

Configured inbound ports:

22 - SSH
80 - HTTP

Terraform state files and sensitive Terraform variable files are excluded from Git using .gitignore.

The following files are not committed:

terraform.tfstate
terraform.tfstate.*
terraform.tfvars
.terraform/
21. Useful Terraform Commands

Initialize:

terraform init

Format:

terraform fmt -recursive

Validate:

terraform validate

Create a plan:

terraform plan

Apply infrastructure:

terraform apply

Show outputs:

terraform output

Show state:

terraform state list

Destroy infrastructure:

terraform destroy
22. Challenges Faced
Internet Gateway Service Limit

During infrastructure deployment, the AWS account had reached the maximum number of Internet Gateways.

An unused Internet Gateway was identified and removed so that Terraform could successfully provision the ContentSphere networking infrastructure.

CloudFormation Service Limits

The CloudFormation deployment could not complete because the AWS account had reached its VPC and Internet Gateway limits.

The CloudFormation template itself passed validation.

CDK Machine Image Compatibility

The installed AWS CDK version did not expose the expected convenience method for the Ubuntu machine image.

The CDK implementation was adapted to use a region-specific generic Linux AMI instead.

23. Learning Outcomes

Through this project, the following concepts were practiced:

Infrastructure as Code
Terraform
Terraform modules
Terraform state
Remote state
S3 backend
AWS VPC
Public subnet
Internet Gateway
Route tables
Security Groups
EC2
Elastic IP
S3
Terraform outputs
Terraform drift detection
CloudFormation
AWS CDK
Git
GitHub
Infrastructure lifecycle management
24. Conclusion

The ContentSphere project demonstrates how AWS infrastructure can be created and managed using Infrastructure as Code.

Terraform was used as the primary provisioning tool to create networking, security, compute, and storage resources.

The project also demonstrates remote state management, infrastructure drift detection, and reusable Terraform modules.

CloudFormation and AWS CDK were additionally explored to understand alternative AWS infrastructure automation approaches.

The completed project provides practical experience with AWS infrastructure provisioning and DevOps-oriented Infrastructure as Code practices.

