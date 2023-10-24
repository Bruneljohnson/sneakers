import { User } from "../models";
import { type User as UserType } from "../types";

//----------Create User----------//
/**
 * Function that creates a single user using Auth0 Management API.
 * @param {UserType} user - request object.
 * @return {Promise<UserType>}
 */
export const saveNewUser = async (user: UserType) => {
  const authenticatedUser = await User.findOne({ email: user?.email });

  if (!authenticatedUser) {
    const newUserPayload: UserType = {
      email: user?.email,
      auth_id: user?.auth_id,
      name: user?.name,
      profile_image_name: "",
      profile_image_url: user?.profile_image_url,
    };
    const newUser = await User.create(newUserPayload);
    return newUser;
  }

  if (user && user.auth_id === authenticatedUser.auth_id) {
    return authenticatedUser;
  } else {
    throw new Error(
      `You Exist! Please sign-in with ${
        user.auth_id.startsWith("auth") ? "your Username & Password" : "Google"
      }.`,
    );
  }
};
