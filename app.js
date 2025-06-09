import express from "express";
import taskRoutes from "./api/tasks.js"
import userRoutes from "./api/users.js";

const app = express();

//Middleware for parsing JSON
app.use(express.json());

//Route registration
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes)

//Root route
app.get("/", (req, res) => {
  res.send("Welcome to the TaskList API!");
});

//404 handler, for unknown routes. 
app.use((req, res, next) => {
  res.status(404).json({ error: "Route not found" });
});

// Central error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);

  res.status(500).send("Sorry! Something went wrong.");
});
export default app;