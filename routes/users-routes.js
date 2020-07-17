const express = require('express');
const auth = require("../middleware/auth");
const bcrypt = require("bcrypt");
const usersControllers = require('../controllers/users-controllers')
const router = express.Router();

// router.get('/', usersControllers.getUsers);

router.post('/signup', usersControllers.signup);

router.post('/login', usersControllers.login);

// router.patch('/update/:uid', usersControllers.updateUser);

// router.delete('/:uid', usersControllers.deleteUser);

module.exports = router;
