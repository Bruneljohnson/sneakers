import { handler } from "./update-user";
import { createNewMockProxyHandlerParameters } from "../__mocks__/apigateway-proxy-handler";
import { APIGatewayProxyResult } from "aws-lambda";
import { APIGatewayParemetersConfig, HttpMethods } from "../types/helpers-type.model";
import { userMockRequestBodyData, userMockResponseData } from "../__mocks__/user-address-objects";
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

describe("Update-user lambda function", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("Update-user lambda returns updated user.", async () => {
    const spyOnUserFindOne = jest.spyOn(User, "findOne").mockImplementationOnce(query => {
      return query?._id === userMockResponseData.id
        ? ({ ...userMockResponseData, save: () => "Updated Document" } as any)
        : null;
    });
    const spyOnUserUpdateOne = jest.spyOn(User, "updateOne").mockImplementationOnce(query => {
      return query?._id === userMockResponseData.id
        ? ({ ...userMockResponseData, save: () => "Updated Document" } as any)
        : null;
    });

    const config: APIGatewayParemetersConfig = {
      httpMethod: HttpMethods.PUT,
      queryStringParameters: null,
      pathParameters: { id: "64b19441b2388ad0d32fd52a" },
      data: userMockRequestBodyData("auth0|54367212332324423"),
    };

    const { event, context, callback } = createNewMockProxyHandlerParameters(config);

    const response = (await handler(event, context, callback)) as APIGatewayProxyResult;

    expect(response.statusCode).toBe(200);
    expect(response.headers).toHaveProperty("Content-Type", "application/json");
    expect(JSON.parse(response.body)).toEqual({ message: "success", data: userMockResponseData });
    expect(spyOnUserFindOne).toHaveBeenCalledTimes(1);
    expect(spyOnUserUpdateOne).toHaveBeenCalledTimes(1);
  });

  test("Update-user lambda return params error when params isn't specified.", async () => {
    const config: APIGatewayParemetersConfig = {
      httpMethod: HttpMethods.PUT,
      queryStringParameters: null,
      pathParameters: null,
      data: userMockRequestBodyData("auth0|54367212332324423"),
    };

    const { event, context, callback } = createNewMockProxyHandlerParameters(config);

    const response = (await handler(event, context, callback)) as APIGatewayProxyResult;

    expect(response.statusCode).toBe(400);
    expect(response.headers).toHaveProperty("Content-Type", "application/json");
    expect(JSON.parse(response.body)).toEqual({ message: "No pathParameters found." });
  });

  test("Update-user lambda return ID error when params is incorrect.", async () => {
    const config: APIGatewayParemetersConfig = {
      httpMethod: HttpMethods.PUT,
      queryStringParameters: null,
      pathParameters: { id: "64b19441b2388ad0d5" },
      data: userMockRequestBodyData("auth0|54367212332324423"),
    };

    const { event, context, callback } = createNewMockProxyHandlerParameters(config);

    const response = (await handler(event, context, callback)) as APIGatewayProxyResult;

    expect(response.statusCode).toBe(400);
    expect(response.headers).toHaveProperty("Content-Type", "application/json");
    expect(JSON.parse(response.body)).toEqual({ message: "This is not a valid User ID" });
  });

  test("Update-user lambda return User error when ID is a valid length but incorrect.", async () => {
    const spyOnUserFindOne = jest.spyOn(User, "findOne").mockImplementationOnce(query => {
      return query?._id === userMockResponseData.id
        ? ({ ...userMockResponseData, save: () => "Updated Document" } as any)
        : null;
    });

    const config: APIGatewayParemetersConfig = {
      httpMethod: HttpMethods.PUT,
      queryStringParameters: null,
      pathParameters: { id: "64b19441b2388ad0d32fd52f" },
      data: userMockRequestBodyData("auth0|54367212332324423"),
    };

    const { event, context, callback } = createNewMockProxyHandlerParameters(config);

    const response = (await handler(event, context, callback)) as APIGatewayProxyResult;

    expect(response.statusCode).toBe(400);
    expect(response.headers).toHaveProperty("Content-Type", "application/json");
    expect(JSON.parse(response.body)).toEqual({ message: "No User found with that ID" });
    expect(spyOnUserFindOne).toBeCalledTimes(1);
  });

  test("Update-user lambda returns error when auth_id of user and event.body don't match.", async () => {
    const spyOnUserFindOne = jest.spyOn(User, "findOne").mockImplementationOnce(query => {
      return query?._id === userMockResponseData.id
        ? ({ ...userMockResponseData, save: () => "Updated Document" } as any)
        : null;
    });

    const config: APIGatewayParemetersConfig = {
      httpMethod: HttpMethods.PUT,
      queryStringParameters: null,
      pathParameters: { id: "64b19441b2388ad0d32fd52a" },
      data: userMockRequestBodyData("auth0|54367212332324425"),
    };

    const { event, context, callback } = createNewMockProxyHandlerParameters(config);

    const response = (await handler(event, context, callback)) as APIGatewayProxyResult;

    expect(response.statusCode).toBe(400);
    expect(response.headers).toHaveProperty("Content-Type", "application/json");
    expect(JSON.parse(response.body)).toEqual({ message: "Only the User can edit their details." });
    expect(spyOnUserFindOne).toBeCalledTimes(1);
  });

  test("Update-user lambda return validation error when event.body is incorrect.", async () => {
    const config: APIGatewayParemetersConfig = {
      httpMethod: HttpMethods.PUT,
      queryStringParameters: null,
      pathParameters: { id: "64b19441b2388ad0d32fd52a" },
      data: null,
    };

    const { event, context, callback } = createNewMockProxyHandlerParameters(config);

    const response = (await handler(event, context, callback)) as APIGatewayProxyResult;

    expect(response.statusCode).toBe(400);
    expect(response.headers).toHaveProperty("Content-Type", "application/json");
    expect(JSON.parse(response.body)).toEqual({ message: "Failed to validate body" });
  });
});
