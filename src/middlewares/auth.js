const {User} = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const authvalidate = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    const { token } = cookies;
 if(!token){
    throw new Error("Invalid token credentials.")
 }
    
    const cookieValidate = await jwt.verify(token, "Suri@123"); 
    console.log(cookieValidate);
    
    if (!cookieValidate) {
      throw new Error(" Invalid credentials.");
    } else {
        console.log(cookieValidate);
        
      const userDetalis = await User.findById(cookieValidate._id);
      if (!userDetalis) {
        throw new Error("User Not Found ");
      }
      req.user = userDetalis;
      next();
    }
  } catch (err) {res.status(400).send("Error: "+err.message)}
};
module.exports = { authvalidate };
