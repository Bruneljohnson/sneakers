import { APIGatewayProxyHandler } from "aws-lambda";
import { getManagementToken } from "../config";
import { saveNewUser } from "../service";
import { launchMongoDB } from "../config/database/db";
import { config } from "dotenv";
import { IError } from "../types";
config();

export const handler: APIGatewayProxyHandler = async (event, context) => {
  try {
    context.callbackWaitsForEmptyEventLoop = false;

    await launchMongoDB();

    const userInfo = await getManagementToken(event);
    const user = await saveNewUser(userInfo);

    return {
      statusCode: 201,
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
