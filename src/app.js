const express = require("express");
const mongooseConnection = require("../src/config/mongooseConnection");
const { User } = require("./models/UserModel");

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

mongooseConnection().then(() =>
  app.listen(7777, () => {
    console.log("server listin on port 7777");
  })
);
