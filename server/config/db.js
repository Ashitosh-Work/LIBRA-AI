const mongoose = require("mongoose");

// async function connectDatabase() {
//   const mongoUri = process.env.MONGO_URI;

//   if (!mongoUri) {
//     throw new Error("MONGO_URI is required. Add it to server/.env.");
//   }

//   mongoose.set("strictQuery", true);

//   console.log("mongouri", mongoUri);
//   const connection = await mongoose.connect(mongoUri);
//   console.log(`MongoDB connected: ${connection.connection.host}`);
// }

async function connectDatabase() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error(
      "MONGO_URI is required. Add it to server/.env or deployment env vars.",
    );
  }

  mongoose.set("strictQuery", true);

  mongoose.connection.on("connected", () => {
    console.log("MongoDB connected:", mongoose.connection.host);
  });
  mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error:", err);
  });

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000,
  });
}

module.exports = connectDatabase;
