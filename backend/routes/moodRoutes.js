const express = require("express");
const router = express.Router();

const MoodLog = require("../models/MoodLog");

router.post("/add", async (req, res) => {
  try {

    const { userId, mood, note } = req.body;

    const moodEntry = new MoodLog({
      userId,
      mood,
      note
    });

    await moodEntry.save();

    res.json({
      message: "Mood logged successfully",
      moodEntry
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get("/history/:userId", async (req, res) => {

  try {

    const moods = await MoodLog.find({
      userId: req.params.userId
    });

    res.json(moods);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

});


router.get("/stats/:userId", async (req, res) => {
  try {

    const moods = await MoodLog.find({
      userId: req.params.userId
    });

    const stats = {};

    moods.forEach(m => {
      stats[m.mood] = (stats[m.mood] || 0) + 1;
    });

    res.json(stats);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;