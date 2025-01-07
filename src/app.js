const express = require("express");
const  mongooseConnection  = require("../src/config/mongooseConnection");
const { User } = require("./models/UserModel");

const app = express();

mongooseConnection().then((data) => {
  if (data) {
    console.log("Database connected succesfuly");
    app.listen(3000, () => {
      console.log("server started on the port 3000");
    });

    app.post('/user',(req,res)=>{
      const userdata={
        firstName :"surendr",
        lastName :"dhoni",
        phoneNumber:8951693828
      }
      try{
      const user = new User(userdata);
      if(user.save()){
        console.log(user);
        res.send("data succefuly updated")
      }else{
        res.send("error while sveing the user details")
      }}
      catch(err){res.send(err.message)  }
    })
  } else {
    console.log("error:server not started");
  }
}).catch((err)=>{console.log("error while connecting to server ",err.message);});

// const user = "id";

// app.get(`/user/:${user}`, (req, res) => {
//   console.log(req.params);
//   res.send("hi");
// });

// app.get(`/user`, (req, res) => {
//   console.log(req.query);
//   res.send("hi2");
// });

// app.get(`/ab?c`, (req, res) => {
//   console.log(req.query);
//   res.send("hi2");
// });
// app.listen(3000, () => {
//   console.log("Server started on Port 3000");
// });
// app.use("/ganesh", (req, res) => {
//   if (req.path == "/") {
//     res.send("Welcome to Node JS");
//   }
//   res.send("This is from Other router");
// });
// const a = app.use("/start", (req, res1) => {
//   if (req.path == "/welcome") {
//     return res1.send("Welcome to Node JS");
//   }
//   if (req.path == "/welcome1") {
//     return res1.send("Welcome to Node JS1");
//   }
//   return res1.send("This is From /");
// });

// console.log("thisis a",a);
