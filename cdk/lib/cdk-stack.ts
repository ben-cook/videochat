import * as cdk from "@aws-cdk/core";
import * as ecr from "@aws-cdk/aws-ecr";
import * as ec2 from "@aws-cdk/aws-ec2";
import * as ecs from "@aws-cdk/aws-ecs";
import * as iam from "@aws-cdk/aws-iam";

export class CdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // this container repository will hold our dockerised applications to be served
    // by other aws services
    const clientRepo = new ecr.Repository(this, "videochat-client", {
      repositoryName: "videochat-client",
    });
    console.log(`Made repo with arn ${clientRepo.repositoryArn}`);

    const serverRepo = new ecr.Repository(this, "videochat-server", {
      repositoryName: "videochat-server",
    });
    console.log(`Made repo with arn ${serverRepo.repositoryArn}`);

    // a Virtual Private Cloud allows for all the services we are defining to be linked together
    // maxAzs controls the maximum number of access zones to the cloud
    const vpc = new ec2.Vpc(this, "videochat-vpc", { maxAzs: 3 });
    console.log(`Made VPC ${vpc.vpcId}`);

    // An ecs cluster is a logical grouping of tasks or services in the cloud
    const cluster = new ecs.Cluster(this, "videochat-cluster", {
      clusterName: "videochat-cluster",
      vpc: vpc,
    });
    console.log(`Made Cluster with arn ${cluster.clusterArn}`);

    const executionRole = new iam.Role(this, "videochat-execution-role", {
      assumedBy: new iam.ServicePrincipal("ecs-tasks.amazonaws.com"),
      roleName: "videochat-execution-role",
    });
    console.log(`Made execution role with arn ${executionRole.roleArn}`);

    executionRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        resources: ["*"],
        actions: [
          "ecr:GetAuthorizationToken",
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetDownloadUrlForLayer",
          "ecr:CompleteLayerUpload",
          "ecr:BatchGetImage",
          "ecs:DescribeServices",
          "ecs:UpdateService",
          "iam:PassRole",
          "ecs:RegisterTaskDefinition",
          "ecr:InitiateLayerUpload",
          "ecr:UploadLayerPart",
          "ecr:PutImage",
          "logs:CreateLogStream",
          "logs:PutLogEvents",
        ],
      })
    );

    console.log(`Added policies to execution role`);

    const TaskDefinition = new ecs.FargateTaskDefinition(
      this,
      "videochat-task-definition",
      {
        executionRole: executionRole,
        family: "videochat-task-definition",
      }
    );

    console.log(`Created task definiton`);

    // Add All Containers
    TaskDefinition.addContainer("client", {
      image: ecs.ContainerImage.fromEcrRepository(clientRepo),
      portMappings: [{ containerPort: 5000 }],
    });
    TaskDefinition.addContainer("server", {
      image: ecs.ContainerImage.fromEcrRepository(serverRepo),
      portMappings: [{ containerPort: 8000 }],
    });
    TaskDefinition.addContainer("peerjs", {
      image: ecs.ContainerImage.fromRegistry("peerjs/peerjs-server"),
      portMappings: [{ containerPort: 9000 }],
    });

    console.log(`Added containers to task definition`);

    new ecs.FargateService(this, "videochat", {
      cluster: cluster,
      taskDefinition: TaskDefinition,
      serviceName: "videochat-task-definition",
    });

    console.log(`Created fargate service`);
  }
}
