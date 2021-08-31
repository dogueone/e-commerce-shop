import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import Backdrop from "../UIElements/Backdrop";
import SideDrawer from "./SideDrawer";
import MainHeader from "./MainHeader";
import NavLinks from "./NavLinks";
import "./MainNavigation.css";
import NavCart from "./NavCart";

// function debounce(fn, ms) {
//   let timer;
//   return () => {
//     clearTimeout(timer);
//     timer = setTimeout(() => {
//       timer = null;
//       fn.apply(this, arguments);
//     }, ms);
//   };
// }

const MainNavigation = (props) => {
  const [drawerIsOpen, setDrawerIsOpen] = useState(true);

  // const [showMobile, setShowMobile] = useState(false);

  // useEffect(() => {
  //   const debouncedHandleResize = debounce(function handleResize() {
  //     if (window.innerWidth <= 768) {
  //       console.log(window.innerWidth);
  //       console.log(window.innerHeight);
  //       setShowMobile(true);
  //     } else {
  //       setShowMobile(false);
  //     }
  //   }, 1000);

  //   window.addEventListener("resize", debouncedHandleResize);
  //   console.log("resize event created");

  //   return () => {
  //     window.removeEventListener("resize", debouncedHandleResize);
  //     console.log("resize event removed");
  //   };
  // });

  const DrawerHandler = () => {
    setDrawerIsOpen((prevState) => !prevState);
  };

  const openDrawerHandler = () => {
    setDrawerIsOpen(true);
  };

  const closeDrawerHandler = () => {
    setDrawerIsOpen(false);
  };

  return (
    <React.Fragment>
      {/* <Backdrop show={drawerIsOpen} onClick={closeDrawerHandler} /> */}
      <SideDrawer show={drawerIsOpen}>
        <nav className="main-navigation__drawer-nav">
          <NavLinks mobileView={drawerIsOpen} onClick={closeDrawerHandler} />
        </nav>
      </SideDrawer>
      <MainHeader>
        <div className="main-navigation">
          <button className="main-navigation__menu-btn" onClick={DrawerHandler}>
            <span />
            <span />
            <span />
          </button>
          <h1 className="main-navigation__title">
            <Link to="/">Shop</Link>
          </h1>
          <div className="main-navigation__cart">
            <NavCart />
          </div>

          <nav className="main-navigation__header-nav">
            <NavLinks />
          </nav>
        </div>
      </MainHeader>
    </React.Fragment>
  );
};

export default MainNavigation;
