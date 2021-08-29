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
import "./ProductPage.css";

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

const ProductPage = () => {
  const [loadedProduct, setLoadedProduct] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const productId = useParams().bid;
  const [amount, setAmount] = useState(1);
  const misc = useContext(MiscContext);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const data = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/books/${productId}`
        );
        setLoadedProduct(data.book);
        console.log(data);
      } catch (err) {}
    };
    fetchProductData();
  }, [sendRequest]);

  // const loadedBook = BOOKS.find((book) => book.id === bookId);

  // const [showModal, setShowModal] = useState(false);

  // const openModalHandler = () => setShowModal(true);
  // const closeModalHandler = () => setShowModal(false);

  const onSelectHandler = (event) => {
    setAmount(parseInt(event.target.value, 10));
    console.log(event.target.value);
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

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
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {/* {showModal && <Modal hideModal={closeModalHandler} />} */}
      {/* {!isLoading && !loadedProduct && !error && (
        <div className="center">
          <Card>
            <h2>Could not find product for provided id!</h2>
          </Card>
        </div>
      )} */}
      {!isLoading && loadedProduct && (
        <>
          <div
            style={{
              color: "white",
              fontSize: "1.5rem",
              fontWeight: "450",
              whiteSpace: "nowrap",
              marginLeft: "3rem",
            }}
          >
            {loadedProduct.title}
          </div>
          <Card>
            <div className="product-page">
              <div className="product-page__image">
                <BookImage
                  imageStyle="product-image"
                  img={`${process.env.REACT_APP_ASSET_URL}/${loadedProduct.image}`}
                  alt={loadedProduct.title}
                />
              </div>
              <div className="product-page__content">
                <div className="product-page__content--price">
                  {`$${loadedProduct.price}`}
                </div>
                <div>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius
                  tempore, modi laudantium deleniti saepe mollitia architecto
                  impedit beatae incidunt a sint officia quaerat unde obcaecati,
                  cum distinctio odio? Deserunt, aliquid?
                </div>
                <div className="product-page__content--cart">
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
                      misc.addToCart(loadedProduct.id, amount);
                    }}
                  >
                    Add Product
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </>
      )}
    </React.Fragment>
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

export default ProductPage;

// BOOKS.filter((book) => book.id === bookId);
