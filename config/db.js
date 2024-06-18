import mongoose from "mongoose";
import colors from "colors";
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(
      `DB connected successfully host ${mongoose.connection.host}`.bgGreen.white
    );
  } catch (err) {
    console.log(`error in connecting ${err}`.bgRed.white);
  }
};
