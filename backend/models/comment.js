const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({

    userId: { type: String },
    content: { type: String },
    articleId: { type: String },
    createdAt: { type: Date },

})

module.exports = mongoose.model('Comment', commentSchema);