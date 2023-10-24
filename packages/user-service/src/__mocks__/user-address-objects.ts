import { User, Address } from "../types";

export const userMockRequestBodyData: (auth_id: string) => User = auth_id => ({
  name: "test user",
  auth_id,
  email: "test.user@test.com",
  profile_image_name: "",
  profile_image_url: "https://test.com/test.jpg",
  address: [],
});

export const addressMockRequestBodyData: (user: string) => Address = user => ({
  user,
  first_line: "35 test street",
  second_line: "great testern",
  city: "newcastle",
  postcode: "ne5 6ty",
  country: "UK",
});

export const userMockResponseData: any = {
  id: "64b19441b2388ad0d32fd52a",
  name: "test user",
  auth_id: "auth0|54367212332324423",
  email: "test.user@test.com",
  profile_image_name: "",
  profile_image_url: "https://test.com/test.jpg",
  address: [],
};

export const addressMockResponseData: any = {
  id: "64b19441b2388ad0d32fd52b",
  user: "auth0|54367212332324423",
  first_line: "35 test street",
  second_line: "great testern",
  city: "newcastle",
  postcode: "ne5 6ty",
  country: "UK",
};
