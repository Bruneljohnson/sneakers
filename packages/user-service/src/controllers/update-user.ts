import { APIGatewayProxyHandler } from "aws-lambda";
import { updateUser, updateUserBodySchema } from "../service";
import { launchMongoDB } from "../config/database/db";
import { UserInput } from "../models/model-types";
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
    const payload = JSON.parse(event.body ?? "{}");
    const validationResult = updateUserBodySchema.safeParse(payload);

    if (validationResult.success) {
      const { data } = validationResult;
      const userInput: UserInput = {
        name: data.name,
        email: data.email,
        auth_id: data.auth_id,
        profile_image_name: data.profile_image_name,
        profile_image_url: data.profile_image_url,
      };
      const updatedUser = await updateUser(userID, userInput);
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "success", data: updatedUser }),
      };
    } else {
      throw new Error("Failed to validate body");
    }
  } catch (error) {
    const err = error as IError;
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: err.message }),
    };
  }
};
