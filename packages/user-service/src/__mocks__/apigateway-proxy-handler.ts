import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { APIGatewayParemetersConfig } from "../types/helpers-type.model";

export const createNewMockProxyHandlerParameters = (config: APIGatewayParemetersConfig) => {
  const { httpMethod, queryStringParameters, pathParameters, data } = config;
  const event = {
    httpMethod: httpMethod,
    headers: {
      "Content-Type": "application/json",
      authorization:
        "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InAwR1U2QzVMU19scm1kdDI1VGdVdSJ9.eyJpc3MiOiJodHRwczovL2Rldi1kZmNjZTZydnRuaHJyb3ZpLmV1LmF1dGgwLmNvbS8iLCJzdWIiOiJHSzNiNjlubzB0SldjUWZkVHo4eEM4QURsY1h3U0psMkBjbGllbnRzIiwiYXVkIjoiaHR0cHM6Ly9zbmVha2Vyei5jb20iLCJpYXQiOjE2OTQxMDk1OTgsImV4cCI6MTY5NDE5NTk5OCwiYXpwIjoiR0szYjY5bm8wdEpXY1FmZFR6OHhDOEFEbGNYd1NKbDIiLCJndHkiOiJjbGllbnQtY3JlZGVudGlhbHMifQ.lExP_R3VRcdHUUBGTpHVgCycRpUmojzQ3VkFOE_s4Yxvew6Y9vNBJJ0nFvq4tRkbnrzFKV1OaXdhQvRqHQNy6UyCKDTGCElYG_dlx841jNH4N2pVa_lk-EoHfXtW6KDL2kRMnoLAgKC9B5dzX1TijbC5PHGCSTr8VvJAzSF-H9Rgt9mtSmS20CN9auJ9FPmw-_hBKM_y4msGMcqLtYco9BPmxjfSkCE3thUzzDx3-uZSglTE7MVSnVB0s9yee7y0bh8pge0WVtl0fXajx3ekX3oDE6zTOeG7tYeQo4hYCzeYTnfnm4NaBAE1yE6jtctbxJdbDp0Uv33F4MR_75cTsQ",
    },
    queryStringParameters: queryStringParameters,
    multiValueQueryStringParameters: null,
    pathParameters: pathParameters,
    stageVariables: null,
    isBase64Encoded: false,
    body: JSON.stringify(data),
  } as unknown as APIGatewayProxyEvent;

  const context = { callbackWaitsForEmptyEventLoop: false } as unknown as Context;
  const callback = jest.fn();
  return {
    event,
    context,
    callback,
  };
};
