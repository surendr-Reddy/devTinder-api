const express = require("express");
const mongooseConnection = require("../src/config/mongooseConnection");
const { User } = require("./models/UserModel");
const { validateAPI } = require("./Utils/ValidateAPI");

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

    // Prepare data for user
    const data = {
      firstName: firstName,
      lastName: lastName,
      emailId: emailId,
      password: password
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
  }})

mongooseConnection().then(() =>
  app.listen(7777, () => {
    console.log("server listin on port 7777");
  })
);
