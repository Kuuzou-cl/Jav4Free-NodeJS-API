const express = require('express');
const auth = require("../middleware/auth");
//const usersControllers = require('../controllers/users-controllers')
const bcrypt = require("bcrypt");
const { User, validate } = require("../models/user");
const router = express.Router();

router.get("/current", auth, async (req, res) => {
});

module.exports = router;
