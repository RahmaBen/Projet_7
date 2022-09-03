const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

  name: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  admin: { type: Boolean, required: true },
  imageUrl: { type: String, required: false },
  registerAt: { type: Date, required: true },

});

//Export the model
module.exports = mongoose.model("User", userSchema);
