import { handler } from "./update-user-address";
import { createNewMockProxyHandlerParameters } from "../__mocks__/apigateway-proxy-handler";
import { APIGatewayProxyResult } from "aws-lambda";
import { APIGatewayParemetersConfig, HttpMethods } from "../types/helpers-type.model";
import {
  addressMockRequestBodyData,
  addressMockResponseData,
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

describe("Update-user-address lambda function", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("Update-user-address lambda updates address.", async () => {
    const spyOnAddressFindOne = jest.spyOn(Address, "findOne").mockImplementationOnce(query => {
      return query?._id === addressMockResponseData.id ? (addressMockResponseData as any) : null;
    });

    const spyOnUserFindOne = jest.spyOn(User, "findOne").mockImplementationOnce(query => {
      return query?.auth_id === userMockResponseData.auth_id
        ? ({ ...userMockResponseData, save: () => "Updated Document" } as any)
        : null;
    });
    const spyOnUpdate = jest
      .spyOn(Address, "updateOne")
      .mockResolvedValueOnce(addressMockResponseData);
    jest.spyOn(User.prototype, "save").mockResolvedValueOnce("Updated Document");

    const config: APIGatewayParemetersConfig = {
      httpMethod: HttpMethods.PUT,
      queryStringParameters: null,
      pathParameters: { id: "64b19441b2388ad0d32fd52b" },
      data: addressMockRequestBodyData("auth0|54367212332324423"),
    };

    const { event, context, callback } = createNewMockProxyHandlerParameters(config);

    const response = (await handler(event, context, callback)) as APIGatewayProxyResult;

    expect(response.statusCode).toBe(200);
    expect(response.headers).toHaveProperty("Content-Type", "application/json");
    expect(JSON.parse(response.body)).toEqual({
      message: "success",
      data: addressMockResponseData,
    });
    expect(spyOnUserFindOne).toHaveBeenCalledTimes(1);
    expect(spyOnAddressFindOne).toHaveBeenCalledTimes(1);
    expect(spyOnUpdate).toHaveBeenCalledTimes(1);
  });

  test("Update-user-address lambda return params error when params isn't specified.", async () => {
    const config: APIGatewayParemetersConfig = {
      httpMethod: HttpMethods.PUT,
      queryStringParameters: null,
      pathParameters: null,
      data: addressMockRequestBodyData("auth0|54367212332324423"),
    };

    const { event, context, callback } = createNewMockProxyHandlerParameters(config);

    const response = (await handler(event, context, callback)) as APIGatewayProxyResult;

    expect(response.statusCode).toBe(400);
    expect(response.headers).toHaveProperty("Content-Type", "application/json");
    expect(JSON.parse(response.body)).toEqual({ message: "No pathParameters found." });
  });

  test("Update-user-address lambda return validation error when body obj has missing fields.", async () => {
    const config: APIGatewayParemetersConfig = {
      httpMethod: HttpMethods.PUT,
      queryStringParameters: null,
      pathParameters: { id: "64b19441b2388ad0d32fd52b" },
      data: {
        ...addressMockRequestBodyData("auth0|54367212332324423"),
        first_line: null as unknown as string,
      },
    };

    const { event, context, callback } = createNewMockProxyHandlerParameters(config);

    const response = (await handler(event, context, callback)) as APIGatewayProxyResult;

    expect(response.statusCode).toBe(400);
    expect(response.headers).toHaveProperty("Content-Type", "application/json");
    expect(JSON.parse(response.body)).toEqual({ message: "Failed to validate body" });
  });

  test("Update-user-address lambda return ID error when params is incorrect.", async () => {
    const config: APIGatewayParemetersConfig = {
      httpMethod: HttpMethods.PUT,
      queryStringParameters: null,
      pathParameters: { id: "64b19441b2388ad0d32fd5" },
      data: addressMockRequestBodyData("auth0|54367212332324423"),
    };

    const { event, context, callback } = createNewMockProxyHandlerParameters(config);

    const response = (await handler(event, context, callback)) as APIGatewayProxyResult;

    expect(response.statusCode).toBe(400);
    expect(response.headers).toHaveProperty("Content-Type", "application/json");
    expect(JSON.parse(response.body)).toEqual({ message: "This is not a valid Address ID" });
  });

  test("Update-user-address lambda return Address error when params is correct but document doesn't exist.", async () => {
    const spyOnAddressFindOne = jest.spyOn(Address, "findOne").mockImplementationOnce(query => {
      return query?._id === addressMockResponseData.id ? (addressMockResponseData as any) : null;
    });

    const config: APIGatewayParemetersConfig = {
      httpMethod: HttpMethods.PUT,
      queryStringParameters: null,
      pathParameters: { id: "64b19441b2388ad0d32fd52c" },
      data: addressMockRequestBodyData("auth0|54367212332324423"),
    };

    const { event, context, callback } = createNewMockProxyHandlerParameters(config);

    const response = (await handler(event, context, callback)) as APIGatewayProxyResult;

    expect(response.statusCode).toBe(400);
    expect(response.headers).toHaveProperty("Content-Type", "application/json");
    expect(JSON.parse(response.body)).toEqual({ message: "No Address found with that ID" });
    expect(spyOnAddressFindOne).toHaveBeenCalledTimes(1);
  });

  test("Update-user-address lambda return User error when user field in address document doesn't match the user.", async () => {
    const spyOnAddressFindOne = jest.spyOn(Address, "findOne").mockImplementationOnce(query => {
      return query?._id === addressMockResponseData.id ? (addressMockResponseData as any) : null;
    });

    const config: APIGatewayParemetersConfig = {
      httpMethod: HttpMethods.PUT,
      queryStringParameters: null,
      pathParameters: { id: "64b19441b2388ad0d32fd52b" },
      data: addressMockRequestBodyData("auth0|543672123323244285"),
    };

    const { event, context, callback } = createNewMockProxyHandlerParameters(config);

    const response = (await handler(event, context, callback)) as APIGatewayProxyResult;

    expect(response.statusCode).toBe(400);
    expect(response.headers).toHaveProperty("Content-Type", "application/json");
    expect(JSON.parse(response.body)).toEqual({ message: "No User found with this Address" });
    expect(spyOnAddressFindOne).toHaveBeenCalledTimes(1);
  });

  test("Update-user-address lambda only allows correctly authenticated user to edit the Address.", async () => {
    const spyOnAddressFindOne = jest.spyOn(Address, "findOne").mockImplementationOnce(query => {
      return query?._id === addressMockResponseData.id ? (addressMockResponseData as any) : null;
    });

    const spyOnUserFindOne = jest.spyOn(User, "findOne").mockImplementationOnce(query => {
      return query?.auth_id === userMockResponseData.auth_id
        ? ({
            ...userMockResponseData,
            auth_id: "auth0|12345678986754321",
            save: () => "Updated Document",
          } as any)
        : null;
    });

    const config: APIGatewayParemetersConfig = {
      httpMethod: HttpMethods.PUT,
      queryStringParameters: null,
      pathParameters: { id: "64b19441b2388ad0d32fd52b" },
      data: addressMockRequestBodyData("auth0|54367212332324423"),
    };

    const { event, context, callback } = createNewMockProxyHandlerParameters(config);

    const response = (await handler(event, context, callback)) as APIGatewayProxyResult;

    expect(response.statusCode).toBe(400);
    expect(response.headers).toHaveProperty("Content-Type", "application/json");
    expect(JSON.parse(response.body)).toEqual({ message: "Only the User can edit their details." });
    expect(spyOnAddressFindOne).toHaveBeenCalledTimes(1);
    expect(spyOnUserFindOne).toHaveBeenCalledTimes(1);
  });
});
