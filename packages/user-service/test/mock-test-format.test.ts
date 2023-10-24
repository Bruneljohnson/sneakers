import { APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import { createNewMockProxyHandlerParameters } from "../src/__mocks__/apigateway-proxy-handler";
import { APIGatewayParemetersConfig, HttpMethods } from "../src/types/helpers-type.model";

// LambdaHandler import from controllers
const handler: APIGatewayProxyHandler = async (event, context) => {
  console.log(JSON.parse(event.body || "{}"));
  const newData = JSON.parse(event.body || "{}");
  return {
    statusCode: 201,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: "success", data: newData }),
  };
};

describe("Lambda Function", () => {
  test("should return a successful response", async () => {
    const config: APIGatewayParemetersConfig = {
      httpMethod: HttpMethods.GET,
      queryStringParameters: null,
      pathParameters: null,
      data: { auth_id: "auth0|123456678756454" },
    };

    const { event, context, callback } = createNewMockProxyHandlerParameters(config);

    const response = (await handler(event, context, callback)) as APIGatewayProxyResult;

    expect(response.statusCode).toBe(201);
    expect(JSON.parse(response.body)).toHaveProperty("data", config.data);
    // Add more assertions here based on your function's response
  });
});
