import React, { useState } from "react";
import { CSSTransition } from "react-transition-group";

import "./Dropdown.css";

const Dropdown = (props) => {
  const [expandInfo, setExpandInfo] = useState(false);

  const dropdownHandler = () => {
    setExpandInfo((prevState) => !prevState);
  };

  return (
    <div className={`dropdown ${expandInfo && "dropdown-height"}`}>
      <div className="dropdown-title" onClick={dropdownHandler}>
        <span>Shipping options</span>
        <div className="dropdown-expand">
          <span
            className={`material-icons-outlined ${expandInfo && "icon-rotate"}`}
          >
            expand_more
          </span>
        </div>
      </div>
      <CSSTransition
        in={expandInfo}
        classNames={"dropdown-content"}
        mountOnEnter
        unmountOnExit
        appear
        timeout={{ enter: 250, exit: 0 }}
      >
        <div className="dropdown-content">
          <div>
            <div>
              <div>Local courier shipping</div>
              <div className="dropdown-content--time">2- 4 days</div>
            </div>
            <div>$11.50</div>
          </div>
          <div>
            <div>
              <div>UPS ground shipping</div>
              <div className="dropdown-content--time">4 - 6 days</div>
            </div>
            <div>$17.80</div>
          </div>
          <div>
            <div>
              <div>Local pickup from store</div>
              <div className="dropdown-content--time">--</div>
            </div>
            <div>$0.00</div>
          </div>
        </div>
      </CSSTransition>
    </div>
  );
};

export default Dropdown;
