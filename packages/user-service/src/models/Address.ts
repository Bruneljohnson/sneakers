import { Schema, model } from "mongoose";
import { AddressDocument } from "./model-types";

const addressSchema = new Schema(
  {
    user: { type: String },
    first_line: {
      type: String,
      required: [true, "Please provide the first line of your address"],
      trim: true,
      lowercase: true,
    },
    second_line: {
      type: String,
      trim: true,
      lowercase: true,
    },
    city: {
      type: String,
      required: [true, "Please provide the city"],
      trim: true,
      lowercase: true,
    },
    postcode: {
      type: String,
      required: [true, "Please provide the postcode"],
      trim: true,
      lowercase: true,
    },
    country: {
      type: String,
      required: [true, "Please provide the country"],
      trim: true,
      lowercase: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true }, versionKey: false },
);

export const Address = model<AddressDocument>("Address", addressSchema);
