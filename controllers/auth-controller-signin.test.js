import mongoose from "mongoose";
import request from "supertest";

import User from "../models/User.js";

import app from "../app.js";

const { TEST_DB_URI, PORT = 3000 } = process.env;

describe("test signup route", () => {
  let server = null;
  beforeAll(async () => {
    await mongoose.connect(TEST_DB_URI);
    server = app.listen(PORT);
  });

  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });

  test("test signin with correct data", async () => {
    const signinData = {
      email: "kosta.rusin@gmail.com",
      password: "123456",
    };

    const { statusCode, body } = await request(app)
      .post("/api/auth/signin")
      .send(signinData);
    expect(statusCode).toBe(200);
    expect(body.token).toBeTruthy();
    expect(typeof body.token).toBe("string");
    expect(body.user.email).toBe(signinData.email);
    expect(body.user.subscription).toBe("starter");
    expect(typeof body.user.avatarURL).toBe("string");
    expect(body.user.avatarURL).toBeTruthy();

    const user = await User.findOne({ email: signinData.email });
    expect(typeof user).toBe("object");
    expect(typeof user.token).toBe("string");
    expect(user.email).toBe(signinData.email);
  });
});
