const mongoose = require('mongoose');

const articleSchema = mongoose.Schema({
    userId: { type: String, required: true },
    imageUrl: { type: String, default: "None" },
    content: { type: String, required: false },
    createdAt: { type: Date, required: false },
    likes: { type: Number, required: false },

});

module.exports = mongoose.model('Article', articleSchema);