import React, { useState } from "react";
import { useParams } from "react-router-dom";

import Modal from "../components/UIElements/Modal";
import BookContent from "../components/BookContent";
import BookPages from "../components/BookPages";
import "./ProductPage.css";

const BOOKS = [
  {
    id: "1",
    title: "Book1",
    image: "hfdafda",
    description:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eos consequatur minima recusandae nemo quo corporis, molestiae nobis ut obcaecati ea saepe, hic praesentium cupiditate excepturi quibusdam sed! Totam, nihil velit.",
    price: "1.99",
  },
  {
    id: "2",
    title: "Book2",
    image: "fsafafaf",
    description:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eos consequatur minima recusandae nemo quo corporis, molestiae nobis ut obcaecati ea saepe, hic praesentium cupiditate excepturi quibusdam sed! Totam, nihil velit.",
    price: "2.99",
  },
  {
    id: "3",
    title: "Book3",
    image: "adfsafsdafas",
    description:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eos consequatur minima recusandae nemo quo corporis, molestiae nobis ut obcaecati ea saepe, hic praesentium cupiditate excepturi quibusdam sed! Totam, nihil velit.",
    price: "3.99",
  },
];

const ProductPage = () => {
  const bookId = useParams().bid;
  const loadedBook = BOOKS.find((book) => book.id === bookId);

  const [showModal, setShowModal] = useState(false);

  const openModalHandler = () => setShowModal(true);
  const closeModalHandler = () => setShowModal(false);

  return (
    <React.Fragment>
      {showModal && <Modal hideModal={closeModalHandler} />}
      <div className="product-page">
        <BookContent content={loadedBook} showModal={openModalHandler} />
        <BookPages content={loadedBook} />
      </div>
    </React.Fragment>
  );
};

export default ProductPage;

// BOOKS.filter((book) => book.id === bookId);
