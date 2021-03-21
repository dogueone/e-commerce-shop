const HttpError = require("../models/http-error");
const { v4: uuidv4 } = require("uuid");

let BOOKS = [
  {
    id: "1",
    title: "Book1",
    image:
      "https://images.pexels.com/photos/415071/pexels-photo-415071.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    description:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eos consequatur minima recusandae nemo quo corporis, molestiae nobis ut obcaecati ea saepe, hic praesentium cupiditate excepturi quibusdam sed! Totam, nihil velit.",
    price: "1.99",
  },
  {
    id: "2",
    title: "Book2",
    image:
      "https://images.pexels.com/photos/415071/pexels-photo-415071.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    description:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eos consequatur minima recusandae nemo quo corporis, molestiae nobis ut obcaecati ea saepe, hic praesentium cupiditate excepturi quibusdam sed! Totam, nihil velit.",
    price: "2.99",
  },
  {
    id: "3",
    title: "Book3",
    image:
      "https://images.pexels.com/photos/415071/pexels-photo-415071.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    description:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eos consequatur minima recusandae nemo quo corporis, molestiae nobis ut obcaecati ea saepe, hic praesentium cupiditate excepturi quibusdam sed! Totam, nihil velit.",
    price: "3.99",
  },
];

const getBooks = (req, res, next) => {
  if (BOOKS.length < 1) {
    throw new HttpError("Could not find any books", 404);
  }
  res.json(BOOKS);
};

const getBookById = (req, res, next) => {
  const bookId = req.params.bid;

  const book = BOOKS.find((book) => bookId === book.id);

  if (!book) {
    throw new HttpError("Could not find a book for the provided id", 404);

    // return next(
    //   new HttpError("Could not find a book for the provided id", 404)
    // );
  }
  res.json({ book }); // {book: book}
};

const createBook = (req, res, next) => {
  console.log(req.body);
  const { title, description, image, price } = req.body;
  const createdBook = {
    id: uuidv4(),
    title,
    image,
    description,
    price,
  };
  BOOKS.unshift(createdBook);
  res.status(201).json({ book: createdBook });
};

const updateBook = (req, res, next) => {
  const { title, description } = req.body;
  const bookId = req.params.bid;

  const updatedBook = { ...BOOKS.find((b) => b.id === bookId) };
  const updatedBookIndex = BOOKS.findIndex((b) => b.id === bookId);

  updatedBook.title = title;
  updatedBook.description = description;

  BOOKS[updatedBookIndex] = updatedBook;
  res.status(200).json({ book: updatedBook });
};

const deleteBook = (req, res, next) => {
  const bookId = req.params.bid;

  BOOKS = BOOKS.filter((b) => b.id !== bookId);
  res.status(200).json({ message: "Deleted place." });
};

exports.getBookById = getBookById;
exports.getBooks = getBooks;
exports.createBook = createBook;
exports.updateBook = updateBook;
exports.deleteBook = deleteBook;
