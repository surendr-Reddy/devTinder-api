const express = require("express");
const { validateAPI } = require("../Utils/ValidateAPI");
const { User } = require("../models/UserModel");
const bcrypt = require("bcrypt");
const authrouter = express.Router();

authrouter.post("/signup", async (req, res) => {
  try {
    const userData = req.body;

    // Input validation
    validateAPI(req);

    // Check if the email is already registered
    const existingUser = await User.findOne({ emailId: userData.emailId });
    if (existingUser) {
      return res.status(400).json({ error: "Email is already registered" });
    }

    // Create and save the user
    const user = new User(userData);
    await user.save();

    // Respond with success
    res.status(201).json({ message: "User successfully signed up", user });
  } catch (err) {
    // Handle errors
    console.error(err);
    res
      .status(500)
      .json({ error: err.message, message: "Internal server error" });
  }
});

authrouter.post("/login", async (req, res) => {
  try {
    const { password, emailId } = req.body;

    // Ensure emailId and password are provided
    if (!emailId || !password) {
      return res.status(400).send("Email and password are required.");
    }

    // Find user by email
    const userDetails = await User.findOne({ emailId });

    if (!userDetails) {
      return res.status(401).send("Invalid credentials.");
    }

    // Compare the provided password with the stored hash
    const isPasswordValid = await userDetails.validatePassword(
      password,
      userDetails.password
    );

    if (isPasswordValid) {
      const jwtToken = await userDetails.getJwt();


      res.cookie("token", jwtToken);
      return res.status(200).send(userDetails);
    } else {
      return res.status(401).send("Invalid credentials.");
    }
  } catch (err) {
    console.error(err); // Log the error for debugging
    return res
      .status(500)
      .send("An error occurred during login." + err.message);
  }
});

authrouter.get("/logout", (req, res) => {
   // Clear the cookie
   // or res.cookie('token',null, {expries:{new date(date.now())}})
   res.clearCookie("token", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "Strict" });
   res.status(201).json({ message: "user logout succesfuly" });
});
module.exports = authrouter;
