import React, {
  useEffect,
  useState,
  useContext,
  useReducer,
  useRef,
  createRef,
} from "react";

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
import BackElement from "../components/UIElements/BackElement";
import Button from "../components/FormElements/Button";

// const reducer = (popUpList, action) => {
//   switch (action.type) {
//     case "ADDTOCART":
//       console.log("ADDTOCART");
//       if (popUpList.length >= 4) {
//         let listToMutate = [
//           {
//             content: action.payload.content,
//             ukey: action.payload.ukey,
//             popUpStyle: "add-to-cart",
//           },
//           ...popUpList.map((obj) => ({ ...obj })),
//         ];
//         listToMutate.pop();
//         return listToMutate;
//       } else {
//         return [
//           {
//             content: action.payload.content,
//             ukey: action.payload.ukey,
//             popUpStyle: "add-to-cart",
//           },
//           ...popUpList.map((obj) => ({ ...obj })),
//         ];
//       }

//     case "DELETEITEM":
//       console.log("DELETEITEM");
//       return [
//         ...popUpList.map((obj) => ({ ...obj })),
//         {
//           content: action.payload.content,
//           ukey: action.payload.ukey,
//           popUpStyle: "delete-item",
//         },
//       ];
//     case "MAXIMUMITEMS":
//       if (popUpList.length >= 4) {
//         let listToMutate = [
//           {
//             content: action.payload.content,
//             ukey: action.payload.ukey,
//             popUpStyle: "delete-item",
//           },
//           ...popUpList.map((obj) => ({ ...obj })),
//         ];
//         listToMutate.pop();
//         return listToMutate;
//       } else {
//         return [
//           {
//             ukey: action.payload.ukey,
//             content: action.payload.content,
//             popUpStyle: "delete-item",
//           },
//           ...popUpList.map((obj) => ({ ...obj })),
//         ];
//       }

//     case "ITEMTIMEOUT":
//       console.log("ITEMTIMEOUT");
//       let NewData = [...popUpList.map((obj) => ({ ...obj }))];
//       NewData.shift();
//       console.log(NewData);

//       return NewData;
//   }
// };

const Products = (props) => {
  const { error, clearError, sendRequest, isLoading } = useHttpClient();
  const [loadedBooks, setLoadedBooks] = useState();
  // const [popUpList, dispatch] = useReducer(reducer, []);
  const [expandedItem, setExpandedItem] = useState();
  const [showExpandedItem, setShowExpandedItem] = useState(false);
  const misc = useContext(MiscContext);

  const expandedItemRef = useRef();

  const expandHandler = (id) => {
    const expandData = loadedBooks.find((item) => item.id === id);
    expandedItemRef.current.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
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
          `${process.env.REACT_APP_BACKEND_URL}/books`
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
  //   if (showExpandedItem === true) {
  //     console.log(expandedItemRef.current);
  //     expandedItemRef.current.scrollIntoView(true);
  //   }
  // }, [showExpandedItem]);

  let content;

  if (isLoading) {
    return <LoadingSpinner asOverlay />;
  }

  if (!isLoading && loadedBooks) {
    content = (
      <>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.4rem",
          }}
        >
          <div className="content-header">
            <div className="showing-title">
              {`Showing ${loadedBooks.length} products`}
            </div>
            <Sort ref={expandedItemRef} sortProducts={sortProducts}></Sort>
          </div>
          <div className={"expanded-layout"}>
            <div
              className={`shrink-order ${
                showExpandedItem && "responsive-shrink"
              }`}
            >
              <BooksList
                expandHandler={expandHandler}
                items={loadedBooks}
                onDeleteBook={onDeleteBookHandler}
              />
            </div>
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
      {/* {!isLoading && !loadedBooks && (
        <BackElement>
          <div>
            <Button to="/books/add-product">Add product</Button>
          </div>
        </BackElement>
      )} */}
      {content}
      <NotificationsList />
    </React.Fragment>
  );
};

export default Products;
