const mongoose = require("mongoose");
const Dbconnection = async () => {
  return (connection = await mongoose.connect(
    "mongodb+srv://surendrareddy:12345Qwert@nodejsdb.9bik5.mongodb.net/testDB"
  ));
};
module.exports=Dbconnection
