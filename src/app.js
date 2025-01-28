const express = require("express");
const mongooseConnection = require("../src/config/mongooseConnection");
const { User } = require("./models/UserModel");
const { validateAPI } = require("./Utils/ValidateAPI");
const bcrypt = require("bcrypt");
const cookieparser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { authvalidate } = require("./middlewares/auth");

const app = express();
app.use(express.json());
app.use(cookieparser());

app.post("/signup", async (req, res) => {
  try {
    const { password, ...otherFields } = req.body;

    // Input validation
    validateAPI(req);

    // Check if the email is already registered
    const existingUser = await User.findOne({ emailId: otherFields.emailId });
    if (existingUser) {
      return res.status(400).json({ error: "Email is already registered" });
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Combine hashed password with other fields
    const userData = {
      ...otherFields,
      password: passwordHash,
    };

    // Create and save the user
    const user = new User(userData);
    await user.save();

    // Respond with success
    res.status(201).json({ message: "User successfully signed up", user });
  } catch (err) {
    // Handle errors
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/login", async (req, res) => {
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
      const jwtToken = await userDetails.getJwt()

      res.cookie("token", jwtToken);
      return res.status(200).send("Login successful.");
    } else {
      return res.status(401).send("Invalid credentials.");
    }
  } catch (err) {
    console.error(err); // Log the error for debugging
    return res.status(500).send("An error occurred during login."+err.message);
  }
});
// added the auth Midelwear Varifiaction
app.get("/profile", authvalidate,async (req, res) => {
  res.send(req.user);
});

mongooseConnection().then(() =>
  app.listen(7777, () => {
    console.log("Server listen on Port 7777");
  })
);
