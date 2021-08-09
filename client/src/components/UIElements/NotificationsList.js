import React, { useEffect } from "react";

import { CSSTransition, TransitionGroup } from "react-transition-group";
import NotificationItem from "./NotificationItem";
import "./NotificationsList.css";

const NotificationsList = ({ popUpList, dispatch }) => {
  const list = [...popUpList];

  useEffect(() => {
    const timer = setTimeout(() => {
      if (list.length) {
        console.log(list.length);
        dispatch({ type: "ITEMTIMEOUT" });
      }
    }, 1000);
    return () => {
      console.log("clear");
      clearTimeout(timer);
    };
  }, [popUpList]);

  return (
    <TransitionGroup component="ul" className="notifications-list">
      {popUpList.map((item) => {
        return (
          <CSSTransition
            classNames="notification"
            key={item.ukey}
            mountOnEnter
            unmountOnExit
            timeout={{
              enter: 500,
              exit: 1000,
            }}
          >
            <NotificationItem
              content={item.content}
              popUpStyle={item.popUpStyle}
            />
          </CSSTransition>
        );
      })}
    </TransitionGroup>
  );
};

export default NotificationsList;
