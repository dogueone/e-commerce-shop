import React from "react";

import "./LoadingSpinner.css";

const LoadingSpinner = (props) => {
  return (
    <div
      className={`${props.asOverlay && "loading-spinner__overlay"} ${
        props.inner && "loading-spinner__inner"
      } ${props.background && "loading-spinner__background"}`}
    >
      <div className="lds-dual-ring"></div>
    </div>
  );
};

export default LoadingSpinner;
