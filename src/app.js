const express = require("express");
const mongooseConnection = require("../src/config/mongooseConnection");
const { User } = require("./models/UserModel");
const { validateAPI } = require("./Utils/ValidateAPI");
const bcrypt = require("bcrypt");
const cookieparser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());
app.use(cookieparser());

app.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, emailId, password } = req.body;

    // encrypting  the password to store DB
    const passwordHash = await bcrypt.hash(password, 10);

    // Prepare data for user
    const data = {
      firstName: firstName,
      lastName: lastName,
      emailId: emailId,
      password: passwordHash,
    };

    // Validate the input data
    validateAPI(req);

    // Create a new User instance
    const user = new User(data);

    // Save the user to the database
    const savedUser = await user.save();

    // Respond with success message
    res.status(201).send("User successfully signed up");
  } catch (err) {
    // Log error for debugging and respond with error message
    console.error(err);
    res.status(400).send({ error: err.message });
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
    const isPasswordValid = await bcrypt.compare(
      password,
      userDetails.password
    );

    if (isPasswordValid) {
      const jwtToken = await jwt.sign({ _id: userDetails._id }, "Suri@123");

      res.cookie("token", jwtToken);
      return res.status(200).send("Login successful.");
    } else {
      return res.status(401).send("Invalid credentials.");
    }
  } catch (err) {
    console.error(err); // Log the error for debugging
    return res.status(500).send("An error occurred during login.");
  }
});

app.get("/profile", async (req, res) => {
  const cookieVaule = req.cookies;
  const { token } = cookieVaule;

  const jwtCoolievarifiled = await jwt.verify(token, "Suri@123");
  console.log("jwtCoolieVaule:", jwtCoolievarifiled);
  const userDetils = await User.findById({ _id: jwtCoolievarifiled._id });

  res.send(userDetils);
});

mongooseConnection().then(() =>
  app.listen(7777, () => {
    console.log("server listin on port 7777");
  })
);
