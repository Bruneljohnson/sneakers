import mongoose from "mongoose";
import { handler } from "./get-userinfo-create-user";
import { createNewMockProxyHandlerParameters } from "../__mocks__/apigateway-proxy-handler";
import { APIGatewayProxyResult } from "aws-lambda";
import { APIGatewayParemetersConfig, HttpMethods } from "../types/helpers-type.model";
import { userMockRequestBodyData, userMockResponseData } from "../__mocks__/user-address-objects";
import * as createUserAuth0 from "../service/create-user-auth0cid";
import * as getManToken from "../config/get-management-accesstoken";
import { UserDocument } from "../models/model-types";

beforeAll(() => {
  jest.mock("../config/database/db.ts", () => ({
    launchMongoDB: jest.fn().mockResolvedValueOnce("Connected"),
  }));
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe("Get-userinfo-create-user lambda function", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("Get-user lambda return User.", async () => {
    const spyOnGetMGMAccessToken = jest
      .spyOn(getManToken, "getMGMAccessToken")
      .mockImplementationOnce(() => Promise.resolve("accessToken"));
    const spyOnGetUserInfo = jest.spyOn(getManToken, "getUserInfo").mockImplementationOnce(() =>
      Promise.resolve({
        address: [],
        auth_id: "auth0|54367212332324423",
        email: "test.user@test.com",
        name: "test user",
        profile_image_name: "",
        profile_image_url: "https://test.com/test.jpg",
      }),
    );

    const expectedUser = {
      _id: "650350b4d0601c49a08a1410",
      address: [],
      auth_id: "auth0|54367212332324423",
      createdAt: "2023-09-14T18:28:04.062Z",
      email: "test.user@test.com",
      id: "650350b4d0601c49a08a1410",
      name: "test user",
      order: [],
      participant: [],
      profile_image_name: "",
      profile_image_url: "https://test.com/test.jpg",
      transaction: [],
      updatedAt: "2023-09-14T18:28:04.062Z",
    };
    const spyOnSave = jest
      .spyOn(createUserAuth0, "saveNewUser")
      .mockImplementationOnce(() => Promise.resolve(expectedUser as any));
    const config: APIGatewayParemetersConfig = {
      httpMethod: HttpMethods.GET,
      queryStringParameters: null,
      pathParameters: null,
      data: null,
    };

    const { event, context, callback } = createNewMockProxyHandlerParameters(config);

    const response = (await handler(event, context, callback)) as APIGatewayProxyResult;

    expect(response.statusCode).toBe(201);
    expect(response.headers).toHaveProperty("Content-Type", "application/json");
    expect(JSON.parse(response.body)).toEqual({ message: "success", data: expectedUser });
    expect(spyOnGetMGMAccessToken).toHaveBeenCalledTimes(1);
    expect(spyOnGetUserInfo).toHaveBeenCalledTimes(1);
    expect(spyOnSave).toHaveBeenCalledTimes(1);
  });

  test("Get-userinfo-create-user lambda returns error retrieving user details.", async () => {
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
    expect(JSON.parse(response.body)).toEqual({
      message: "Failed to retrieve User details (#12).",
    });
  });
});
