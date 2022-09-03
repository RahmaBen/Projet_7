const mongoose = require('mongoose');

const likeSchema = mongoose.Schema({

    userId: { type: String },
    articleId: { type: String },
    likes: { type: Number, required: false }

})

module.exports = mongoose.model('like', likeSchema);