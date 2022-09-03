// Required
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

// Controller Required
const userCtrl = require("../controllers/user");
const articleCtrl = require("../controllers/article");
// Roads
router.get('/', auth, userCtrl.findAllUsers);
router.get('/:id', auth, userCtrl.findOneUser);
router.get('/:id/articles', auth, articleCtrl.findArticlesByUserId);
router.put('/:id', multer, auth, userCtrl.modifyUser);
router.delete('/:id', auth, userCtrl.deleteUser);

// EXPORTS
module.exports = router;