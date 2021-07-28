import React, { useContext, useState } from "react";
import { NavLink } from "react-router-dom";

import SearchBar from "../UIElements/SearchBar";
import { AuthContext } from "../../context/auth-context";
import { MiscContext } from "../../context/misc-context";
import "./NavLinks.css";

const NavLinks = (props) => {
  const auth = useContext(AuthContext);
  const misc = useContext(MiscContext);
  const [showSearchBar, setShowSearchBar] = useState(false);

  return (
    <ul className="nav-links">
      <li className="nav-links__search">
        <span
          className="material-icons-outlined search-icon"
          onClick={() => setShowSearchBar((prevState) => !prevState)}
        >
          search
        </span>
        <SearchBar show={showSearchBar} setShow={setShowSearchBar} />
      </li>

      {auth.isLoggedIn && (
        <React.Fragment>
          <li>
            <NavLink to="/books/add-product" onClick={props.onClick}>
              Add Product
            </NavLink>
          </li>
          <li>
            <NavLink to="/" onClick={props.onClick}>
              Orders
            </NavLink>
          </li>
        </React.Fragment>
      )}
      <li>
        <NavLink to="/cart" exact onClick={props.onClick}>
          <div className="cart-button">
            <span className="material-icons-outlined cart-button--icon">
              shopping_cart
            </span>
            {misc.cartItemsQuantity > 0 && (
              <span className="cart-button--badge">{`${misc.cartItemsQuantity}`}</span>
            )}
          </div>
        </NavLink>
      </li>
      {!auth.isLoggedIn && (
        <li>
          <NavLink to="/auth" onClick={props.onClick}>
            Log In
          </NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <NavLink to="/" onClick={auth.logout}>
          <span className="material-icons-outlined logout">logout</span>
        </NavLink>
      )}
    </ul>
  );
};

export default NavLinks;
