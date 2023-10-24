import { handler } from "./health-check";
import { createNewMockProxyHandlerParameters } from "../__mocks__/apigateway-proxy-handler";
import { APIGatewayProxyResult } from "aws-lambda";
import { APIGatewayParemetersConfig, HttpMethods } from "../types/helpers-type.model";

describe("Health-check lambda function", () => {
  test("Health-check lambda returns status code 200", async () => {
    const config: APIGatewayParemetersConfig = {
      httpMethod: HttpMethods.GET,
      queryStringParameters: null,
      pathParameters: null,
      data: null,
    };

    const { event, context, callback } = createNewMockProxyHandlerParameters(config);

    const response = (await handler(event, context, callback)) as APIGatewayProxyResult;
    expect(response.statusCode).toBe(200);
    expect(response.headers).toHaveProperty("Content-Type", "application/json");
    expect(JSON.parse(response.body)).toEqual({ message: "App is running!" });
  });
});
