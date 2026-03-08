const mongoose = require("mongoose");

const ventSchema = new mongoose.Schema({

  text: {
    type: String,
    required: true
  },

  likes: {
    type: Number,
    default: 0
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("VentPost", ventSchema);