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
        {showSearchBar && <SearchBar />}
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
            {/* <svg
              className="cart-button--icon"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l.84 4.479 9.144-.459L13.89 4H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
            </svg> */}
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
          <span class="material-icons-outlined logout">logout</span>
        </NavLink>
      )}
    </ul>
  );
};

export default NavLinks;
