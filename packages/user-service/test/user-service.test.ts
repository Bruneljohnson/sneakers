import * as cdk from "aws-cdk-lib";
import { expect as cdkExpect, haveResource } from "@aws-cdk/assert";
import * as UserService from "../lib/user-service-stack";

test("Resources exist in template created", () => {
  const app = new cdk.App();
  //     // WHEN
  const stack = new UserService.UserServiceStack(app, "MyTestStack");
  //     // THEN
  cdkExpect(stack).to(haveResource("AWS::CloudFront::Distribution"));
  cdkExpect(stack).to(haveResource("AWS::ApiGatewayV2::Stage"));
  cdkExpect(stack).to(haveResource("AWS::Lambda::Function"));
  cdkExpect(stack).to(haveResource("AWS::ApiGatewayV2::Authorizer"));
  cdkExpect(stack).to(haveResource("AWS::Lambda::Permission"));
  cdkExpect(stack).to(haveResource("AWS::ApiGatewayV2::Integration"));
  cdkExpect(stack).to(haveResource("AWS::ApiGatewayV2::Route"));
  cdkExpect(stack).to(haveResource("AWS::ApiGatewayV2::Api"));
});
