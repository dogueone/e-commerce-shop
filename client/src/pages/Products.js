import React, { useEffect, useState } from "react";

import Card from "../components/UIElements/Card";
import LoadingSpinner from "../components/UIElements/LoadingSpinner";
import ErrorModal from "../components/UIElements/ErrorModal";
import { useHttpClient } from "../hooks/http-hook";
import BooksList from "../components/BooksList";

const Products = () => {
  const { error, clearError, sendRequest, isLoading } = useHttpClient();
  const [loadedBooks, setLoadedBooks] = useState();
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

  const onDeleteBookHandler = (bookId) => {
    setLoadedBooks((prevState) =>
      prevState.filter((book) => book.id !== bookId)
    );
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />;
      </div>
    );
  }

  if (!loadedBooks && !error) {
    return (
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
      {!isLoading && loadedBooks && (
        <div>
          <BooksList items={loadedBooks} onDeleteBook={onDeleteBookHandler} />
        </div>
      )}
    </React.Fragment>
  );
};

export default Products;
