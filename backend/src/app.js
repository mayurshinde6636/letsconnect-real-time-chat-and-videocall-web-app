import express from "express";
import { createServer } from "node:http";
import mongoose from "mongoose";
import cors from "cors";

import connectToSocket from "./controllers/socketManager.js";
import userRoutes from "./routes/users.routes.js";

const app = express();
const server = createServer(app);

// Initialize Socket.IO
connectToSocket(server);

// Middleware
app.use(cors());
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));
app.use("/api/v1/users",userRoutes);
// Port
app.set("port", process.env.PORT || 8000);

// Routes
app.get("/home", (req, res) => {
  res.json({
    hello: "World",
  });
});

app.use("/api/users", userRoutes);

// Start Server
const start = async () => {
  try {
    const connectionDb = await mongoose.connect(
      "mongodb+srv://mayur:Test123456@cluster0.uw82ljh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    );

    console.log(
      `✅ MongoDB Connected DB Host: ${connectionDb.connection.host}`
    );

    server.listen(app.get("port"), () => {
      console.log(
        `🚀 LISTENING ON PORT ${app.get("port")}`
      );
    });
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err);
  }
};

start();