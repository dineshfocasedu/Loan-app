const mongoose = require("mongoose");

let cached = global.__mongoose;
if (!cached) {
  cached = global.__mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGO_URI).then((conn) => conn);
  }
  cached.conn = await cached.promise;
  return cached.conn;
};

module.exports = connectDB;
