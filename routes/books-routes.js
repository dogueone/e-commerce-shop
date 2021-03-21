const express = require("express");

const booksControllers = require("../controllers/books-controllers");

const router = express.Router();

router.get("/", booksControllers.getBooks);

router.get("/:bid", booksControllers.getBookById);

router.post("/add-book", booksControllers.createBook);

router.patch("/:bid", booksControllers.updateBook);

router.delete("/:bid", booksControllers.deleteBook);

module.exports = router;
