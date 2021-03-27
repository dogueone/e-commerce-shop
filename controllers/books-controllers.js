const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const Product = require("../models/product");

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

const createBook = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { title, description, image, price, creator } = req.body;

  const createdBook = new Product({
    title,
    image,
    description,
    price,
    creator,
  });

  try {
    await createdBook.save();
  } catch (err) {
    const error = new HttpError("Creating book failed, please try again.", 500);
    return next(error);
  }
  res.status(201).json({ createdBook: createdBook });
};

const updateBook = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { title, description, price } = req.body;
  const bookId = req.params.bid;

  let updatedBook;
  try {
    updatedBook = await Product.findById(bookId);
  } catch (err) {
    return next(
      new HttpError("Fetching book failed, please try again later", 500)
    );
  }

  updatedBook.title = title;
  updatedBook.description = description;
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
    book = await Product.findById(bookId);
  } catch (err) {
    return next(
      new HttpError("Fetching book failed, please try again later", 500)
    );
  }

  try {
    book = await book.remove();
  } catch (err) {
    return next(
      new HttpError("Fetching book failed, please try again later", 500)
    );
  }

  res.status(200).json({ message: "Deleted place." });
};

exports.getBookById = getBookById;
exports.getBooks = getBooks;
exports.createBook = createBook;
exports.updateBook = updateBook;
exports.deleteBook = deleteBook;
