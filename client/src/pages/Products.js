import React, { useEffect, useState, useContext, useReducer } from "react";

import NotificationsList from "../components/UIElements/NotificationsList";
import Sort from "../components/Sort";
import Card from "../components/UIElements/Card";
import LoadingSpinner from "../components/UIElements/LoadingSpinner";
import ErrorModal from "../components/UIElements/ErrorModal";
import { useHttpClient } from "../hooks/http-hook";
import BooksList from "../components/BooksList";
import { MiscContext } from "../context/misc-context";

const reducer = (popUpList, action) => {
  switch (action.type) {
    case "ADDTOCART":
      console.log("ADDTOCART");
      return [
        ...popUpList.map((obj) => ({ ...obj })),
        {
          content: action.payload.content,
          ukey: action.payload.ukey,
          popUpStyle: "add-to-cart",
        },
      ];
    case "DELETEITEM":
      console.log("DELETEITEM");
      return [
        ...popUpList.map((obj) => ({ ...obj })),
        {
          content: action.payload.content,
          ukey: action.payload.ukey,
          popUpStyle: "delete-item",
        },
      ];
    case "MAXIMUMITEMS":
      console.log("MAXIMUMITEMS");
      return [
        ...popUpList.map((obj) => ({ ...obj })),
        {
          ukey: action.payload.ukey,
          content: action.payload.content,
          popUpStyle: "delete-item",
        },
      ];
    case "ITEMTIMEOUT":
      console.log("ITEMTIMEOUT");
      let NewData = [...popUpList.map((obj) => ({ ...obj }))];
      NewData.shift();
      console.log(NewData);

      return NewData;
  }
};

const Products = () => {
  const { error, clearError, sendRequest, isLoading } = useHttpClient();
  const [loadedBooks, setLoadedBooks] = useState();
  // const [showPopUp, setShowPopUp] = useState(false);
  // const [popUpList, setPopUpList] = useState([]);
  const [popUpList, dispatch] = useReducer(reducer, []);
  const misc = useContext(MiscContext);

  const sortProducts = (type, data = loadedBooks) => {
    switch (type) {
      case "A-Z Order":
        return setLoadedBooks(
          data.sort((a, b) => {
            const titleA = a.title.toLowerCase(),
              titleB = b.title.toLowerCase();
            if (titleA < titleB)
              //sort string ascending
              return -1;
            if (titleA > titleB) return 1;
            return 0; //default return value (no sorting)
          })
        );
      case "Z-A Order":
        return setLoadedBooks(
          data.sort((a, b) => {
            const titleA = a.title.toLowerCase(),
              titleB = b.title.toLowerCase();
            if (titleA > titleB)
              //sort string ascending
              return -1;
            if (titleA < titleB) return 1;
            return 0; //default return value (no sorting)
          })
        );
      case "Low-Hight Price":
        return setLoadedBooks(data.sort((a, b) => a.price - b.price));
      case "High-Low Price":
        return setLoadedBooks(data.sort((a, b) => b.price - a.price));
    }
  };

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

        if (misc.sorting) {
          sortProducts(misc.sorting, responseData.books);
        } else {
          sortProducts("A-Z Order", responseData.books);
        }
      } catch (err) {}
    };
    fetchBooks();
  }, [sendRequest]);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setShowPopUp(false);
  //     console.log("pop-up");
  //   }, 500);
  // }, [showPopUp]);

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
      <>
        <Sort sortProducts={sortProducts}></Sort>
        <BooksList
          dispatch={dispatch}
          // setPopUpList={setPopUpList}
          popUpList={popUpList}
          // setShowPopUp={setShowPopUp}
          items={loadedBooks}
          onDeleteBook={onDeleteBookHandler}
        />
      </>
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
      {/* <PopUp show={showPopUp}>Item added to the cart</PopUp> */}
      {/* <button onClick={sortProducts}>Sort</button> */}
      {/* {isLoading && <LoadingSpinner asOverlay />} */}
      {content}
      <NotificationsList
        popUpList={popUpList}
        dispatch={dispatch}
      ></NotificationsList>
    </React.Fragment>
  );
};

export default Products;
