import React, { useState } from "react";
import { CSSTransition } from "react-transition-group";

import "./SearchBar.css";

const data = ["cool doggo", "weo", "weird cat"];

const SearchBar = (props) => {
  const [match, setMatch] = useState([]);

  const onSearchHandler = (event) => {
    checkMatch(event.target.value);
  };

  const onBlurHandler = () => {
    setMatch([]);
    props.setShow((prevState) => !prevState);
  };

  //create li with id and add it to ul

  // const createLi = ();

  const checkMatch = (userInput) => {
    for (let item of data) {
      if (!userInput) {
        setMatch([]);
        break;
      }
      let matchWord = item.slice(0, userInput.length);

      if (userInput === matchWord) {
        if (!match.includes(item)) {
          setMatch((prevState) => prevState.concat(item));
          console.log("adding " + item);
          continue;
        }
        continue;
      }
      if (match.includes(item)) {
        setMatch((prevState) =>
          prevState.filter((product) => product !== item)
        );
        console.log("deleting " + item);
        continue;
      } else {
        console.log("---- no match ---- ");
      }
    }
  };

  //   useEffect(() => {

  //   }, [input])

  //onBlur => change state to closed

  // onFocus={e => e.currentTarget.select()}

  // When the component is rendered, so the modal has been also rendered, and we try to change states of the component, the component
  // (and so the modal) will re-render, and in this stage the modal can not have access to the states.
  // The solution to resolve the warning is by using React refs. Refs helps to access DOM nodes or React elements created in the render method.

  return (
    <CSSTransition
      in={props.show}
      mountOnEnter
      unmountOnExit
      timeout={250}
      classNames="search-bar"
    >
      <div className="search-bar">
        <input
          className="search-bar__input"
          type="text"
          autoFocus
          onBlur={onBlurHandler}
          onChange={onSearchHandler}
        />
        {match.length > 0 && (
          <ul className="search-bar__result">
            {match.map((item) => (
              <li>{item}</li>
            ))}
          </ul>
        )}
      </div>
    </CSSTransition>
  );
};

export default SearchBar;
