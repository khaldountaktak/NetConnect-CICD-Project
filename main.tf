terraform {
  backend "http" {
  }
  #required_providers {
    # ansible = {
    #  version = "~> 1.1.0"
     # source  = "ansible/ansible"
   # }
  #}
}

provider "aws"{
    region = "us-east-1"
}

variable "env_prefix" {}
variable "vpc_cidr_blocks" {}
variable "subnet_cidr_blocks" {}
variable "avail_zone" {}
variable "myip" {}
variable "public_key_location" {}
variable "private_key_location" {}
variable "ami" {}
variable "ec2_type" {}
variable "CI_REGISTRY_USER" {}
variable "CI_REGISTRY_PASSWORD" {}
variable "CI_REGISTRY" {}
variable "CI_REGISTRY_IMAGE" {}

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

resource "aws_internet_gateway" "ppp_igw" {
  vpc_id = aws_vpc.ppp_vpc.id
  tags = {
    Name = "${var.env_prefix}-igw"
  }
}

resource "aws_route_table" "ppp_rt" {
  vpc_id = aws_vpc.ppp_vpc.id
  route {
    cidr_block="0.0.0.0/0"
    gateway_id=aws_internet_gateway.ppp_igw.id
  }
  tags = {
    Name = "${var.env_prefix}-route-table"
  }
}

resource "aws_route_table_association" "ppp_rta" {
  subnet_id = aws_subnet.ppp_subnet.id
  route_table_id = aws_route_table.ppp_rt.id
}

resource "aws_security_group" "ppp_sg" {
  name = "ppp_sg"
  vpc_id = aws_vpc.ppp_vpc.id

  ingress {
    from_port = 22
    to_port = 22
    protocol = "tcp"
    cidr_blocks = [var.myip]
  }
  ingress {
    from_port = 3000
    to_port = 3000
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port = 0
    to_port = 0
    protocol = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    prefix_list_ids=[]
  }

  tags = {
    Name = "${var.env_prefix}-security-group"
  }
}

resource "aws_key_pair" "ppp_kp" {
  key_name = "key"
  public_key = file(var.public_key_location)
}

resource "aws_instance" "ppp_ec2" {
    ami = var.ami
    instance_type = var.ec2_type

    subnet_id = aws_subnet.ppp_subnet.id
    vpc_security_group_ids = [ aws_security_group.ppp_sg.id ]
    availability_zone = var.avail_zone
    
    associate_public_ip_address = true
    key_name = aws_key_pair.ppp_kp.key_name
    
    # user_data = file("")

    connection {
        type     = "ssh"
        user     = "ec2-user"
        private_key = file(var.private_key_location)
        host     = self.public_ip
    }

    provisioner "remote-exec" {
        inline = [
            "sudo yum update -y",
            "sudo yum install -y docker",
            "sudo systemctl start docker"
        ]
    }


    tags = {
    name = "${var.env_prefix}-ec2"
  }
}

#resource "ansible_host" "host" {
#    name = "ec2"
#}

#resource "ansible_playbook" "playbook" {
#  playbook   = "playbook.yml"
#  name       = ansible_host.host.name
#  replayable = true
#
#}