import React, { useEffect, createRef } from "react";
import FlipMove from "react-flip-move";

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
    }, 1250);
    return () => {
      console.log("clear");
      clearTimeout(timer);
    };
  }, [popUpList]);

  return (
    // <TransitionGroup component="ul" className="notifications-list">
    <FlipMove
      enterAnimation={{
        from: {
          transform: "translateY(5rem)",
          opacity: 0.1,
        },
        to: {
          transform: "translateY(0rem)",
        },
      }}
      leaveAnimation={{
        from: {
          transform: "translateY(-2.8rem)",
        },
        to: {
          transform: "translateY(-2.8rem) translateX(5rem)",

          opacity: 0,
        },
      }}
      typeName="ul"
      className="notifications-list"
      // enterAnimation="fade"
      // leaveAnimation="fade"
      duration="250"
    >
      {popUpList.map((item) => {
        return (
          // <CSSTransition
          //   classNames="notification"
          //   key={item.ukey}
          //   mountOnEnter
          //   unmountOnExit
          //   timeout={{
          //     enter: 500,
          //     exit: 1000,
          //   }}
          // >
          <NotificationItem
            ref={() => createRef()}
            key={item.ukey}
            content={item.content}
            popUpStyle={item.popUpStyle}
          />
          // </CSSTransition>
        );
      })}
    </FlipMove>
    // </TransitionGroup>
  );
};

export default NotificationsList;
