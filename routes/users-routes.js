const express = require('express');

const usersControllers = require('../controllers/users-controllers')

const router = express.Router();

router.get('/', usersControllers.getUsers);

router.delete('/:uid', usersControllers.deleteUser);

module.exports = router;
