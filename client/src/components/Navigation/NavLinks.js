import React, { useContext } from "react";
import { NavLink } from "react-router-dom";

import { AuthContext } from "../../context/auth-context";
import { MiscContext } from "../../context/misc-context";
import "./NavLinks.css";

const NavLinks = (props) => {
  const auth = useContext(AuthContext);
  const misc = useContext(MiscContext);
  return (
    <ul className="nav-links">
      <li>
        <NavLink to="/cart" exact onClick={props.onClick}>
          {`Shopping Cart ${misc.cartItems ? misc.cartItems : ""}`}
        </NavLink>
      </li>
      <li>
        <NavLink to="/books/add-product" onClick={props.onClick}>
          Add Product
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
        <li>
          <button onClick={auth.logout}>LOGOUT</button>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
