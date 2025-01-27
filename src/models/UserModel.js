const mongoose = require("mongoose");
const { isStrongPassword } = require("validator");
const jwt = require("jsonwebtoken")

const userschema = mongoose.Schema({
  firstName: {
    type: String,
    validate(vaule) {
      if (!vaule) {
        throw new Error("lastname requried");
      }
    },
  },
  lastName: { type: String, required: true },
  phoneNumber: { type: Number },
  city: { type: String },
  password: { type: String, required: true },
  emailId: { type: String, required: true },
});

userschema.methods.getJwt =  async function () {
  console.log(this._id);
  const userId =this._id
  
  const token =  await jwt.sign({userId}, "Suri@123");
  return token;
};
userschema.methods.validatePassword = async function (passwordFromRequest){
  const userDeatils = this
  const isPasswordValid=  await bcrypt.compare(passwordFromRequest,userDeatils.password)
  return isPasswordValid
};
userschema.statics.validateJWT = async function (token) {
  const tokenvarification =  await jwt.verify(token, "Suri@123");
  // if we use the THIS here then we can able to acces the all the inbuilt model functions

  return tokenvarification;
};

const User = mongoose.model("deatils", userschema);
module.exports = { User };
