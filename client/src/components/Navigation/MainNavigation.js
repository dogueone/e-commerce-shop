import React from "react";
import { Link } from "react-router-dom";

import SideDrawer from "./SideDrawer";
import MainHeader from "./MainHeader";
import NavLinks from "./NavLinks";
import "./MainNavigation.css";

const MainNavigation = (props) => {
  return (
    <React.Fragment>
      <SideDrawer>
        <nav className="main-navigation__drawer-nav">
          <NavLinks />
        </nav>
      </SideDrawer>
      <MainHeader>
        <div className="main-navigation">
          <button className="main-navigation__menu-btn">
            <span />
            <span />
            <span />
          </button>
          <h1 className="main-navigation__title">
            <Link to="/" exact>
              Title
            </Link>
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
