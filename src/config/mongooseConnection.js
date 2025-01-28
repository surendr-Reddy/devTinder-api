const mongoose = require("mongoose");
const Dbconnection = async () => {
  const connection = await mongoose.connect(
    "mongodb+srv://surendrareddy:12345Qwert@nodejsdb.9bik5.mongodb.net/devtinderProject"
  );

  if(connection){console.log("Database conncted succesfuly");
  }else {console.log("error connecting to database");
  }
};
module.exports=Dbconnection
