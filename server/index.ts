import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import mongoose from "mongoose";
import { activitiesRouter } from "./routes/activities";
import { studentsRouter } from "./routes/students";
import { teachersRouter } from "./routes/teachers";
import { activityTemplatesRouter } from "./routes/activityTemplates";
import { adminRouter } from "./routes/admin";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Connect to MongoDB once per server process
  const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/MAP";
  if (!mongoose.connection.readyState) {
    mongoose
      .connect(mongoUri, { dbName: process.env.MONGODB_DBNAME })
      .then(() => {
        const { name, host } = mongoose.connection;
        console.log(`✅ MongoDB connected → db: ${name} @ ${host}`);
      })
      .catch((err) => console.error("❌ MongoDB connection error:", err));
  }

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);
  app.use("/api/activities", activitiesRouter);
  app.use("/api/students", studentsRouter);
  app.use("/api/teachers", teachersRouter);
  app.use("/api/activity-templates", activityTemplatesRouter);
  app.use("/api/admin", adminRouter);

  // Health
  app.get("/health", (_req, res) => {
    const dbState = mongoose.connection.readyState; // 0=disconnected, 1=connected
    res.json({ ok: true, dbConnected: dbState === 1 });
  });

  return app;
}
