// Required
const express = require("express");
const router = express.Router();


// Controller Required
const adminCtrl = require("../controllers/admin");

// Routes
router.post('/delete', adminCtrl.deleteUser);


// EXPORTS
module.exports = router;