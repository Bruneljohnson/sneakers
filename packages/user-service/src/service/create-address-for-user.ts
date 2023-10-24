import { z } from "zod";
import { User, Address } from "../models/";
import { AddressInput } from "../models/model-types";

//----------Create User Address----------//

export const createAddressBodySchema = z.object({
  user: z.string(),
  first_line: z.string(),
  second_line: z.string(),
  city: z.string(),
  postcode: z.string(),
  country: z.string(),
});

export type CreateAddressBodyInput = z.infer<typeof createAddressBodySchema>;

/**
 * Function that creates a single user using Auth0 Management API.
 * @param {AddressInput} address - request object.
 * @return {Promise<ILambdaResponse>}
 */
export const createNewAddress = async (address: AddressInput) => {
  const authenticatedUser = await User.findOne({ auth_id: address?.user });
  if (!authenticatedUser)
    throw new Error("Invalid User Access! Unable to attach this Address to User.");

  const newAddress = await Address.create(address);
  if (
    authenticatedUser &&
    !authenticatedUser.address?.find(
      addressInUser => addressInUser._id.toString() === newAddress._id.toString(),
    )
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    authenticatedUser.address?.push(newAddress._id);
    await authenticatedUser.save();
  }

  return newAddress;
};
