import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as s3 from 'aws-cdk-lib/aws-s3';

export class ContentsphereCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'ContentSphereVpc', {
      ipAddresses: ec2.IpAddresses.cidr('10.30.0.0/16'),
      maxAzs: 2,
      natGateways: 0,
      subnetConfiguration: [
        {
          name: 'PublicSubnet',
          subnetType: ec2.SubnetType.PUBLIC,
          cidrMask: 24,
        },
      ],
    });

    const securityGroup = new ec2.SecurityGroup(
      this,
      'ContentSphereSecurityGroup',
      {
        vpc,
        description: 'Security group for ContentSphere',
        allowAllOutbound: true,
      },
    );

    securityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(22),
      'Allow SSH',
    );

    securityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(80),
      'Allow HTTP',
    );

    const bucket = new s3.Bucket(this, 'ContentSphereBucket', {
      versioned: true,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      autoDeleteObjects: false,
    });

    const instance = new ec2.Instance(this, 'ContentSphereInstance', {
      vpc,
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T3,
        ec2.InstanceSize.MICRO,
      ),
      machineImage: ec2.MachineImage.genericLinux({
        'ap-south-1': 'ami-007b1f3fdea0383d9',
      }),
      securityGroup,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC,
      },
    });

    instance.addUserData(
      '#!/bin/bash',
      'apt-get update -y',
      'apt-get install -y apache2',
      'systemctl enable apache2',
      'systemctl start apache2',
      'cat > /var/www/html/index.html <<HTML',
      '<html>',
      '<head><title>ContentSphere - AWS CDK</title></head>',
      '<body>',
      '<h1>ContentSphere</h1>',
      '<p>Student Name: Saad Momin</p>',
      '<p>Batch Code: DR501</p>',
      '<p>AWS Region: ap-south-1</p>',
      '<p>Environment: dev</p>',
      '<h2>Infrastructure Provisioned using AWS CDK</h2>',
      '</body>',
      '</html>',
      'HTML',
    );

    new cdk.CfnOutput(this, 'VpcId', {
      value: vpc.vpcId,
    });

    new cdk.CfnOutput(this, 'InstanceId', {
      value: instance.instanceId,
    });

    new cdk.CfnOutput(this, 'BucketName', {
      value: bucket.bucketName,
    });
  }
}
