const mongoose = require("mongoose");
const Dbconnection = async () => {
  const connection = await mongoose.connect(
    "mongodb+srv://surendrareddy:12345Qwert@nodejsdb.9bik5.mongodb.net/testDB"
  );

  if(connection){console.log("database conncted succfuly");
  }else {console.log("error connecting to database");
  }
};
module.exports=Dbconnection
