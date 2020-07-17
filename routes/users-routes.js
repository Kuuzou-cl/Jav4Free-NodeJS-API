const express = require('express');

const auth = require('../middleware/auth');
const usersControllers = require('../controllers/users-controllers')

const router = express.Router();

router.post('/login', usersControllers.login);

router.post("/currentAlive", auth, async (req, res) => {
    const { email } = req.body;
    res.send({alive: true, email: email});
});

module.exports = router;
