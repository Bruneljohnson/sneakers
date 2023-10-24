import { handler } from "./delete-user-address";
import { createNewMockProxyHandlerParameters } from "../__mocks__/apigateway-proxy-handler";
import { APIGatewayProxyResult } from "aws-lambda";
import { APIGatewayParemetersConfig, HttpMethods } from "../types/helpers-type.model";
import { addressMockResponseData, userMockResponseData } from "../__mocks__/user-address-objects";
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

describe("Delete-user-address lambda function", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("Delete-user-address lambda deletes address.", async () => {
    const spyOnAddressFindOne = jest.spyOn(Address, "findOne").mockImplementationOnce(query => {
      return query?._id === addressMockResponseData.id ? (addressMockResponseData as any) : null;
    });

    const spyOnUserFindOne = jest.spyOn(User, "findOne").mockImplementationOnce(query => {
      return query?.auth_id === userMockResponseData.auth_id
        ? ({ ...userMockResponseData, save: () => "Updated Document" } as any)
        : null;
    });
    const spyOnDelete = jest.spyOn(Address, "findByIdAndDelete").mockResolvedValueOnce(null);
    jest.spyOn(User.prototype, "save").mockResolvedValueOnce("Updated Document");

    const config: APIGatewayParemetersConfig = {
      httpMethod: HttpMethods.DELETE,
      queryStringParameters: null,
      pathParameters: { id: "64b19441b2388ad0d32fd52b" },
      data: null,
    };

    const { event, context, callback } = createNewMockProxyHandlerParameters(config);

    const response = (await handler(event, context, callback)) as APIGatewayProxyResult;

    expect(response.statusCode).toBe(204);
    expect(response.headers).toHaveProperty("Content-Type", "application/json");
    expect(JSON.parse(response.body)).toEqual({ message: "success! Address was deleted." });
    expect(spyOnUserFindOne).toHaveBeenCalledTimes(1);
    expect(spyOnAddressFindOne).toHaveBeenCalledTimes(1);
    expect(spyOnDelete).toHaveBeenCalledTimes(1);
  });

  test("Delete-user-address lambda return params error when params isn't specified.", async () => {
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

  test("Delete-user-address lambda return ID error when params is incorrect.", async () => {
    const config: APIGatewayParemetersConfig = {
      httpMethod: HttpMethods.DELETE,
      queryStringParameters: null,
      pathParameters: { id: "64b19441b2388ad0d32fd5" },
      data: null,
    };

    const { event, context, callback } = createNewMockProxyHandlerParameters(config);

    const response = (await handler(event, context, callback)) as APIGatewayProxyResult;

    expect(response.statusCode).toBe(400);
    expect(response.headers).toHaveProperty("Content-Type", "application/json");
    expect(JSON.parse(response.body)).toEqual({ message: "This is not a valid Address ID" });
  });

  test("Delete-user-address lambda return Address error when params is correct but document doesn't exist.", async () => {
    const spyOnAddressFindOne = jest.spyOn(Address, "findOne").mockImplementationOnce(query => {
      return query?._id === addressMockResponseData.id ? (addressMockResponseData as any) : null;
    });

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
    expect(JSON.parse(response.body)).toEqual({ message: "No Address found with that ID" });
    expect(spyOnAddressFindOne).toHaveBeenCalledTimes(1);
  });

  test("Delete-user-address lambda return User error when user field in address document doesn't match the user.", async () => {
    const spyOnAddressFindOne = jest.spyOn(Address, "findOne").mockImplementationOnce(query => {
      return query?._id === addressMockResponseData.id ? (addressMockResponseData as any) : null;
    });

    const config: APIGatewayParemetersConfig = {
      httpMethod: HttpMethods.DELETE,
      queryStringParameters: null,
      pathParameters: { id: "64b19441b2388ad0d32fd52b" },
      data: null,
    };

    const { event, context, callback } = createNewMockProxyHandlerParameters(config);

    const response = (await handler(event, context, callback)) as APIGatewayProxyResult;

    expect(response.statusCode).toBe(400);
    expect(response.headers).toHaveProperty("Content-Type", "application/json");
    expect(JSON.parse(response.body)).toEqual({ message: "No User found with this Address." });
    expect(spyOnAddressFindOne).toHaveBeenCalledTimes(1);
  });

  test("Delete-user-address lambda fails to delete address.", async () => {
    const spyOnAddressFindOne = jest.spyOn(Address, "findOne").mockImplementationOnce(query => {
      return query?._id === addressMockResponseData.id ? (addressMockResponseData as any) : null;
    });

    const spyOnUserFindOne = jest.spyOn(User, "findOne").mockImplementationOnce(query => {
      return query?.auth_id === userMockResponseData.auth_id
        ? ({ ...userMockResponseData, save: () => "Updated Document" } as any)
        : null;
    });
    const spyOnDelete = jest
      .spyOn(Address, "findByIdAndDelete")
      .mockResolvedValueOnce("Failed to Delete");

    const config: APIGatewayParemetersConfig = {
      httpMethod: HttpMethods.DELETE,
      queryStringParameters: null,
      pathParameters: { id: "64b19441b2388ad0d32fd52b" },
      data: null,
    };

    const { event, context, callback } = createNewMockProxyHandlerParameters(config);

    const response = (await handler(event, context, callback)) as APIGatewayProxyResult;

    expect(response.statusCode).toBe(400);
    expect(response.headers).toHaveProperty("Content-Type", "application/json");
    expect(JSON.parse(response.body)).toEqual({ message: "Address was not deleted." });
    expect(spyOnUserFindOne).toHaveBeenCalledTimes(1);
    expect(spyOnAddressFindOne).toHaveBeenCalledTimes(1);
    expect(spyOnDelete).toHaveBeenCalledTimes(1);
  });
});
