import React, { useState } from "react";
import { Link } from "react-router-dom";

import Backdrop from "../UIElements/Backdrop";
import SideDrawer from "./SideDrawer";
import MainHeader from "./MainHeader";
import NavLinks from "./NavLinks";
import "./MainNavigation.css";

const MainNavigation = (props) => {
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);

  const openDrawerHandler = () => {
    setDrawerIsOpen(true);
  };

  const closeDrawerHandler = () => {
    setDrawerIsOpen(false);
  };

  return (
    <React.Fragment>
      <Backdrop show={drawerIsOpen} onClick={closeDrawerHandler} />
      <SideDrawer show={drawerIsOpen}>
        <nav className="main-navigation__drawer-nav">
          <NavLinks onClick={closeDrawerHandler} />
        </nav>
      </SideDrawer>

      <MainHeader>
        <div className="main-navigation">
          <button
            className="main-navigation__menu-btn"
            onClick={openDrawerHandler}
          >
            <span />
            <span />
            <span />
          </button>
          <h1 className="main-navigation__title">
            <Link to="/">Title</Link>
          </h1>
          <nav className="main-navigation__header-nav">
            <NavLinks />
          </nav>
        </div>
      </MainHeader>
    </React.Fragment>
  );
};

export default MainNavigation;
