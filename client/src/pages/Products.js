import React, { useEffect, useState, useContext } from "react";

import PopUp from "../components/UIElements/PopUp";
import Card from "../components/UIElements/Card";
import LoadingSpinner from "../components/UIElements/LoadingSpinner";
import ErrorModal from "../components/UIElements/ErrorModal";
import { useHttpClient } from "../hooks/http-hook";
import BooksList from "../components/BooksList";

const Products = () => {
  const { error, clearError, sendRequest, isLoading } = useHttpClient();
  const [loadedBooks, setLoadedBooks] = useState();
  const [showPopUp, setShowPopUp] = useState(false);

  const onDeleteBookHandler = (bookId) =>
    setLoadedBooks((prevState) =>
      prevState.filter((book) => book.id !== bookId)
    );

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const responseData = await sendRequest(
          "http://localhost:5000/api/books"
        );
        setLoadedBooks(responseData.books);
      } catch (err) {}
    };
    fetchBooks();
  }, [sendRequest]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPopUp(false);
      console.log("pop-up");
    }, 500);
  }, [showPopUp]);

  let content;

  if (isLoading) {
    content = (
      <div className="center">
        <LoadingSpinner asOverlay />
      </div>
    );
  }

  if (!isLoading && loadedBooks) {
    content = (
      <BooksList
        setShowPopUp={setShowPopUp}
        items={loadedBooks}
        onDeleteBook={onDeleteBookHandler}
      />
    );
  }

  if (!isLoading && !loadedBooks) {
    content = (
      <div className="center">
        <Card>
          <h2>Could not find any books!</h2>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <PopUp show={showPopUp}>Item added to the cart</PopUp>
      {/* {isLoading && <LoadingSpinner asOverlay />} */}
      {content}
    </React.Fragment>
  );
};

export default Products;
