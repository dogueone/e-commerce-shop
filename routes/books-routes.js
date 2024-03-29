const express = require("express");
const { body } = require("express-validator");

const checkAuth = require("../middleware/check-auth");
const fileUpload = require("../services/awsUpload");
const booksControllers = require("../controllers/books-controllers");
const router = express.Router();

let imageMiddleware = (req, res, next) => {
  next();
};

router.get("/", booksControllers.getBooks);

router.get("/:bid", booksControllers.getBookById);

router.get("/local/:bids", booksControllers.getBooksByIds);

// router.get("/cart/:uid", booksControllers.getСartById);

// router.post("/cart/:uid", booksControllers.createCart);

router.use(checkAuth);

// router.get("/user/:uid", booksControllers.getBooksByUserId);

router.post(
  "/add-book-placeholder",
  [
    body("image").not().isEmpty(),
    body("title").not().isEmpty().isLength({ max: 14 }),
    body("description").isLength({ min: 5, max: 30 }),
    body("price").isFloat({ min: 0.1, max: 999.99 }),
  ],
  booksControllers.createBook
);

router.post(
  "/add-book",
  fileUpload.single("image"),
  [
    body("title").not().isEmpty().isLength({ max: 14 }),
    body("description").isLength({ min: 5, max: 30 }),
    body("price").isFloat({ min: 0.1, max: 999.99 }),
  ],
  booksControllers.createBook
);

router.patch(
  "/:bid",
  [
    body("title").not().isEmpty().isLength({ max: 14 }),
    body("description").isLength({ min: 5, max: 30 }),
    body("price").isFloat({ min: 0.1, max: 999.99 }),
  ],
  booksControllers.updateBook
);

router.delete("/:bid", booksControllers.deleteBook);

module.exports = router;
