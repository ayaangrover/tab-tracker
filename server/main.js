const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

const mongoURI =
  "mongodb+srv://ayaangrover:oISBnBgfZDzF0Trh@tabtracker.ztoy8.mongodb.net/?retryWrites=true&w=majority&appName=tabTracker";

mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const activitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  activity: [
    {
      tabVisited: String,
      timestamp: Date,
    },
  ],
});

const User = mongoose.model("User", userSchema);
const Activity = mongoose.model("Activity", activitySchema);

// User registration
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "User Registered" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during registration" });
  }
});

// User login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).send("Invalid Credentials");
  }

  // Return user ID or some identifier instead of a token
  res.json({ userId: user._id, username: user.username });
});

// Function to log activity to your server
app.post("/track", async (req, res) => {
  const { userId, tabVisited } = req.body;

  if (!userId || !tabVisited) {
    return res.status(400).send("User ID and tabVisited are required.");
  }

  // Get the current time
  const now = new Date();
  const tenMinutesAgo = new Date(now.getTime() - 10 * 60000); // 10 minutes in the past

  // Check for existing activity within the last 10 minutes
  const existingActivity = await Activity.findOne({
    userId,
    "activity.tabVisited": tabVisited,
    "activity.timestamp": { $gte: tenMinutesAgo },
  });

  if (existingActivity) {
    return res
      .status(200)
      .send("Activity already logged in the past 10 minutes.");
  }

  const activityEntry = {
    tabVisited,
    timestamp: now,
  };

  const activityRecord = await Activity.findOne({ userId });

  if (activityRecord) {
    activityRecord.activity.push(activityEntry);
    await activityRecord.save();
  } else {
    const newActivity = new Activity({
      userId,
      activity: [activityEntry],
    });
    await newActivity.save();
  }

  console.log("Activity logged:", tabVisited);
  res.status(201).send("Activity Logged");
});

app.delete("/clear-entries", async (req, res) => {
  try {
    // Delete all documents in the Activity collection
    await Activity.deleteMany({});

    res.status(200).send("All activity entries cleared successfully.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error clearing all entries.");
  }
});

app.get("/activity", async (req, res) => {
  try {
    const activities = await Activity.find().populate("userId"); // Populate userId to get the username

    // Create structured response
    const response = activities.map((activity) => ({
      userId: activity.userId.username, // Access the username directly after population
      activity: activity.activity,
    }));

    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
