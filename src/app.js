const express = require("express");
const mongooseConnection = require("../src/config/mongooseConnection");
const cookieparser = require("cookie-parser");
const { authvalidate } = require("./middlewares/auth");
const authrouter = require("./routers/authentication");
const {profileRouter} = require('./routers/profile')
const {requestRouter}=require("./routers/request")
const {userRouter}=require("./routers/user")

const {testfeedRequestRouter}= require("./routers/testFeed");
const { feedRouter } = require("./routers/feed");

const cors= require("cors")

const app = express();
app.use(express.json());
app.use(cookieparser());
app.use(cors({origin:true,credentials:true}))
//authentication router
app.use('/', authrouter);
//profile router
app.use('/profile', authvalidate, profileRouter)
//request Router
app.use('/request',authvalidate,requestRouter);
//user request Router
app.use('/user',authvalidate,userRouter);
// user feed Router
app.use('/user',authvalidate,feedRouter);
app.use('/user',authvalidate,testfeedRequestRouter);



mongooseConnection().then(() =>
  app.listen(7777, () => {
    console.log("Server listen on Port 7777");
  })
);
