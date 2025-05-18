import mongoose from "mongoose";

const connectToDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI
    );

    console.log("mongodb is connected");
  } catch (e) {
    console.log(e);
  }
};

export default connectToDB;
