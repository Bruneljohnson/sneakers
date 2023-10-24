import { Schema, model } from "mongoose";
import validator from "validator";
import { UserDocument } from "./model-types";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your name"],
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      trim: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      select: false,
    },
    auth_id: {
      type: String,
      unique: true,
      trim: true,
    },
    profile_image_name: {
      type: String,
    },
    profile_image_url: {
      type: String,
      required: true,
    },
    address: [{ type: Schema.Types.ObjectId, ref: "Address" }],
    shopping_cart: { type: Schema.Types.ObjectId, ref: "ShoppingCart" },
    participant: [{ type: Schema.Types.ObjectId, ref: "Participant" }],
    order: [{ type: Schema.Types.ObjectId, ref: "Order" }],
    transaction: [{ type: Schema.Types.ObjectId, ref: "Transaction" }],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true }, versionKey: false },
);

export const User = model<UserDocument>("User", userSchema);
