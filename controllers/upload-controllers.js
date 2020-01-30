const HttpError = require('../models/http-error')
var aws = require('aws-sdk')
var multer = require('multer')
var multerS3 = require('multer-s3')

const spacesEndpoint = new aws.Endpoint("sfo2.digitaloceanspaces.com");

const s3 = new aws.S3({
    endpoint: spacesEndpoint,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET
});

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: "javdata",
        acl: "public-read",
        key: function(request, file, cb) {
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