const HttpError = require('../models/http-error')

const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");

const spacesEndpoint = new aws.Endpoint("sfo2.digitaloceanspaces.com");
const s3 = new aws.S3({
    endpoint: spacesEndpoint,
    accessKeyId: 'DMJFPZFGRYNJJIBZJHLZ',
    secretAccessKey: '4LMidjQP20kuLkwxXDczG7G/TRb+xKH3yaDKbaqiKLY'
});

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: "javdata",
        acl: "public-read",
        key: function (request, file, cb) {
            cb(null, file.originalname);
        }
    })
}).array("upload", 1);

module.exports = {
    index(req, res) {
        console.log("backend hit");
        upload(req, res, function (error) {
            if (error) {
                console.log(error);
                return res.redirect("/error");
            }
            console.log("File uploaded successfully.");
            res.redirect("/success");
        });
    }
};