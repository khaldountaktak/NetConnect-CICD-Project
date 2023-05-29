terraform {
  backend "http" {
  }
}

provider "aws"{
    region = "us-east-1"
}

variable "env_prefix" {}
variable "vpc_cidr_blocks" {}
variable "subnet_cidr_blocks" {}
variable "avail_zone" {}


resource "aws_vpc" "ppp_vpc" {
    cidr_block = var.vpc_cidr_blocks
    tags = {
        Name: "${var.env_prefix}-vpc"
    }
}

resource "aws_subnet" "ppp_subnet" {
  vpc_id = aws_vpc.ppp_vpc.id
  cidr_block = var.subnet_cidr_blocks
  availability_zone = var.avail_zone
  tags = {
    Name = "${var.env_prefix}-subnet"
  }
}