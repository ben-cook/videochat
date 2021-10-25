import * as cdk from "@aws-cdk/core";
import * as ecr from "@aws-cdk/aws-ecr";
import * as ec2 from "@aws-cdk/aws-ec2";
import * as ecs from "@aws-cdk/aws-ecs";
import * as iam from "@aws-cdk/aws-iam";

export class VideochatCdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // this container repository will hold our dockerised applications to be served
    // by other aws services
    const clientRepo = new ecr.Repository(this, "videochat-client", {
      repositoryName: "videochat-client",
    });

    const serverRepo = new ecr.Repository(this, "videochat-server", {
      repositoryName: "videochat-server",
    });

    // a Virtual Private Cloud allows for all the services we are defining to be linked together
    const vpc = new ec2.Vpc(this, "videochat-vpc");

    // An ecs cluster is a logical grouping of tasks or services in the cloud
    const cluster = new ecs.Cluster(this, "videochat-cluster", {
      clusterName: "videochat-cluster",
      vpc: vpc,
    });

    const executionRole = new iam.Role(this, "videochat-execution-role", {
      assumedBy: new iam.ServicePrincipal("ecs-tasks.amazonaws.com"),
      roleName: "videochat-execution-role",
    });

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

    const TaskDefinition = new ecs.FargateTaskDefinition(
      this,
      "videochat-task-definition",
      {
        executionRole: executionRole,
        family: "videochat-task-definition",
      }
    );

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

    new ecs.FargateService(this, "videochat", {
      cluster: cluster,
      taskDefinition: TaskDefinition,
      serviceName: "videochat-task-definition",
    });
  }
}
