import { APIGatewayProxyHandler } from "aws-lambda";
import { deleteUser } from "../service";
import { launchMongoDB } from "../config/database/db";
import { IError } from "../types";

export const handler: APIGatewayProxyHandler = async (event, context) => {
  try {
    context.callbackWaitsForEmptyEventLoop = false;

    const userID = event.pathParameters?.id as string;
    if (!userID)
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "No pathParameters found." }),
      };

    await launchMongoDB();

    await deleteUser(userID);

    return {
      statusCode: 204,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "success! User was deleted." }),
    };
  } catch (error) {
    const err = error as IError;
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: err.message }),
    };
  }
};
