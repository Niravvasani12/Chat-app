const express = require("express");
const router = express.Router();
const { registerUser } = require("../Controllers/userController");

router.post("/register", registerUser);
module.exports = router;
