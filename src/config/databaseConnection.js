const mongoose = require("mongoose");
const Dbconnection = async () => {
  const connection = await mongoose.connect(
    "mongodb+srv://surendrareddy:12345Qwert@nodejsdb.9bik5.mongodb.net/"
  );
  return connection
};
module.exports ={Dbconnection}