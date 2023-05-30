env_prefix= "prod"
vpc_cidr_blocks= "10.0.0.0/16"
subnet_cidr_blocks= "10.0.10.0/24"
avail_zone= "us-east-1a"
myip = "0.0.0.0/0"
public_key_location="~/gitlab"
private_key_location="~/gitlab.pem"

ubuntu_ami="ami-053b0d53c279acc90"
ec2_type="t2.micro"

CI_REGISTRY_USER=$CI_REGISTRY_USER
CI_REGISTRY_PASSWORD=$CI_REGISTRY_PASSWORD
CI_REGISTRY=$CI_REGISTRY
CI_REGISTRY_IMAGE=$CI_REGISTRY_IMAGE