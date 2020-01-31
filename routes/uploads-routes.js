var aws = require('aws-sdk')
var express = require('express');
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

var uploadJav = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'javdata/javs',
        acl: 'public-read',
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            cb(null,file.originalname)
        }
    })
})

var uploadIdol = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'javdata/idols',
        acl: 'public-read',
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            cb(null,file.originalname)
        }
    })
})

var uploadSprite = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'javdata/sprites',
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
        bucket: 'javdata/vtts',
        acl: 'public-read',
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            cb(null,file.originalname)
        }
    })
})

var uploadCover = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'javdata/covers',
        acl: 'public-read',
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            cb(null,file.originalname)
        }
    })
})

router.post('/upJav', uploadJav.array('file',20), function (req, res, next) {
    try {
        res.status(200).json({ msg: 'successful upload!' })
    } catch (err) {
        res.status(201).json({ error: err })
    }
})

router.post('/upIdol', uploadIdol.single('file'), function (req, res, next) {
    try {
        res.status(200).json({ msg: 'successful upload!' })
    } catch (err) {
        res.status(201).json({ error: err })
    }
})

router.post('/upVtt', uploadVtt.single('file'), function (req, res, next) {
    try {
        res.status(200).json({ msg: 'successful upload!' })
    } catch (err) {
        res.status(201).json({ error: err })
    }
})

router.post('/upSprite', uploadSprite.single('file'), function (req, res, next) {
    try {
        res.status(200).json({ msg: 'successful upload!' })
    } catch (err) {
        res.status(201).json({ error: err })
    }
})

router.post('/upCover', uploadCover.single('file'), function (req, res, next) {
    try {
        res.status(200).json({ msg: 'successful upload!' })
    } catch (err) {
        res.status(201).json({ error: err })
    }
})

module.exports = router;