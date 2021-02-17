import React from "react";
import { NavLink } from "react-router-dom";

import "./NavLinks.css";

const NavLinks = () => {
  return (
    <ul className="nav-links">
      <li>
        <NavLink to="/" exact>
          Busket
        </NavLink>
      </li>
      <li>
        <NavLink to="/books/add-product">Add Product</NavLink>
      </li>
      <li>
        <NavLink to="/auth">Log In</NavLink>
      </li>
    </ul>
  );
};

export default NavLinks;
