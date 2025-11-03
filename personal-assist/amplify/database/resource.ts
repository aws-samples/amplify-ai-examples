import { defineFunction } from "@aws-amplify/backend";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as rds from "aws-cdk-lib/aws-rds";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";
import { RemovalPolicy, Duration } from "aws-cdk-lib";
import { Construct } from "constructs";

export interface VectorDatabaseProps {
  readonly construct: Construct;
}

export function createVectorDatabase(props: VectorDatabaseProps) {
  const { construct } = props;

  // Create VPC for Aurora Serverless v2
  const vpc = new ec2.Vpc(construct, "VectorDBVpc", {
    maxAzs: 2,
    natGateways: 1,
    subnetConfiguration: [
      {
        cidrMask: 24,
        name: "public",
        subnetType: ec2.SubnetType.PUBLIC,
      },
      {
        cidrMask: 24,
        name: "private",
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
      },
      {
        cidrMask: 28,
        name: "isolated",
        subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
      },
    ],
  });

  // Security group for Aurora
  const dbSecurityGroup = new ec2.SecurityGroup(construct, "DBSecurityGroup", {
    vpc,
    description: "Security group for Aurora Serverless v2 with pgvector",
    allowAllOutbound: true,
  });

  // Allow Lambda functions to access the database
  dbSecurityGroup.addIngressRule(
    ec2.Peer.ipv4(vpc.vpcCidrBlock),
    ec2.Port.tcp(5432),
    "Allow PostgreSQL access from VPC"
  );

  // Create database credentials secret
  const dbSecret = new secretsmanager.Secret(construct, "DBCredentials", {
    secretName: "personal-assist/aurora/credentials",
    generateSecretString: {
      secretStringTemplate: JSON.stringify({ username: "postgres" }),
      generateStringKey: "password",
      excludePunctuation: true,
      passwordLength: 32,
    },
    removalPolicy: RemovalPolicy.DESTROY,
  });

  // Create Aurora Serverless v2 cluster
  const cluster = new rds.DatabaseCluster(construct, "VectorDatabase", {
    engine: rds.DatabaseClusterEngine.auroraPostgres({
      version: rds.AuroraPostgresEngineVersion.VER_15_5,
    }),
    credentials: rds.Credentials.fromSecret(dbSecret),
    writer: rds.ClusterInstance.serverlessV2("writer", {
      autoMinorVersionUpgrade: true,
      publiclyAccessible: false,
    }),
    readers: [
      rds.ClusterInstance.serverlessV2("reader", {
        scaleWithWriter: true,
        autoMinorVersionUpgrade: true,
        publiclyAccessible: false,
      }),
    ],
    serverlessV2MinCapacity: 0.5,
    serverlessV2MaxCapacity: 2,
    vpc,
    vpcSubnets: {
      subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
    },
    securityGroups: [dbSecurityGroup],
    defaultDatabaseName: "vectordb",
    removalPolicy: RemovalPolicy.DESTROY,
    backup: {
      retention: Duration.days(7),
      preferredWindow: "03:00-04:00",
    },
  });

  // Enable Data API for easier Lambda access (optional, but recommended)
  const cfnCluster = cluster.node.defaultChild as rds.CfnDBCluster;
  cfnCluster.enableHttpEndpoint = true;

  // Custom resource to initialize pgvector extension
  // This would typically be done via a Lambda that runs SQL commands
  // For now, we'll document that it needs to be run manually or via migration

  return {
    cluster,
    secret: dbSecret,
    vpc,
    securityGroup: dbSecurityGroup,
    clusterIdentifier: cluster.clusterIdentifier,
    clusterEndpoint: cluster.clusterEndpoint.hostname,
    clusterPort: cluster.clusterEndpoint.port,
  };
}
