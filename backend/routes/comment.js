// Required
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Controller Required
const commentCtrl = require('../controllers/comment');

// Routes

router.post('/', auth, commentCtrl.createComment);
router.delete('/:id', auth, commentCtrl.deleteComment);

// EXPORTS
module.exports = router;