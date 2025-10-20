import mongoose from "mongoose";

const URI = process.env.MONGODB_URI!;

if (!URI) {
  throw new Error("MONGODB_URI is not defined");
}

let cachedConnection = global.mongoose;

if (!cachedConnection) {
  cachedConnection = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cachedConnection.conn) return cachedConnection.conn;

  if (!cachedConnection.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      dbName: "RGS",
    };
    mongoose.connect(URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cachedConnection.conn = await cachedConnection.promise;
  } catch (error) {
    cachedConnection.promise = null;
    throw error;
  }

  return cachedConnection.conn;
}
