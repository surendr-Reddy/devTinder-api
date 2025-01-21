const mongoose = require("mongoose");
const { isStrongPassword } = require("validator");

const userschema = mongoose.Schema({
  firstName: { type: String ,
    validate(vaule) 
        {if(!vaule){throw new Error("lastname requried")}}
    },
  lastName: { type: String ,required: true},
  phoneNumber: { type: Number  },
  city: { type: Number  },
  password:{type :String,required:true },
  emailId:{type:String,required:true}
  
});

const User = mongoose.model("deatils",userschema)
module.exports ={User}

