import { getMGMAccessToken, getTestAccessToken, getUserInfo } from "./get-management-accesstoken";

describe("Get Management Access Token & User Info ", () => {
  it("should return the Management Access Token if all required env vars are present", async () => {
    process.env.CLIENT_ID;
    process.env.CLIENT_SECRET;
    process.env.AUTH0_DOMAIN;

    const accessToken = await getMGMAccessToken();

    expect(accessToken).toHaveLength(770);
  });
  it("should return the Test Access Token if all required env vars are present", async () => {
    process.env.CLIENT_ID;
    process.env.CLIENT_SECRET;
    process.env.AUTH0_DOMAIN;

    const accessToken = await getTestAccessToken();

    expect(accessToken).toHaveLength(720);
  });

  it("should return the User Info if all required env vars are present and ID is correct", async () => {
    process.env.CLIENT_ID;
    process.env.CLIENT_SECRET;
    process.env.AUTH0_DOMAIN;
    const id = "auth0|64cb6e154ea1970a5586dc0c";
    const user = {
      authID: id,
      name: "test admin",
      email: "test.admin@and.digital",
      slug: "test-admin",
      profileImageName: "",
      profileImageUrl:
        "https://s.gravatar.com/avatar/c2ee7bd116296ffdc63cf1711dfcb648?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fte.png",
    };

    const accessToken = await getMGMAccessToken();
    const userInfo = await getUserInfo(accessToken, id);

    expect(userInfo).toEqual(user);
  });
  it("should throw error if ID is incorrect", async () => {
    const id = "auth0|64cb6e154ea1970a5586dc0c3";
    expect.assertions(1);
    try {
      const accessToken = await getMGMAccessToken();
      await getUserInfo(accessToken, id);
    } catch (error) {
      expect(error).toThrowError();
    }
  });
  it("should throw error if Management API AccessToken is incorrect", async () => {
    const id = "auth0|64cb6e154ea1970a5586dc0c";
    expect.assertions(1);
    try {
      const accessToken = await getMGMAccessToken();
      await getUserInfo(accessToken + "5", id);
    } catch (error) {
      expect(error).toThrowError();
    }
  });
  it("should throw an error when env variables are incorrect", async () => {
    process.env.CLIENT_ID = "kappa";
    process.env.CLIENT_SECRET = "kappakappakappa";
    process.env.AUTH0_DOMAIN = "kappa.com";
    expect.assertions(1);
    try {
      await getMGMAccessToken();
    } catch (error) {
      expect(error).toThrowError();
    }
  });
});
