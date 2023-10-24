import { APIGatewayProxyHandler } from "aws-lambda";
import { deleteAddress } from "../service";
import { launchMongoDB } from "../config/database/db";
import { IError } from "../types";

export const handler: APIGatewayProxyHandler = async (event, context) => {
  try {
    context.callbackWaitsForEmptyEventLoop = false;
    const addressID = event.pathParameters?.id as string;
    if (!addressID)
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "No pathParameters found." }),
      };

    await launchMongoDB();

    await deleteAddress(addressID);

    return {
      statusCode: 204,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "success! Address was deleted." }),
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
