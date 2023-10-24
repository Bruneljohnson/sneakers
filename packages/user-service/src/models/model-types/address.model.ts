import { Document } from "mongoose";

export type AddressDocument = Document & {
  user: string;
  first_line: string;
  second_line: string;
  city: string;
  postcode: string;
  country: string;
};

export type AddressInput = {
  user: string;
  first_line: AddressDocument["first_line"];
  second_line: AddressDocument["second_line"];
  city: AddressDocument["city"];
  postcode: AddressDocument["postcode"];
  country: AddressDocument["country"];
};
