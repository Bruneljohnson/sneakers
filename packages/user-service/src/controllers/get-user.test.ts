import { handler } from "./get-user";
import { createNewMockProxyHandlerParameters } from "../__mocks__/apigateway-proxy-handler";
import { APIGatewayProxyResult } from "aws-lambda";
import { APIGatewayParemetersConfig, HttpMethods } from "../types/helpers-type.model";
import { addressMockResponseData, userMockResponseData } from "../__mocks__/user-address-objects";
import { User } from "../models";
import mongoose from "mongoose";

beforeAll(() => {
  jest.mock("../config/database/db.ts", () => ({
    launchMongoDB: jest.fn().mockResolvedValueOnce("Connected"),
  }));
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe("Get-user lambda function", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("Get-user lambda returns user.", async () => {
    const mockedUserWithAddress = { ...userMockResponseData, address: [addressMockResponseData] };
    jest.spyOn(User, "findOne").mockImplementationOnce(
      query =>
        ({
          populate: jest.fn().mockReturnThis(),
          exec: jest.fn().mockResolvedValue(mockedUserWithAddress),
        }) as any,
    );

    const config: APIGatewayParemetersConfig = {
      httpMethod: HttpMethods.GET,
      queryStringParameters: null,
      pathParameters: { id: "64b19441b2388ad0d32fd52a" },
      data: null,
    };

    const { event, context, callback } = createNewMockProxyHandlerParameters(config);

    const response = (await handler(event, context, callback)) as APIGatewayProxyResult;

    expect(response.statusCode).toBe(200);
    expect(response.headers).toHaveProperty("Content-Type", "application/json");
    expect(JSON.parse(response.body)).toEqual({ message: "success", data: mockedUserWithAddress });
  });

  test("Get-user lambda return params error when params isn't specified.", async () => {
    const config: APIGatewayParemetersConfig = {
      httpMethod: HttpMethods.GET,
      queryStringParameters: null,
      pathParameters: null,
      data: null,
    };

    const { event, context, callback } = createNewMockProxyHandlerParameters(config);

    const response = (await handler(event, context, callback)) as APIGatewayProxyResult;

    expect(response.statusCode).toBe(400);
    expect(response.headers).toHaveProperty("Content-Type", "application/json");
    expect(JSON.parse(response.body)).toEqual({ message: "No pathParameters found." });
  });

  test("Get-user lambda return ID error when params is incorrect.", async () => {
    const config: APIGatewayParemetersConfig = {
      httpMethod: HttpMethods.GET,
      queryStringParameters: null,
      pathParameters: { id: "64b19441b2388ad0d5" },
      data: null,
    };

    const { event, context, callback } = createNewMockProxyHandlerParameters(config);

    const response = (await handler(event, context, callback)) as APIGatewayProxyResult;

    expect(response.statusCode).toBe(400);
    expect(response.headers).toHaveProperty("Content-Type", "application/json");
    expect(JSON.parse(response.body)).toEqual({ message: "This is not a valid User ID" });
  });

  test("Get-user lambda return User error when ID is a valid length but incorrect.", async () => {
    const config: APIGatewayParemetersConfig = {
      httpMethod: HttpMethods.GET,
      queryStringParameters: null,
      pathParameters: { id: "64b19441b2388ad0d32fd52c" },
      data: null,
    };

    const { event, context, callback } = createNewMockProxyHandlerParameters(config);

    const response = (await handler(event, context, callback)) as APIGatewayProxyResult;

    expect(response.statusCode).toBe(400);
    expect(response.headers).toHaveProperty("Content-Type", "application/json");
    expect(JSON.parse(response.body)).toEqual({ message: "No User found with that ID" });
  });
});
