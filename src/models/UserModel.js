const mongoose = require("mongoose");

const userschema = mongoose.Schema({
  firstName: { type: String ,
    validate(vaule) 
        {if(!vaule){throw new Error("lastname requried")}}
    },
  lastName: { type: String ,required: true},
  phoneNumber: { type: Number  },
  city: { type: Number ,required: true }
  
});

const User = mongoose.model("deatils",userschema)
module.exports ={User}

