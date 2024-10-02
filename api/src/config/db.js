import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
  } catch (error) {
    console.error(
      "Falha ao conectar com o MongoDB, por favor contactar o admnistrador:",
      error
    );
    process.exit(1);
  }
};

export default connectDB;
