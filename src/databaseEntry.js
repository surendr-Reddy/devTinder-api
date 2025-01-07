const { Dbconnection } = require("./config/databaseConnection");

async function DatabaseEntry() {
  try {
    const monogoDB = await Dbconnection();
    console.log("Database Connected successfuly");
    return  monogoDB
  } catch (err) {
    console.log("error while connecting to the Databse:",err.message);
  }
}
module.exports ={DatabaseEntry};
