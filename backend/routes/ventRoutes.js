const express = require("express");
const router = express.Router();

const VentPost = require("../models/VentPost");


// Add vent post
router.post("/add", async (req, res) => {

  try {

    const { text } = req.body;

    const post = new VentPost({ text });

    await post.save();

    res.json({
      message: "Vent posted successfully",
      post
    });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

});


// Get all vent posts
router.get("/all", async (req, res) => {

  try {

    const posts = await VentPost.find().sort({ createdAt: -1 });

    res.json(posts);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

});


// Like a post
router.post("/like/:id", async (req, res) => {

  try {

    const post = await VentPost.findById(req.params.id);

    post.likes += 1;

    await post.save();

    res.json(post);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

});


module.exports = router;