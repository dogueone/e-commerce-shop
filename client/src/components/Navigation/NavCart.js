import React, { useContext } from "react";
import { NavLink } from "react-router-dom";

import { MiscContext } from "../../context/misc-context";

const NavCart = () => {
  const misc = useContext(MiscContext);

  return (
    <NavLink to="/cart" exact>
      {/* {props.mobileView ? (
            `Shoping Cart ${
              misc.cartItemsQuantity > 0 && misc.cartItemsQuantity
            }`
          ) : (
            <div className="cart-button">
              <span className="material-icons-outlined cart-button--icon">
                shopping_cart
              </span>
              {misc.cartItemsQuantity > 0 && (
                <span className="cart-button--badge">{`${misc.cartItemsQuantity}`}</span>
              )}
            </div>
          )} */}
      <div className="cart-button">
        <span className="material-icons-outlined cart-button--icon">
          shopping_cart
        </span>
        {misc.cartItemsQuantity > 0 && (
          <span className="cart-button--badge">{`${misc.cartItemsQuantity}`}</span>
        )}
      </div>
    </NavLink>
  );
};

export default NavCart;
