import mongoose from "mongoose";
import { User } from "../models";
import { AddressDocument } from "../models/model-types";

//----------Get A Single User----------//
/**
 * Function that returns a single user using id string obtained from event.pathParameters.id.
 * @param {string} id - string set in the url..
 * @return {Promise<ILambdaResponse>}
 */
export const getUser = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error(`This is not a valid User ID`);
  }
  const user = await User.findOne({ _id: id })
    .populate<{ address: AddressDocument }>("address")
    .exec();
  if (!user) throw new Error(`No User found with that ID`);

  return user;
};
