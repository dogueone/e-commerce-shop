import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";

import { MiscContext } from "../context/misc-context";
import Button from "../components/FormElements/Button";
import BookImage from "../components/UIElements/BookImage";
import Card from "../components/UIElements/Card";
import ErrorModal from "../components/UIElements/ErrorModal";
import LoadingSpinner from "../components/UIElements/LoadingSpinner";
import { useHttpClient } from "../hooks/http-hook";
import Modal from "../components/UIElements/Modal";
import BookContent from "../components/BookContent";
import BookPages from "../components/BookPages";
import "./ProductComponent.css";

// const BOOKS = [
//   {
//     id: "1",
//     title: "Book1",
//     image: "hfdafda",
//     description:
//       "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eos consequatur minima recusandae nemo quo corporis, molestiae nobis ut obcaecati ea saepe, hic praesentium cupiditate excepturi quibusdam sed! Totam, nihil velit.",
//     price: "1.99",
//   },
//   {
//     id: "2",
//     title: "Book2",
//     image: "fsafafaf",
//     description:
//       "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eos consequatur minima recusandae nemo quo corporis, molestiae nobis ut obcaecati ea saepe, hic praesentium cupiditate excepturi quibusdam sed! Totam, nihil velit.",
//     price: "2.99",
//   },
//   {
//     id: "3",
//     title: "Book3",
//     image: "adfsafsdafas",
//     description:
//       "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eos consequatur minima recusandae nemo quo corporis, molestiae nobis ut obcaecati ea saepe, hic praesentium cupiditate excepturi quibusdam sed! Totam, nihil velit.",
//     price: "3.99",
//   },
// ];

const ProductComponent = (props) => {
  // const [loadedProduct, setLoadedProduct] = useState();
  // const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [amount, setAmount] = useState(1);
  const misc = useContext(MiscContext);

  // const loadedBook = BOOKS.find((book) => book.id === bookId);

  // const [showModal, setShowModal] = useState(false);

  // const openModalHandler = () => setShowModal(true);
  // const closeModalHandler = () => setShowModal(false);

  const onSelectHandler = (event) => {
    setAmount(parseInt(event.target.value, 10));
    console.log(event.target.value);
  };

  const onHideHandler = () => {
    props.hideHandler();
  };

  // if (isLoading) {
  //   return (
  //     <div className="center">
  //       <LoadingSpinner />
  //     </div>
  //   );
  // }

  // if (!isLoading && !loadedProduct && !error) {
  //   return (
  //     <div className="center">
  //       <Card>
  //         <h2>Could not find product for provided id!</h2>
  //       </Card>
  //     </div>
  //   );
  // }

  return (
    <div>
      {/* <ErrorModal error={error} onClear={clearError} /> */}
      {/* {showModal && <Modal hideModal={closeModalHandler} />} */}
      {/* {!isLoading && !loadedProduct && !error && (
        <div className="center">
          <Card>
            <h2>Could not find product for provided id!</h2>
          </Card>
        </div>
      )} */}
      <Card className="expanded-item">
        <div className="product-component">
          <div className="product-component__image">
            <BookImage
              imageStyle="product-image"
              img={`http://localhost:5000/${props.data.image}`}
              alt={props.data.title}
            />
          </div>
          <div className="product-component__content">
            <div className="product-component__content--price">
              {`$${props.data.price}`}
            </div>
            <div>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius
              tempore, modi laudantium deleniti saepe mollitia architecto
              impedit beatae incidunt a sint officia quaerat unde obcaecati, cum
              distinctio odio? Deserunt, aliquid?
            </div>
            <div className="product-component__content--cart">
              <select onChange={onSelectHandler}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
              <Button
                onClick={() => {
                  console.log(amount);
                  misc.addToCart(props.data.id, amount);
                }}
              >
                Add Product
              </Button>
            </div>
          </div>
          <span
            onClick={onHideHandler}
            className="material-icons-outlined expanded-item--hide-badge"
          >
            arrow_right
          </span>
        </div>
      </Card>
    </div>
  );

  // <React.Fragment>
  // {
  //   showModal && <Modal hideModal={closeModalHandler} />;
  // }
  //   <div className="product-page">
  //     <BookContent content={loadedProduct} showModal={openModalHandler} />
  //     <BookPages content={loadedProduct} />
  //   </div>
  // </React.Fragment>
};

export default ProductComponent;

// BOOKS.filter((book) => book.id === bookId);
