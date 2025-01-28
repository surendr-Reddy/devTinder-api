const express = require("express");
const mongooseConnection = require("../src/config/mongooseConnection");
const cookieparser = require("cookie-parser");
const { authvalidate } = require("./middlewares/auth");
const authrouter = require("./routers/authentication ");

const app = express();
app.use(express.json());
app.use(cookieparser());

//authentication router
app.use('/',authrouter);

// added the auth Midelwear Varifiaction
app.get("/profile", authvalidate,async (req, res) => {
  res.send(req.user);
});

mongooseConnection().then(() =>
  app.listen(7777, () => {
    console.log("Server listen on Port 7777");
  })
);
