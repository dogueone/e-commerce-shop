import React, { useContext } from "react";
import { Link } from "react-router-dom";

import { AuthContext } from "../context/auth-context";
import LoadingSpinner from "../components/UIElements/LoadingSpinner";
import ErrorModal from "../components/UIElements/ErrorModal";
import { useHttpClient } from "../hooks/http-hook";
import Button from "../components/FormElements/Button";
import BookImage from "./UIElements/BookImage";
import Card from "./UIElements/Card";
import "./BookItem.css";

const BookItem = (props) => {
  const { error, clearError, sendRequest, isLoading } = useHttpClient();

  const auth = useContext(AuthContext);

  const deleteBookHandler = async () => {
    try {
      await sendRequest(
        `http://localhost:5000/api/books/${props.id}`,
        "DELETE"
      );
      props.deleteBook(props.id);
    } catch (err) {}
  };

  console.log(props.image);
  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <li className="book-item">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <Card className="book-item__content">
            {/* <Link to={`/books/${props.id}`}> */}
            <div className="book-item__image">
              <BookImage
                img={`http://localhost:5000/${props.image}`}
                alt={props.title}
              />
            </div>
            <div className="book-item__info">
              <h2>{props.title}</h2>
            </div>
            <div className="book-item__info">
              <h2>{props.description}</h2>
            </div>
            <div>
              <h2>{props.price}</h2>
            </div>
            {/* </Link> */}
            <Link to={`/books/edit-product/${props.id}`}>
              <div className="editproduct-test">EDIT</div>
            </Link>
            {auth.isLoggedIn && (
              <Button size={"small"} inverse onClick={deleteBookHandler}>
                DELETE
              </Button>
            )}
          </Card>
        )}
      </li>
    </React.Fragment>
  );
};

export default BookItem;
