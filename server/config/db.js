const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

console.log("MongoDB Connected Successfully");
console.log("Database:", mongoose.connection.db.databaseName);
console.log("Host:", mongoose.connection.host);
    console.log("Database Name:", mongoose.connection.name);
    console.log("Host:", mongoose.connection.host);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

module.exports = connectDB;