const express = require('express');

const uploaderControllers = require('../controllers/uploader-controllers');

const router = express.Router();

router.post('/uploadFile',uploaderControllers.index);

module.exports = router;