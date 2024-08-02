const mongoose = require("mongoose");

// connect
const dbConnect = async () => {
  await mongoose.connect(process.env.MONGO_URL);
};

module.exports = dbConnect;
