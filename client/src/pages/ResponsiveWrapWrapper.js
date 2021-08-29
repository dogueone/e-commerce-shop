import React from "react";
import "./ResponsiveWrapWrapper.css";

//hardcodded component, not really needed.

const ResponsiveWrapWrapper = (props) => {
  return (
    <div
      className={`shrink-order ${props.responsiveClass && "responsive-shrink"}`}
    >
      {props.children}
    </div>
  );
};

export default ResponsiveWrapWrapper;
