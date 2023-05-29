provider "aws"{
    region = "us-east-1"
}

variable "vpc_cidr_blocks" {}
variable "env_prefix" {}

resource "aws_vpc" "vpc" {
    cidr_block = var.vpc_cidr_blocks
    tags = {
        name: "${var.env_prefix}-vpc"
    }
}