import mongoose from "mongoose";
import { User, Address } from "../models";

//----------Delete A Single User----------//
/**
 * Function that deletes a single user using id string obtained from event.pathParameters.id.
 * @param {string} id - string set in the url..
 * @return {Promise<ILambdaResponse>}
 */
export const deleteUser = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error(`This is not a valid User ID`);
  }
  const user = await User.findOne({ _id: id });
  if (!user) throw new Error(`No User found with that ID`);

  if (user) {
    // await deleteFromS3Bucket(user)
    user?.address?.map(async userAddress => await Address.findByIdAndDelete(userAddress._id));
    user.address = [];
    // SEND QUEUE TO OTHER SERVICES
  }

  const deletedUser = await User.deleteOne({ _id: id });

  if (deletedUser === null) {
    return;
  } else {
    throw new Error(`User was not deleted.`);
  }
};
