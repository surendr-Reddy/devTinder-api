const mongoose = require("mongoose");

const userschema = mongoose.schema({
  firstName: { type: String },
  lastName: { type: String },
  phoneNumber: { type: String },
},{Collection:'userdeatils'});

const User = mongoose.model("userdeatils",userschema)
module.exports ={User}

