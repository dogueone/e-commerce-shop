const multer = require("multer");
const { v1: uuidv1 } = require("uuid");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

//configure it to which files to accept and where to store it
const fileUpload = multer({
  dest: "uploads/",
  limits: { fileSize: 500000 },
  // storage: multer.diskStorage({
  //   destination: (req, file, cb) => {
  //     cb(null, "uploads/images");
  //   },
  //   filename: (req, file, cb) => {
  //     const ext = MIME_TYPE_MAP[file.mimetype];
  //     cb(null, uuidv1() + "." + ext);
  //   },
  // }),
  // to validate extension of the file
  fileFilter: (req, file, cb) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype];
    console.log(isValid);
    let error = isValid ? null : new Error("Invalid mime type!");
    //second argument is to tell if we accept file or not
    cb(error, isValid);
  },
});

module.exports = fileUpload;
