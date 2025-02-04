const express = require("express");
const mongooseConnection = require("../src/config/mongooseConnection");
const cookieparser = require("cookie-parser");
const { authvalidate } = require("./middlewares/auth");
const authrouter = require("./routers/authentication ");
const {profileRouter} = require('./routers/profile')
const {requestRouter}=require("./routers/request")
const {userRouter}=require("./routers/user")

const app = express();
app.use(express.json());
app.use(cookieparser());

//authentication router
app.use('/', authrouter);
//profile router
app.use('/profile', authvalidate, profileRouter)
//request Router
app.use('/request',authvalidate,requestRouter);
//user request
app.use('/user',authvalidate,userRouter);

// added the auth Midelwear Varifiaction
app.get("/profile1", authvalidate,  (req, res) => {
  res.send(req.user);
});

mongooseConnection().then(() =>
  app.listen(7777, () => {
    console.log("Server listen on Port 7777");
  })
);
