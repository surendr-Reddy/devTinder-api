const mongoose = require("mongoose");
const { isStrongPassword,isEmail } = require("validator");
const jwt = require("jsonwebtoken")
const bcrypt=require('bcrypt')

const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    validate(vaule) {
      if (!vaule) {
        throw new Error("First name is required");
      }
    },
  },
  lastName: {
    type: String,
    required: [true, "Last name is required"],
    trim: true,
  },
  phoneNumber: {
    type: String,
    validate: {
      validator: (value) => {
        return /^\d{10}$/.test(value)
      }, // Validate phone numbers with 10 digits
      message: "Phone number must be a valid 10-digit number",
    }
  },
  city: { type: String, trim: true },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: 8,
    validate: {
      validator: isStrongPassword, // isStrongPassword(vaule)
      message:
        "Password must be strong (include uppercase, lowercase, number, and symbol)",
    },
  },
  emailId: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    validate: {
      validator: isEmail, // isEmail(vaule)
      message: "Invalid email address",
    },
  },
  age: {
    type: Number,
    min: [0, "Age must be a positive number"],
    max: [120, "Age must be less than or equal to 120"],
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
  },
  photoUrl: {
    type: String,
    validate: {
      validator: (value) =>
        /^https?:\/\/.*\.(jpg|jpeg|png|gif)$/i.test(value), // .test() is a method used with regular expression objects to check if a pattern exists in a string
      message: "Invalid photo URL",
    },
  },
  about: {
    type: String,
    maxlength: [500, "About section must be less than 500 characters"],
  },
  skills: {
    type: [String],
    default: [],
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
});


userSchema.pre("save", async function (next) {
  // Hash password only if it's newly created
  if (this.isNew) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next(); //next() function ensures that the save operation continues.
});

// Generate JWT token
userSchema.methods.getJwt = async function () {
  const token = await jwt.sign({ userId: this._id }, "Suri@123", {
    expiresIn: "7d", // Token expires in 7 days
  });
  return token;
};
// Validate password
userSchema.methods.validatePassword = async function (passwordFromRequest) {
  const userDeatils = this
  const isPasswordValid = await bcrypt.compare(passwordFromRequest, userDeatils.password)
  return isPasswordValid
};
userSchema.statics.validateJWT = async function (token) {
  // if we use the THIS here then we can able to acces the all the inbuilt model functions(like findByID(),findAndUpdate())
  try {
    return jwt.verify(token, "Suri@123");
  } catch (err) {
    throw new Error("Invalid token");
  }
};

const User = mongoose.model("User", userSchema);
module.exports = { User };
