// Required
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Controller Required
const likeCtrl = require('../controllers/like');

// Routes
router.get('/', auth, likeCtrl.findAllLikes);
router.post('/', auth, likeCtrl.createLike);

// EXPORTS
module.exports = router;