import { APIGatewayProxyHandler } from "aws-lambda";
import { getUser } from "../service";
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

    const user = await getUser(userID);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "success", data: user }),
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
