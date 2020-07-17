const express = require('express');

const usersControllers = require('../controllers/users-controllers')

const router = express.Router();

router.get("/current", auth, async (req, res) => {
    const user = await User.findById(req.user._id).select("-password");
    res.send(user);
});

module.exports = router;
