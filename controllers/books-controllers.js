const fs = require("fs");
// const { v1: uuidv1 } = require("uuid");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
// const aws = require("aws-sdk");

const HttpError = require("../models/http-error");
const Product = require("../models/product");
const User = require("../models/user");

// const MIME_TYPE_MAP = {
//   "image/png": "png",
//   "image/jpeg": "jpeg",**
//   "image/jpg": "jpg",
// };

const getBooks = async (req, res, next) => {
  let books;
  try {
    books = await Product.find();
  } catch (err) {
    return next(
      new HttpError("Fetching book failed, please try again later", 500)
    );
  }
  if (books.length === 0) {
    return next(new HttpError("Could not find any books", 404));
    // throw new HttpError("Could not find any books", 404);
  }

  res.json({ books: books.map((book) => book.toObject({ getters: true })) });
};

const getBookById = async (req, res, next) => {
  const bookId = req.params.bid;
  console.log(bookId);
  let book;
  try {
    book = await Product.findById(bookId);
  } catch (err) {
    return next(
      new HttpError("Fetching book failed, please try again later", 500)
    );
  }
  if (!book) {
    return next(
      new HttpError("Could not find a book for the provided id", 404)
    );
    // throw new HttpError("Could not find a book for the provided id", 404);
  }
  res.json({ book: book.toObject({ getters: true }) });
};

const getBooksByIds = async (req, res, next) => {
  const booksIds = req.params.bids.split(",");
  try {
    books = await Product.find({ _id: { $in: booksIds } });
  } catch (err) {
    return next(new HttpError("Fetching failed, please try again later", 500));
  }
  if (!books || booksIds.length != books.length) {
    console.log(books);
    return next(new HttpError("Product not found, please try again ", 404));
  }
  res.json({ books: books.map((book) => book.toObject({ getters: true })) });
};

// const getBooksByUserId = async (req, res, next) => {
//   const userId = req.params.uid;

//   let userWithBooks;

//   try {
//     userWithBooks = await User.findById(userId).populate("books");
//   } catch (err) {
//     return next(
//       new HttpError("Fetching user failed, please try again later", 500)
//     );
//   }

//   if (!userWithBooks || userWithBooks.books.length === 0) {
//     return next(
//       new HttpError("Could not find books for the provided user id", 404)
//     );
//   }

//   res.json({
//     books: userWithBooks.books.map((b) => b.toObject({ getters: true })),
//   });*
// };

const createBook = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  console.log(req.body);

  if (!req.file && req.body.image !== "placeholder") {
    return next(new HttpError("Something wrong with image, try again", 422));
  }

  const { title, description, price, creator } = req.body;

  let image;

  if (req.body.image === "placeholder") {
    image = process.env.CLOUDFLARE_DOMAIN + "images/placeholder";
  } else {
    image = process.env.CLOUDFLARE_DOMAIN + req.file.key;
  }

  const createdBook = new Product({
    title,
    // image: req.file.path,
    image: image,
    description,
    price: Number(price).toFixed(2),
    creator,
  });

  let user;
  try {
    user = await User.findById(creator);
  } catch (err) {
    return next(new HttpError("Creating book failed, please try again", 500));
  }

  if (!user) {
    return next(new HttpError("Could not find user for provide id", 404));
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdBook.save({ session: sess });
    user.books.push(createdBook); // adds only _id of a book to user
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError("Creating book failed, please try again.", 500);
    return next(error);
  }

  res.status(201).json({ book: createdBook });

  // aws.config.setPromisesDependency();
  // aws.config.update({
  //   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  //   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  //   region: process.env.AWS_REGION,
  // });
  // const s3 = new aws.S3();
  // const ext = MIME_TYPE_MAP[req.file.mimetype];
  // const params = {
  //   ACL: "public-read",
  //   Bucket: process.env.AWS_BUCKET_NAME,
  //   Body: fs.createReadStream(req.file.path),
  //   Key: `images/${uuidv1() + "." + ext}`,
  // };

  // s3.upload(params, (err, data) => {
  //   if (err) {
  //     console.log("Error occured while trying to upload to S3 bucket", err);
  //     return next(
  //       new HttpError("Error occured while trying to upload an image", 500)
  //     );
  //   }
  //   if (data) {
  //     console.log(data);
  //     fs.unlinkSync(req.file.path); // Empty temp folder
  //     const locationUrl = data.Location;
  //     const { title, description, price, creator } = req.body;

  //     const createdBook = new Product({
  //       title,
  //       // image: req.file.path,
  //       image: locationUrl,
  //       description,
  //       price: Number(price).toFixed(2),
  //       creator,
  //     });

  //     const asyncBlock = async () => {
  //       let user;
  //       try {
  //         user = await User.findById(creator);
  //       } catch (err) {
  //         return next(
  //           new HttpError("Creating book failed, please try again", 500)
  //         );
  //       }

  //       if (!user) {
  //         return next(new HttpError("Could not find user for provide id", 404));
  //       }

  //       try {
  //         const sess = await mongoose.startSession();
  //         sess.startTransaction();
  //         await createdBook.save({ session: sess });
  //         user.books.push(createdBook); // adds only _id of a book to user
  //         await user.save({ session: sess });
  //         await sess.commitTransaction();
  //       } catch (err) {
  //         const error = new HttpError(
  //           "Creating book failed, please try again.",
  //           500
  //         );
  //         return next(error);
  //       }
  //     };
  //     asyncBlock();
  //     res.status(201).json({ book: createdBook });
  //   }
  // });
};

const updateBook = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { title, description, image, price } = req.body;
  const bookId = req.params.bid;

  let updatedBook;
  try {
    // throw error;
    updatedBook = await Product.findById(bookId);
  } catch (err) {
    return next(
      new HttpError("Fetching book failed, please try again later", 500)
    );
  }

  if (updatedBook.creator.toString() !== req.userData.userId) {
    return next(
      new HttpError("You are not allowed to update this product", 401)
    );
  }

  updatedBook.title = title;
  updatedBook.description = description;
  updatedBook.image = image;
  updatedBook.price = price;

  try {
    await updatedBook.save();
  } catch (err) {
    return next(
      new HttpError("Something went wrong, could not update the book", 500)
    );
  }

  res
    .status(200)
    .json({ updatedBook: updatedBook.toObject({ getters: true }) });
};

const deleteBook = async (req, res, next) => {
  const bookId = req.params.bid;
  let book;

  try {
    book = await Product.findById(bookId).populate("creator");
    // throw error;
  } catch (err) {
    return next(
      new HttpError("Fetching book failed, please try again later", 500)
    );
  }

  if (book.creator.id !== req.userData.userId) {
    return next(
      new HttpError("You are not allowed to delete this product", 401)
    );
  }

  if (!book) {
    return next(new HttpError("Could not find book for provide id", 404));
  }

  // const imagePath = book.image;

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await book.remove({ session: sess });
    book.creator.books.pull(book);
    await book.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    return next(
      new HttpError("Fetching book failed, please try again later", 500)
    );
  }

  // fs.unlink(imagePath, (err) => {
  //   console.log(err);
  // });

  res.status(200).json({ message: "Deleted place." });
};

exports.getBookById = getBookById;
exports.getBooks = getBooks;
exports.createBook = createBook;
exports.updateBook = updateBook;
exports.deleteBook = deleteBook;
exports.getBooksByIds = getBooksByIds;
// exports.getBooksByUserId = getBooksByUserId;
