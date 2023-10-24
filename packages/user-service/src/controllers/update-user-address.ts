import { APIGatewayProxyHandler } from "aws-lambda";
import { updateAddress, updateAddressBodySchema } from "../service";
import { launchMongoDB } from "../config/database/db";
import { AddressInput } from "../models/model-types";
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
    const payload = JSON.parse(event.body ?? "{}");
    const validationResult = updateAddressBodySchema.safeParse(payload);

    if (validationResult.success) {
      const { data } = validationResult;
      const addressInput: AddressInput = {
        user: data.user,
        first_line: data.first_line,
        second_line: data.second_line,
        city: data.city,
        postcode: data.postcode,
        country: data.country,
      };
      const updatedAddress = await updateAddress(addressID, addressInput);
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "success", data: updatedAddress }),
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
