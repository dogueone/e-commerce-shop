import React from "react";

import { CSSTransition } from "react-transition-group";
import "./PopUp.css";

const PopUp = (props) => {
  return (
    <CSSTransition
      in={props.show}
      mountOnEnter
      unmountOnExit
      timeout={{
        enter: 500,
        exit: 1000,
      }}
      classNames="pop-up"
    >
      <div
        className={`pop-up ${props.positive && "positive"} ${
          props.negative && "negative"
        }`}
      >
        {props.children}
      </div>
    </CSSTransition>
  );
};

export default PopUp;
