const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");

const s3 = new aws.S3();

aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type, only JPEG and PNG is allowed!"), false);
  }
};

const fileUpload = multer({
  limits: { fileSize: 500000 },
  fileFilter,
  storage: multerS3({
    acl: "public-read",
    s3,
    bucket: process.env.AWS_BUCKET_NAME,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: "TESTING METADATA" });
      //   {fieldName: file.fieldname}
    },
    key: function (req, file, cb) {
      cb(null, `images/${Date.now().toString()}`);
    },
  }),
});

module.exports = fileUpload;
