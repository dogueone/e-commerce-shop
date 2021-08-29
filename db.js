const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@e-commerce.0wqmg.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("MongoDB Connected...");
  } catch (err) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
