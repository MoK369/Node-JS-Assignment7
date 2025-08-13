import mongoose from "mongoose";

async function connectToMongoDB() {
  try {
    const result = await mongoose.connect(
      "mongodb://localhost:27017/assignment7_db",
      {
        serverSelectionTimeoutMS: 5000
      }
    );
    console.warn("Connected to MongoDB Successfully👌");
    return true;
  } catch (error) {
    console.warn("Failed Connecting to MongoDb ❌");
    console.log({ error });
    return false;
  }
}

export default connectToMongoDB;
