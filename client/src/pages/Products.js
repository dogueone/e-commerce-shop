import React, { useEffect, useState, useContext, useReducer } from "react";

import { CSSTransition } from "react-transition-group";
import ProductComponent from "./ProductComponent";
import NotificationsList from "../components/UIElements/NotificationsList";
import Sort from "../components/Sort";
import Card from "../components/UIElements/Card";
import LoadingSpinner from "../components/UIElements/LoadingSpinner";
import ErrorModal from "../components/UIElements/ErrorModal";
import { useHttpClient } from "../hooks/http-hook";
import BooksList from "../components/BooksList";
import { MiscContext } from "../context/misc-context";
import "./Products.css";

const reducer = (popUpList, action) => {
  switch (action.type) {
    case "ADDTOCART":
      console.log("ADDTOCART");
      if (popUpList.length >= 4) {
        let listToMutate = [
          {
            content: action.payload.content,
            ukey: action.payload.ukey,
            popUpStyle: "add-to-cart",
          },
          ...popUpList.map((obj) => ({ ...obj })),
        ];
        listToMutate.pop();
        return listToMutate;
      } else {
        return [
          {
            content: action.payload.content,
            ukey: action.payload.ukey,
            popUpStyle: "add-to-cart",
          },
          ...popUpList.map((obj) => ({ ...obj })),
        ];
      }

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
      if (popUpList.length >= 4) {
        let listToMutate = [
          {
            content: action.payload.content,
            ukey: action.payload.ukey,
            popUpStyle: "delete-item",
          },
          ...popUpList.map((obj) => ({ ...obj })),
        ];
        listToMutate.pop();
        return listToMutate;
      } else {
        return [
          {
            ukey: action.payload.ukey,
            content: action.payload.content,
            popUpStyle: "delete-item",
          },
          ...popUpList.map((obj) => ({ ...obj })),
        ];
      }

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
  const [expandedItem, setExpandedItem] = useState();
  const [showExpandedItem, setShowExpandedItem] = useState(false);
  const misc = useContext(MiscContext);

  const expandHandler = (id) => {
    const expandData = loadedBooks.find((item) => item.id === id);
    setExpandedItem(expandData);
    setShowExpandedItem(true);
  };

  const hideHandler = () => {
    setShowExpandedItem(false);
  };

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
        <div
          style={{
            gridArea: "header",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            // margin: "0rem 1rem",
          }}
        >
          <div
            style={{
              fontSize: "1.3rem",
              fontWeight: "450",
              whiteSpace: "nowrap",
              display: "flex",
              marginLeft: "3rem",
              marginBottom: "1rem",
            }}
          >
            Showing 10 products
          </div>
          <Sort sortProducts={sortProducts}></Sort>
        </div>
        <div className={"expanded-layout"}>
          {/* <div
            style={{
              fontSize: "1.3rem",
              gridArea: "showing",
              fontWeight: "450",
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              marginLeft: "3rem",
              marginBottom: "1rem",
            }}
          >
            Showing 10 products
          </div> */}

          <BooksList
            dispatch={dispatch}
            expandHandler={expandHandler}
            // setPopUpList={setPopUpList}
            popUpList={popUpList}
            // setShowPopUp={setShowPopUp}
            items={loadedBooks}
            onDeleteBook={onDeleteBookHandler}
            shrinkOnExpand={!!showExpandedItem}
          />

          <CSSTransition
            appear={true}
            classNames="expanded-item"
            timeout={500}
            in={showExpandedItem}
            unmountOnExit
          >
            <ProductComponent data={expandedItem} hideHandler={hideHandler} />
          </CSSTransition>
        </div>
      </>
    );
  }

  // if (!isLoading && !loadedBooks) {
  //   content = (
  //     <div className="center">
  //       <Card>
  //         <h2>Could not find any books!</h2>
  //       </Card>
  //     </div>
  //   );
  // }

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
