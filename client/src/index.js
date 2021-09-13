import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import "./index.css";
import { Provider } from "react-redux";
import { createStore, combineReducers, applyMiddleware } from "redux";
import notificationsR from "./store/reducers/notificationsR";
import authR from "./store/reducers/authR";

const rootReducer = combineReducers({
  auth: authR,
  notifications: notificationsR,
});

const store = createStore(
  rootReducer,
  applyMiddleware(logger),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

//middleware
const logger = (store) => {
  return (next) => {
    return (action) => {
      console.log("[Middleware] dispatching", action);
      const result = next(action);
      console.lgo("[Middleware] next state", store.getState());
      return result;
    };
  };
};

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
