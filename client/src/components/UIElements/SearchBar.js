import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router";
// import { CSSTransition } from "react-transition-group";
import OutsideClickHandler from "react-outside-click-handler";

import "./SearchBar.css";

const SearchBar = (props) => {
  const [match, setMatch] = useState([]);
  const [cursor, setCursor] = useState();
  const [inputValue, setInputValue] = useState();
  const [optionToSearch, setOptionToSearch] = useState();
  const [noMatch, setNoMatch] = useState(false);

  const history = useHistory();

  const searchInput = useRef();

  useEffect(() => {
    if (cursor === undefined) {
      setOptionToSearch(undefined);
    }
    if (cursor >= 0) {
      setOptionToSearch(match[cursor]);
    }
  }, [cursor]);

  const checkExactMatch = () => {
    setCursor();
    setMatch([]);
    if (inputValue) {
      const result = props.items.find(
        (item) =>
          item.title.trim().toLowerCase() === inputValue.trim().toLowerCase()
      );
      if (result) {
        history.push(`books/${result.id}`);
      } else {
        setNoMatch(true);
      }
    }
  };

  const checkMatch = (e) => {
    setCursor();
    setNoMatch(false);
    setInputValue(e.target.value);
    if (!e.target.value) {
      setMatch([]);
      setInputValue();
      return;
    }
    const matchInput = e.target.value.trim().toLowerCase();

    let matchResult = [];
    for (let item of props.items) {
      //matching sentence
      let matchSentence = item.title
        .slice(0, matchInput.length)
        .trim()
        .toLowerCase();
      if (matchInput === matchSentence) {
        matchResult.push(item);
      } else {
        //matching every word
        const newData = item.title.trim().toLowerCase().split(" ");
        if (newData.length > 1) {
          for (let i of newData) {
            let matchWord = i.slice(0, matchInput.length);
            if (matchInput === matchWord) {
              matchResult.push(item);
              break;
            }
          }
        }
      }
    }
    setMatch(matchResult);
  };

  // const onSearchHandler = (event) => {
  //   setCursor();
  //   checkMatch(event.target.value);
  // };

  const onClickHandler = (e) => {
    if (e.target === searchInput.current) {
      setCursor();
    } else {
      history.push(`books/${e.target.id}`);
    }
  };

  const onSubmitButtonSearch = () => {
    checkExactMatch();
  };

  const onPressEnter = (e) => {
    //if cursor is on any option (when navigating with arrows)
    if (optionToSearch) {
      searchInput.current.value = optionToSearch.title;
      setMatch([]);
      history.push(`books/${optionToSearch.id}`);
    } else {
      // submit without navigating through options
      if (e.target === searchInput.current) {
        checkExactMatch();
      }
    }
  };

  const onOutsideClick = () => {
    setMatch([]);
    setCursor();
    setNoMatch(false);
    searchInput.current.blur();
  };

  const keyDownHandler = (e) => {
    if (e.key === "Enter" && !e.repeat) {
      onPressEnter(e);
    }

    if (e.key === "Escape" && !e.repeat) {
      onOutsideClick();
    }

    if (match.length > 0 && !e.repeat) {
      if (e.keyCode == "40" || e.keyCode == "38") {
        e.preventDefault();
      }
      if (e.keyCode == "40" && cursor === undefined) {
        setCursor(0);
      }

      if (e.keyCode == "40" && cursor === match.length - 1) {
        setCursor(0);
      }

      if (e.keyCode == "40" && cursor < match.length - 1) {
        setCursor((prevState) => {
          return prevState + 1;
        });
      }

      if (e.keyCode == "38" && cursor > 0) {
        setCursor((prevState) => prevState - 1);
      }

      if (e.keyCode == "38" && cursor === 0) {
        setCursor();
      }
    }
  };

  return (
    // <CSSTransition
    //   in={props.show}
    //   mountOnEnter
    //   unmountOnExit
    //   timeout={250}
    //   classNames="search-bar"
    // >
    <OutsideClickHandler onOutsideClick={onOutsideClick}>
      <div className="search-bar">
        <input
          className={`search-bar__input ${noMatch && "no-match "}`}
          type="text"
          // autoFocus
          onChange={checkMatch}
          onKeyDown={keyDownHandler}
          onClick={onClickHandler}
          ref={searchInput}
        />
        {match.length > 0 && (
          <ul className="search-bar__result">
            {match.map((item, i) => (
              <li
                className={cursor === i ? "active-field" : null}
                id={item.id}
                key={item.id}
                onClick={onClickHandler}
              >
                {item.title}
              </li>
            ))}
          </ul>
        )}
        <div className="search-bar__submit" onClick={onSubmitButtonSearch}>
          <span className="material-icons-outlined search-icon">search</span>
        </div>
      </div>
    </OutsideClickHandler>
    // </CSSTransition>
  );
};

export default SearchBar;
