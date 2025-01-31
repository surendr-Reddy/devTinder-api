const validator = require("validator");

const validateAPI = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  // Validate firstName and lastName
  if (!firstName || firstName.length < 4 || firstName.length > 50) {
    throw new Error("First name must be between 4 and 50 characters.");
  }

  if (!lastName || lastName.length < 4 || lastName.length > 50) {
    throw new Error("Last name must be between 4 and 50 characters.");
  }

  // Validate emailId
  if (!emailId || !validator.isEmail(emailId)) {
    throw new Error("Invalid email address.");
  }

  // Validate password
  if (!password || !validator.isStrongPassword(password)) {
    throw new Error("Password must be strong (at least 8 characters, including letters, numbers, and special characters).");
  }
};
const validatePassword=(password)=>{
if(!validator.isStrongPassword(password)){
return false
}
return true;
}

module.exports = { validateAPI,validatePassword };
