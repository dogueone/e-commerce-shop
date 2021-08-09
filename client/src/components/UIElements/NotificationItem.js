import React from "react";

import "./NotificationItem.css";

const NotificationItem = (props) => {
  return (
    <li className={`notification ${props.popUpStyle}`}>{props.content}</li>
  );
};

export default NotificationItem;
