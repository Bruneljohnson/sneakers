import { z } from "zod";
import mongoose from "mongoose";
import { User, Address } from "../models";
import { AddressInput } from "../models/model-types";

//----------Create User Address----------//

export const updateAddressBodySchema = z.object({
  user: z.string(),
  first_line: z.string(),
  second_line: z.string(),
  city: z.string(),
  postcode: z.string(),
  country: z.string(),
});

export type UpdateAddressBodyInput = z.infer<typeof updateAddressBodySchema>;

/**
 * Function that updates a single address using id string obtained from event.pathParameters.id and body from event.body.
 * @param {string} id - string set in the url.
 * @param {Partial<AddressInput>} body - address object from front end.
 * @return {Promise<ILambdaResponse>}
 */

export const updateAddress = async (id: string, body: Partial<AddressInput>) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error(`This is not a valid Address ID`);
  }
  // SET QUEUE TO GET MESSAGES RELATED TO USER

  const [user, currentAddress] = await Promise.all([
    User.findOne({ auth_id: body.user }),
    Address.findOne({ _id: id }),
  ]);
  if (!currentAddress) throw new Error(`No Address found with that ID`);
  if (!user) throw new Error(`No User found with this Address`);

  if (currentAddress.user.toString() !== user?.auth_id.toString()) {
    throw new Error(`Only the User can edit their details.`);
  }

  const updatedAddress = await Address.updateOne({ _id: id }, body, {
    new: true,
    runValidators: true,
  });

  return updatedAddress;
};
