#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { UserServiceStack } from "../lib/user-service-stack";

const app = new cdk.App();
new UserServiceStack(app, "UserServiceStack", {
  stackName: "SneakerzStackDev",
  env: { account: process.env.ACCOUNT_ID, region: process.env.DEFAULT_REGION },
});
