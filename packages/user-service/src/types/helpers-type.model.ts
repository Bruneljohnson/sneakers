import { Types } from "mongoose";

export type ISubErrors = {
  message: string;
  [prop: string]: string | boolean | number;
}[];
export interface IError extends Error {
  path?: string;
  name: string;
  code?: number;
  statusCode?: number;
  status?: string;
  message: string;
  stack?: string;
  isOperational?: boolean;
  value?: string;
  errmsg?: string;
  errors?: ISubErrors;
}

export interface ILaunchError {
  message: string;
  [props: string]: string;
}

export type User = {
  auth_id: string;
  email: string;
  name: string;
  profile_image_name: string;
  profile_image_url: string;
  address?: Types.ObjectId[];
  shopping_cart?: Types.ObjectId;
  order?: Types.ObjectId;
  transaction?: Types.ObjectId;
};

export type Address = {
  user: string;
  first_line: string;
  second_line: string;
  city: string;
  postcode: string;
  country: string;
};

export interface IDecodedJWT {
  iss: string;
  sub: string;
  aud: string;
  iat: number;
  exp: number;
  azp: string;
  gty: string;
}
export interface IManagementAccessToken {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
}
export interface IUserInfoResponse {
  created_at: string;
  email: string;
  email_verified: boolean;
  identities: [
    {
      connection: string;
      provider: string;
      user_id: string;
      isSocial: boolean;
    },
  ];
  name: string;
  nickname: string;
  picture: string;
  updated_at: string;
  user_id: string;
  user_metadata: { [prop: string]: string };
  last_ip: string;
  last_login: string;
  logins_count: number;
}

export interface ILambdaResponse {
  statusCode: number;
  headers: {
    [props: string]: string;
  };
  body: string;
}

export enum HttpMethods {
  GET = "GET",
  POST = "POST",
  PATCH = "PATCH",
  PUT = "PUT",
  DELETE = "DELETE",
}

export type APIGatewayParemetersConfig = {
  httpMethod: string;
  queryStringParameters: { name: string } | null;
  pathParameters: { id: string } | null;
  data: Partial<User | Address> | null;
};
