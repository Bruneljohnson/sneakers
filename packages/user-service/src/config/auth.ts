import jwt_decode from "jwt-decode";
import { APIGatewayProxyEvent } from "aws-lambda";
import { getMGMAccessToken, getUserInfo } from "./get-management-accesstoken";
import { IDecodedJWT } from "../types";

//----------GET Auth0 Management API Token----------//
/**
 * Middleware Function that gets Management API Token and retrieves user info.
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @return {void}
 */
export const getManagementToken = async (event: APIGatewayProxyEvent) => {
  try {
    if (event.headers?.authorization && event.headers?.authorization.startsWith("Bearer")) {
      const decodedToken: Partial<IDecodedJWT> = jwt_decode(
        event.headers.authorization.split(" ")[1],
      );

      const id = decodedToken.sub as string;

      //  AUTH0 API MANAGEMENT CALL
      const accessToken = await getMGMAccessToken();
      const userInfo = await getUserInfo(accessToken, id);

      return userInfo;
    } else {
      throw new Error("Failed to retrieve User details (#11).");
    }
  } catch (error) {
    throw new Error("Failed to retrieve User details (#12).");
  }
};
