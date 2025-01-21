const express = require("express");
const mongooseConnection = require("../src/config/mongooseConnection");
const { User } = require("./models/UserModel");
const { validateAPI } = require("./Utils/ValidateAPI");
const bcrypt = require("bcrypt");

const app = express();
app.use(express.json());
//get the the all users
app.get("/user", async (req, res) => {
  const name = req.body.name;
  console.log(name);

  try {
    const result = await User.find({ firstName: name });
    result.length > 0
      ? res.send(result)
      : res.status(404).send("user not found");
  } catch (error) {
    res.status(400).send(`error while retrveing the users ${error.message}`);
  }
});
// delete the user by id findByIdAndDelete()
app.delete("/user", async (req, res) => {
  const id = req.body.id;
  console.log(id);

  try {
    const result = await User.findByIdAndDelete({ id });
    result ? res.send(result) : res.status(404).send("user not found");
  } catch (error) {
    res.status(400).send(`error while retrveing the users ${error.message}`);
  }
});

// update the user by id findByIdAndUpdate() and any filed findOneAndUpdate 

app.patch("/user", async (req, res) => {
  try {
    const name = req.body.name;
    const updatedUser = await User.findOneAndUpdate(
      { firstName: name },
      { firstName: "REDDYSUREsds" },
      { returnDocument: "after",runValidators: true }
    );
    if (updatedUser) {
      res.send(updatedUser);
    } else {
      res.status(400).send("user not found");
    }
  } catch (err) {
    res.send(err.message);
    console.log(err.message);
  }
});

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
    const isPasswordValid = await bcrypt.compare(password, userDetails.password);

    if (isPasswordValid) {
      return res.status(200).send("Login successful.");
    } else {
      return res.status(401).send("Invalid credentials.");
    }
  } catch (err) {
    console.error(err);  // Log the error for debugging
    return res.status(500).send("An error occurred during login.");
  }
});


mongooseConnection().then(() =>
  app.listen(7777, () => {
    console.log("server listin on port 7777");
  })
);
