var aws = require('aws-sdk')
var express = require('express');
const auth = require('../middleware/auth');
var router = express.Router();
var multer = require('multer')
var multerS3 = require('multer-s3')

const HttpError = require('../models/http-error');

const spacesEndpoint = new aws.Endpoint('sfo2.digitaloceanspaces.com');
const s3 = new aws.S3({
    endpoint: spacesEndpoint,
    accessKeyId: 'DMJFPZFGRYNJJIBZJHLZ',
    secretAccessKey: '4LMidjQP20kuLkwxXDczG7G/TRb+xKH3yaDKbaqiKLY'
});

var uploadSprite = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'javdata/R34H/sprites',
        acl: 'public-read',
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            cb(null,file.originalname)
        }
    })
})

var uploadVtt = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'javdata/R34H/vtts',
        acl: 'public-read',
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            cb(null,file.originalname)
        }
    })
})

var uploadVideo = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'javdata/R34H/videos',
        acl: 'public-read',
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            cb(null,file.originalname)
        }
    })
})

router.post('/upVideo', auth, uploadVideo.array('file',99), function (req, res, next) {
    try {
        res.status(200).json({ msg: 'successful upload!' })
    } catch (err) {
        res.status(201).json({ error: err })
    }
})

router.post('/upVtt', auth, uploadVtt.array('file',99), function (req, res, next) {
    try {
        res.status(200).json({ msg: 'successful upload!' })
    } catch (err) {
        res.status(201).json({ error: err })
    }
})

router.post('/upSprite', auth, uploadSprite.array('file',99), function (req, res, next) {
    try {
        res.status(200).json({ msg: 'successful upload!' })
    } catch (err) {
        res.status(201).json({ error: err })
    }
})

module.exports = router;