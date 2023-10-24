import { Document, Types } from "mongoose";

export type UserDocument = Document & {
  name: string;
  email: string;
  auth_id: string;
  profile_image_name: string;
  profile_image_url: string;
  role?: string;
  address?: Types.ObjectId[];
  shopping_cart?: Types.ObjectId;
  participant?: Types.ObjectId;
  order?: Types.ObjectId;
  transaction?: Types.ObjectId;
};

export type UserInput = {
  name: UserDocument["name"];
  email: UserDocument["email"];
  auth_id: UserDocument["auth_id"];
  profile_image_name: UserDocument["profile_image_name"];
  profile_image_url: UserDocument["profile_image_url"];
  role?: UserDocument["role"];
  address?: Types.ObjectId[];
  shopping_cart?: Types.ObjectId;
  participant?: Types.ObjectId;
  order?: Types.ObjectId;
  transaction?: Types.ObjectId;
};
