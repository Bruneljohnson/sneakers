import mongoose from "mongoose";
import { User } from "../models";
import { z } from "zod";
import { UserInput } from "../models/model-types";

//----------Update A Single User----------//

export const updateUserBodySchema = z.object({
  auth_id: z.string(),
  email: z.string(),
  name: z.string(),
  profile_image_name: z.string(),
  profile_image_url: z.string(),
});

export type UpdateUserBodyInput = z.infer<typeof updateUserBodySchema>;

/**
 * Function that updates a single user using id string obtained from event.pathParameters.id and body from event.body.
 * @param {string} id - string set in the url.
 * @param {Partial<UserInput>} body - User object from front end.
 * @return {Promise<ILambdaResponse>}
 */
export const updateUser = async (id: string, body: Partial<UserInput>) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error(`This is not a valid User ID`);
  }
  // SET QUEUE TO GET MESSAGES RELATED TO USER
  const user = await User.findOne({ _id: id });
  if (!user) throw new Error(`No User found with that ID`);

  if (user.auth_id !== body.auth_id) {
    throw new Error(`Only the User can edit their details.`);
  }

  const updatedUser = await User.updateOne({ _id: id }, body, {
    new: true,
    runValidators: true,
  });

  return updatedUser;
};
