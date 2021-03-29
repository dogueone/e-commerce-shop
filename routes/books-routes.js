const express = require("express");
const { body } = require("express-validator");

const booksControllers = require("../controllers/books-controllers");

const router = express.Router();

router.get("/", booksControllers.getBooks);

router.get("/:bid", booksControllers.getBookById);

router.get("/user/:uid", booksControllers.getBooksByUserId);

router.post(
  "/add-book",
  [
    body("title").not().isEmpty(),
    body("description").isLength({ min: 5 }),
    body("price").isFloat({ min: 0.1 }),
  ],
  booksControllers.createBook
);

router.patch(
  "/:bid",
  [
    body("title").not().isEmpty(),
    body("description").isLength({ min: 5 }),
    body("price").isFloat({ min: 0.1 }),
  ],
  booksControllers.updateBook
);

router.delete("/:bid", booksControllers.deleteBook);

module.exports = router;
