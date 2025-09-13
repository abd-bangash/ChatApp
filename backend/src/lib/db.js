import mongoose from "mongoose";

export const connectToDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log("Mongo Db connected ", conn.connection.host);
  } catch (error) {
    console.log("Mongo Db connection error", error);
  }
};
