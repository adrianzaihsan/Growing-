const express = require("express");
const cors = require("cors");
require("dotenv").config();

console.log("Environment variables loaded:");
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
console.log("DB_NAME:", process.env.DB_NAME);
console.log("DB_PORT:", process.env.DB_PORT);

//Import routes
const authRoutes = require("./routes/auth");
const notesRoutes = require("./routes/notes");
const categoriesRoutes = require("./routes/categories");

//Initialize express app
const app = express();
const PORT = process.env.PORT || 5001;

//Middleware
app.use(cors());
app.use(express.json());

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/categories", categoriesRoutes);

//Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is running" });
});

//Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
