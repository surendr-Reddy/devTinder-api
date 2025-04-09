const {User} = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const authvalidate = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    const { token } = cookies;
 if(!token){
    throw new Error("Invalid token credentials.")
 }
    const decoded = await User.validateJWT(token)
    
    
    if (!decoded) {
      throw new Error(" Invalid credentials.");
    } else {
        
        
      const userDetalis = await User.findById(decoded.userId);
      if (!userDetalis) {
        throw new Error("User Not Found ");
      }
      req.user = userDetalis;
      next();
    }
  } catch (err) {res.status(400).json({Error: err.message})}
};
module.exports = { authvalidate };
