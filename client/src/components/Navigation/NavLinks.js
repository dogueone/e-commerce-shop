import React, { useContext, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

// import SearchBar from "../UIElements/SearchBar";
import NavCart from "./NavCart";
import "./NavLinks.css";

const NavLinks = (props) => {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [showSearchBar, setShowSearchBar] = useState(false);

  return (
    <ul className="nav-links">
      {/* <li className="nav-links__search">
        <span
          className="material-icons-outlined search-icon"
          onClick={() => setShowSearchBar((prevState) => !prevState)}
        >
          search
        </span>
        <SearchBar show={showSearchBar} setShow={setShowSearchBar} />
      </li> */}

      <React.Fragment>
        <li>
          <NavLink to="/" exact>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/books/add-product">Add Product</NavLink>
        </li>
        {/* <li>
            <NavLink to="/" onClick={props.onClick}>
              Orders
            </NavLink>
          </li> */}
      </React.Fragment>
      <li className="cart-button__hide">
        <NavCart />
      </li>
      {!auth.isLoggedIn && (
        <li>
          <NavLink to="/auth" exact>
            Log In
          </NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <Link
            to="/"
            onClick={() => {
              dispatch({ type: "LOGOUT" });
            }}
          >
            <span className="material-icons-outlined">logout</span>
          </Link>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
