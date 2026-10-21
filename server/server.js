
const express = require("express");
const mongoose = require("mongoose");
const Bug = require("./models/Bug");
const cors = require("cors");

require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected!"))
  .catch((err) => console.log("MongoDB connection error:", err.message));




// Check server
app.get("/", (req, res) => {
  res.send("BugTrack server is running!");
});




// Read bugs
app.get("/api/bugs", async (req, res) => {
  try {
    const bugs = await Bug.find();
    res.json(bugs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create bug
app.post("/api/bugs", async (req, res) => {
  try {
    const bug = await Bug.create(req.body);
    res.status(201).json(bug);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update bug
app.put("/api/bugs/:id", async (req, res) => {
  try {
    const bug = await Bug.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!bug) {
      return res.status(404).json({ message: "Bug not found" });
    }

    res.json(bug);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete bug
app.delete("/api/bugs/:id", async (req, res) => {
  try {
    const bug = await Bug.findByIdAndDelete(req.params.id);

    if (!bug) {
      return res.status(404).json({ message: "Bug not found" });
    }

    res.json({ message: "Bug deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Start server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
