import React, { useState, useEffect, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";

import Button from "../components/FormElements/Button";
import { MiscContext } from "../context/misc-context";
import { useHttpClient } from "../hooks/http-hook";
import LoadingSpinner from "../components/UIElements/LoadingSpinner";
import Card from "../components/UIElements/Card";
import BooksList from "../components/BooksList";
import ErrorModal from "../components/UIElements/ErrorModal";
import "./ShopCartPage.css";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import BackElement from "../components/UIElements/BackElement";
import Dropdown from "../components/UIElements/Dropdown";

const ShopCartPage = (props) => {
  const { error, clearError, sendRequest, isLoading } = useHttpClient();
  const [loadedCart, setLoadedCart] = useState([]);
  const [validLocalData, setValidLocalData] = useState(null);
  const [showBackup, setShowBackup] = useState(false);

  const misc = useContext(MiscContext);
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const clearLoadedCart = () => {
    setLoadedCart([]);
    setShowBackup(true);
  };

  const updateLoadedCartItem = (
    itemId,
    itemQuantity,
    newValidLocalData,
    action,
    max = 10
  ) => {
    if (action === "remove") {
      const loadedCartClone = JSON.parse(JSON.stringify(loadedCart)); //to create deep clone
      const updatedLoadedCart = loadedCartClone.filter(
        (cartItem) => cartItem.content.id !== itemId
      );
      setLoadedCart(updatedLoadedCart);
      misc.setCartQuantity(
        updatedLoadedCart.reduce((sum, item) => {
          return sum + item.quantity;
        }, 0)
      );
      setValidLocalData(JSON.stringify(newValidLocalData));
    }

    if (action === "decrement") {
      const loadedCartClone = JSON.parse(JSON.stringify(loadedCart)); //to create deep clone
      if (itemQuantity === 1) {
        if (loadedCart.length === 1) {
          setLoadedCart([]);
          misc.clearCart();
        } else {
          const updatedLoadedCart = loadedCartClone.filter(
            (cartItem) => cartItem.content.id !== itemId
          );
          setLoadedCart(updatedLoadedCart);
          misc.setCartQuantity(
            updatedLoadedCart.reduce((sum, item) => {
              return sum + item.quantity;
            }, 0)
          );
          setValidLocalData(JSON.stringify(newValidLocalData));
        }
      } else {
        const selectedItem = loadedCartClone.find(
          (item) => item.content.id === itemId
        );
        selectedItem.quantity -= 1; //to mutate reference.quantity in loadedCartClone
        const updatedLoadedCart = loadedCartClone;
        setLoadedCart(updatedLoadedCart);
        misc.setCartQuantity(
          updatedLoadedCart.reduce((sum, item) => {
            return sum + item.quantity;
          }, 0)
        );
        setValidLocalData(JSON.stringify(newValidLocalData));
      }
    }
    if (action === "increment") {
      const loadedCartClone = JSON.parse(JSON.stringify(loadedCart)); //to create deep clone
      const selectedItem = loadedCartClone.find(
        (item) => item.content.id === itemId
      );
      if (selectedItem.quantity === max) {
        console.log("Maximum amount per transaction, can't add more");
        return;
      }
      selectedItem.quantity += 1;
      const updatedLoadedCart = loadedCartClone;
      setLoadedCart(updatedLoadedCart);
      misc.setCartQuantity(
        updatedLoadedCart.reduce((sum, item) => {
          return sum + item.quantity;
        }, 0)
      );
      setValidLocalData(JSON.stringify(newValidLocalData));
    }
  };

  //localstorage validation
  useEffect(() => {
    let Valid = true;
    const notParsedLocalData = localStorage.getItem("cart");

    //Optional
    //===============================//

    if (notParsedLocalData === null) {
      Valid = false;
      misc.clearCart("No cart");
      setShowBackup(true);
    }

    if (Valid && !notParsedLocalData) {
      Valid = false;
      misc.clearCart("Empty string");
      setShowBackup(true);
    }

    //===============================//

    let LocalData;
    if (Valid) {
      try {
        LocalData = JSON.parse(notParsedLocalData);
      } catch (error) {
        misc.clearCart(error.name);
        setShowBackup(true);
        Valid = false;
      }
    }

    //structure validation
    if (Valid) {
      if (!Array.isArray(LocalData) || LocalData.length === 0) {
        Valid = false;
        misc.clearCart("Cart is an empty array or not an array");
        setShowBackup(true);
      }
    }

    let UniqueProductsAmmount = 30; //hardcoded

    if (Valid) {
      if (LocalData.length > UniqueProductsAmmount) {
        Valid = false;
        misc.clearCart("Too much data");
        setShowBackup(true);
      }
    }

    if (Valid) {
      for (let i of LocalData) {
        if (Object.keys(i).length !== 2) {
          Valid = false;
          misc.clearCart("Wrong number of properties");
          setShowBackup(true);
          break;
        }
      }
    }

    //id validation
    let LocalDataIds;
    if (Valid) {
      LocalDataIds = LocalData.map((item) => item.id);
      for (let i of LocalDataIds) {
        console.log(typeof i === "string");
        if (!i || !(typeof i === "string") || i.trim().length !== 24) {
          Valid = false;
          misc.clearCart("Not a valid id");
          setShowBackup(true);
          break;
        }
      }
    }

    //quantity validation
    if (Valid) {
      const LocalDataQuantities = LocalData.map((item) => item.quantity);
      for (let i of LocalDataQuantities) {
        if (!i || isNaN(i) || !Number.isInteger(i) || i < 1 || i > 10) {
          Valid = false;
          misc.clearCart("Wrong item quantity, not a valid quantity");
          setShowBackup(true);
          break;
        }
      }
    }

    if (Valid) {
      let loadedBooks;
      const fetchBooks = async () => {
        try {
          loadedBooks = await sendRequest(
            `${process.env.REACT_APP_BACKEND_URL}/books/local/${LocalDataIds}`
          );

          if (loadedBooks) {
            const MutatedLocalData = [];
            LocalData.forEach((item) => {
              const itemQuantity = item.quantity;
              return MutatedLocalData.push(
                (item = {
                  content: loadedBooks.books.find(
                    (book) => book.id === item.id
                  ),
                  quantity: itemQuantity,
                })
              );
            });
            setLoadedCart(MutatedLocalData);
            misc.setCartQuantity(
              MutatedLocalData.reduce((sum, item) => {
                return sum + item.quantity;
              }, 0)
            );
            setValidLocalData(notParsedLocalData);
          }
        } catch (err) {
          setLoadedCart([]);
          setShowBackup(true);
          misc.clearCart(err.message);
        }
      };
      fetchBooks();
    }
  }, [sendRequest]);

  let content;

  // if (isLoading) {
  //   content = (
  //     <div className="center">
  //       <LoadingSpinner />
  //     </div>
  //   );
  // }

  // if (!loadedCart && !error) {
  //   content = (
  //     <div className="center">
  //       <Card>
  //         <h2>Shoping cart is empty!</h2>
  //       </Card>
  //     </div>
  //   );
  // }

  // if (!isLoading && loadedCart) {
  //   content = (

  //   );
  // }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}
      {showBackup && <BackElement>Shoping cart is empty</BackElement>}
      {/* <div className="background-layer"></div> */}
      <article className="shop-cart">
        <div style={{ width: "100%" }}>
          <CSSTransition
            key={1}
            appear={true}
            classNames="cart-item"
            timeout={500}
            in={loadedCart.length > 0}
            unmountOnExit
            mountOnEnter
          >
            <div
              style={{
                color: "white",
                fontSize: "1.3rem",
                fontWeight: "450",
                whiteSpace: "nowrap",
                display: "flex",
                marginLeft: "3rem",
                marginBottom: "2rem",
              }}
            >
              {`Showing ${loadedCart.length} products`}
            </div>
          </CSSTransition>
          <BooksList
            cart
            items={loadedCart}
            validLocalData={validLocalData}
            updateCart={updateLoadedCartItem}
            clearCartState={clearLoadedCart}
          />
        </div>
        <CSSTransition
          timeout={500}
          classNames="page-group1"
          in={loadedCart.length > 0}
          appear
          unmountOnExit
          mountOnEnter
        >
          <div style={{ margin: "0 1.6rem 0 1rem" }}>
            <Card className="shop-cart__order">
              <section className="shop-cart__order--total">
                <h4>Subtotal</h4>
                <span>
                  {"$" +
                    loadedCart
                      .reduce((sum, item) => {
                        return sum + item.content.price * item.quantity;
                      }, 0)
                      .toFixed(2)}
                </span>
              </section>
              <Dropdown />
              <section className="shop-cart__order--link">
                {auth.isLoggedIn ? (
                  <Button
                    to={{
                      pathname: "/checkout",
                      state: { cartItems: loadedCart },
                    }}
                  >
                    Order Now
                  </Button>
                ) : (
                  <Button
                    to={{
                      pathname: "/auth",
                      state: { prevLocation: props.location },
                    }}
                  >
                    Log In
                  </Button>
                )}
              </section>
            </Card>
            <div style={{ margin: "1rem" }}>
              <Button
                onClick={() => {
                  clearLoadedCart();
                  misc.clearCart();
                }}
                neutral
              >
                Clear cart
              </Button>
            </div>
          </div>
        </CSSTransition>

        {/* <CSSTransition
          in={loadedCart.length < 1 && !isLoading}
          timeout={500}
          classNames="page-group2"
        >
          
        </CSSTransition> */}
      </article>
    </React.Fragment>
  );
};

export default ShopCartPage;
