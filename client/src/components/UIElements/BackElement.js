import React from "react";

import "./BackElement.css";

const BackElement = (props) => {
  return <div className="back-element">{props.children}</div>;
};

export default BackElement;
