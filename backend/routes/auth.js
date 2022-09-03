// Required
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

// Controller Required
const authCtrl = require("../controllers/auth");

// Roads
router.post("/signup", authCtrl.signup);
router.post("/login", authCtrl.login);

// EXPORTS
module.exports = router;












// // Get
// router.get("/user/:token", auth, userController.getData);

// // Profil
// router.get("/profil/:username/:admin", auth, userController.getProfil);
// router.post("/profil/:username", auth, multer, userController.updateProfil);


