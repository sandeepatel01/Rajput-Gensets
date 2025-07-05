import mongoose from "mongoose";

const connectDB = async () => {
      try {
            await mongoose.connect(process.env.MONGO_URI)
            console.log(`The db is connect with ${mongoose.connection.host}`.bgGreen.white);
      } catch (error) {
            console.error("Mongodb Connection failed: ", error)
            mongoose.disconnect()
            process.exit(1)
      }
}

export default connectDB;