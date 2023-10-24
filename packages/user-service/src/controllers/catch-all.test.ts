import { handler } from "./catch-all";
import { createNewMockProxyHandlerParameters } from "../__mocks__/apigateway-proxy-handler";
import { APIGatewayProxyResult } from "aws-lambda";
import { APIGatewayParemetersConfig, HttpMethods } from "../types/helpers-type.model";

describe("Catch-all lambda function", () => {
  test("Catch-all lambda returns status code 400", async () => {
    const config: APIGatewayParemetersConfig = {
      httpMethod: HttpMethods.GET,
      queryStringParameters: null,
      pathParameters: null,
      data: { auth_id: "auth0|123456678756454" },
    };
    const { event, context, callback } = createNewMockProxyHandlerParameters(config);

    const response = (await handler(event, context, callback)) as APIGatewayProxyResult;
    expect(response.statusCode).toBe(400);
    expect(response.headers).toHaveProperty("Content-Type", "application/json");
    expect(JSON.parse(response.body)).toHaveProperty(
      "message",
      "Sorry! We don't have any data on this endpoint.",
    );
  });
});
