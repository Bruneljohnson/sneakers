import mongoose from "mongoose";
import { User, Address } from "../models";

//----------Delete A Single Address----------//
/**
 * Function that deletes a single address using id string obtained from event.pathParameters.id.
 * @param {string} id - string set in the url..
 */
export const deleteAddress = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("This is not a valid Address ID");
  }
  const addressToBeDeleted = await Address.findOne({ _id: id });
  if (!addressToBeDeleted) throw new Error("No Address found with that ID");

  const user = await User.findOne({ auth_id: addressToBeDeleted?.user });
  if (!user) throw new Error("No User found with this Address.");

  if (user) {
    user.address = user?.address?.filter(
      userAddress => userAddress._id.toString() !== addressToBeDeleted._id.toString(),
    );
    await user.save();
  }

  const deletedAddress = await Address.findByIdAndDelete(id);

  if (deletedAddress === null) {
    return;
  } else {
    throw new Error("Address was not deleted.");
  }
};
