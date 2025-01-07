const mongoose = require("mongoose");

async function mongoseConnection() {
  try {
    const mongoseConnection = await mongoose.connect(
      "mongodb+srv://surendrareddy:12345Qwert@nodejsdb.9bik5.mongodb.net/"
    );
    console.log("database connected succeful");
    const collection = await mongoseConnection.connection.collection('helloword');
    return collection;
  } catch (err) {
    console.log(err.message);
  }
}
// const collection1= mongoseConnection();

mongoseConnection().then ((collection)=> {console.log(collection);  return
    collection.find({ firstName: 'surendrdhoni' }).toArray()} )
.then(docs => {
    console.log('Matching documents:', docs);
  })
  .catch(err => {
    console.error('Error fetching documents:', err);
  });
