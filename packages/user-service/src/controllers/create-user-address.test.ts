import { handler } from "./create-user-address";
import { createNewMockProxyHandlerParameters } from "../__mocks__/apigateway-proxy-handler";
import { APIGatewayProxyResult } from "aws-lambda";
import { APIGatewayParemetersConfig, HttpMethods } from "../types/helpers-type.model";
import {
  addressMockRequestBodyData,
  addressMockResponseData,
  userMockRequestBodyData,
  userMockResponseData,
} from "../__mocks__/user-address-objects";
import { Address, User } from "../models";
import mongoose from "mongoose";

beforeAll(() => {
  jest.mock("../config/database/db.ts", () => ({
    launchMongoDB: jest.fn().mockResolvedValueOnce("Connected"),
  }));
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe("Create-user-address lambda function", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("Create-user-address lambda returns new address.", async () => {
    const spyOnFindOne = jest.spyOn(User, "findOne").mockImplementationOnce(query => {
      return query?.auth_id === userMockRequestBodyData("auth0|54367212332324423").auth_id
        ? ({ ...userMockResponseData, save: () => "Updated Document" } as any)
        : null;
    });
    const spyOnCreate = jest
      .spyOn(Address, "create")
      .mockResolvedValueOnce(addressMockResponseData);
    jest.spyOn(User.prototype, "save").mockResolvedValueOnce("Updated Document");

    const config: APIGatewayParemetersConfig = {
      httpMethod: HttpMethods.POST,
      queryStringParameters: null,
      pathParameters: null,
      data: addressMockRequestBodyData("auth0|54367212332324423"),
    };

    const { event, context, callback } = createNewMockProxyHandlerParameters(config);

    const response = (await handler(event, context, callback)) as APIGatewayProxyResult;

    expect(response.statusCode).toBe(201);
    expect(response.headers).toHaveProperty("Content-Type", "application/json");
    expect(JSON.parse(response.body)).toEqual({
      message: "success",
      data: addressMockResponseData,
    });
    expect(spyOnFindOne).toHaveBeenCalledTimes(1);
    expect(spyOnCreate).toHaveBeenCalledTimes(1);
  });
  test("Create-user-address lambda returns error when user doesn't exist.", async () => {
    const spyOnFindOne = jest.spyOn(User, "findOne").mockImplementationOnce(query => {
      return query?.auth_id === userMockRequestBodyData("auth0|54367212332324423").auth_id
        ? ({ ...userMockResponseData, save: () => "Updated Document" } as any)
        : null;
    });
    jest.spyOn(User.prototype, "save").mockResolvedValueOnce("Updated Document");

    const config: APIGatewayParemetersConfig = {
      httpMethod: HttpMethods.POST,
      queryStringParameters: null,
      pathParameters: null,
      data: addressMockRequestBodyData("auth0|54367212332324424"),
    };

    const { event, context, callback } = createNewMockProxyHandlerParameters(config);

    const response = (await handler(event, context, callback)) as APIGatewayProxyResult;

    expect(response.statusCode).toBe(400);
    expect(response.headers).toHaveProperty("Content-Type", "application/json");
    expect(JSON.parse(response.body)).toEqual({
      message: "Invalid User Access! Unable to attach this Address to User.",
    });
    expect(spyOnFindOne).toHaveBeenCalledTimes(1);
  });

  test("Create-user-address lambda returns error when there is no authenticated user.", async () => {
    const config: APIGatewayParemetersConfig = {
      httpMethod: HttpMethods.POST,
      queryStringParameters: null,
      pathParameters: null,
      data: addressMockRequestBodyData("auth0|54367212332324422"),
    };

    const { event, context, callback } = createNewMockProxyHandlerParameters(config);

    const response = (await handler(event, context, callback)) as APIGatewayProxyResult;

    expect(response.statusCode).toBe(400);
    expect(response.headers).toHaveProperty("Content-Type", "application/json");
    expect(JSON.parse(response.body)).toEqual({
      message: "Invalid User Access! Unable to attach this Address to User.",
    });
  });
  test("Create-user-address lambda return validation error when event.body is incorrect.", async () => {
    const config: APIGatewayParemetersConfig = {
      httpMethod: HttpMethods.PUT,
      queryStringParameters: null,
      pathParameters: null,
      data: null,
    };

    const { event, context, callback } = createNewMockProxyHandlerParameters(config);

    const response = (await handler(event, context, callback)) as APIGatewayProxyResult;

    expect(response.statusCode).toBe(400);
    expect(response.headers).toHaveProperty("Content-Type", "application/json");
    expect(JSON.parse(response.body)).toEqual({ message: "Failed to validate body" });
  });
});
