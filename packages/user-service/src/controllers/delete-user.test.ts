import { handler } from "./delete-user";
import { createNewMockProxyHandlerParameters } from "../__mocks__/apigateway-proxy-handler";
import { APIGatewayProxyResult } from "aws-lambda";
import { APIGatewayParemetersConfig, HttpMethods } from "../types/helpers-type.model";
import { userMockResponseData } from "../__mocks__/user-address-objects";
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

describe("Delete-user lambda function", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("Delete-user lambda deletes user & addresses.", async () => {
    const spyOnUserFindOne = jest.spyOn(User, "findOne").mockImplementationOnce(query => {
      return query?._id === userMockResponseData.id
        ? ({ ...userMockResponseData, save: () => "Updated Document" } as any)
        : null;
    });

    const spyOnUserDelete = jest.spyOn(User, "deleteOne").mockImplementationOnce(query => {
      return query?._id === userMockResponseData.id
        ? null
        : ({ ...userMockResponseData, save: () => "Updated Document" } as any);
    });

    jest.spyOn(Address, "findByIdAndDelete").mockResolvedValueOnce(null);

    const config: APIGatewayParemetersConfig = {
      httpMethod: HttpMethods.DELETE,
      queryStringParameters: null,
      pathParameters: { id: "64b19441b2388ad0d32fd52a" },
      data: null,
    };

    const { event, context, callback } = createNewMockProxyHandlerParameters(config);

    const response = (await handler(event, context, callback)) as APIGatewayProxyResult;

    expect(response.statusCode).toBe(204);
    expect(response.headers).toHaveProperty("Content-Type", "application/json");
    expect(JSON.parse(response.body)).toEqual({ message: "success! User was deleted." });
    expect(spyOnUserFindOne).toHaveBeenCalledTimes(1);
    expect(spyOnUserDelete).toHaveBeenCalledTimes(1);
  });

  test("Delete-user lambda return params error when params isn't specified.", async () => {
    const config: APIGatewayParemetersConfig = {
      httpMethod: HttpMethods.DELETE,
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

  test("Delete-user lambda return ID error when params is incorrect.", async () => {
    const config: APIGatewayParemetersConfig = {
      httpMethod: HttpMethods.DELETE,
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

  test("Delete-user lambda return User error when ID is a valid length but incorrect.", async () => {
    const config: APIGatewayParemetersConfig = {
      httpMethod: HttpMethods.DELETE,
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

  test("Delete-user lambda fails to delete user.", async () => {
    const spyOnUserFindOne = jest.spyOn(User, "findOne").mockImplementationOnce(query => {
      return query?._id === userMockResponseData.id
        ? ({ ...userMockResponseData, save: () => "Updated Document" } as any)
        : null;
    });

    jest.spyOn(Address, "findByIdAndDelete").mockResolvedValueOnce(null);
    const spyOnUserDelete = jest.spyOn(User, "deleteOne").mockImplementationOnce(query => {
      return query?._id === userMockResponseData.id
        ? ({ ...userMockResponseData, save: () => "Updated Document" } as any)
        : null;
    });

    const config: APIGatewayParemetersConfig = {
      httpMethod: HttpMethods.DELETE,
      queryStringParameters: null,
      pathParameters: { id: "64b19441b2388ad0d32fd52a" },
      data: null,
    };

    const { event, context, callback } = createNewMockProxyHandlerParameters(config);

    const response = (await handler(event, context, callback)) as APIGatewayProxyResult;

    expect(response.statusCode).toBe(400);
    expect(response.headers).toHaveProperty("Content-Type", "application/json");
    expect(JSON.parse(response.body)).toEqual({ message: "User was not deleted." });
    expect(spyOnUserFindOne).toHaveBeenCalledTimes(1);
    expect(spyOnUserDelete).toHaveBeenCalledTimes(1);
  });
});
