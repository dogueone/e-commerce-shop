import React, { useState, useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { useHttpClient } from "../hooks/http-hook";
import LoadingSpinner from "../components/UIElements/LoadingSpinner";
import ErrorModal from "../components/UIElements/ErrorModal";
import { AuthContext } from "../context/auth-context";
import Card from "../components/UIElements/Card";
import { useForm } from "../hooks/form-hook";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
} from "../util/validators";
import Input from "../components/FormElements/Input";
import Button from "../components/FormElements/Button";
import "./AuthPage.css";
import { Redirect } from "react-router-dom";

const AuthPage = (props) => {
  const auth = useContext(AuthContext);
  const [isLoginMode, setLoginMode] = useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const location = useLocation();

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const authSubmitHandler = async (event) => {
    event.preventDefault();
    if (isLoginMode) {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users/login`,
          "POST",
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        auth.login(responseData.userId, responseData.token);
      } catch (err) {}
    } else {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users/signup`,
          "POST",
          JSON.stringify({
            name: formState.inputs.name.value,
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        auth.login(responseData.userId, responseData.token);
      } catch (err) {}
    }
  };

  //If you have multiple state changes in 1 synchronous code block (in the same function) React will batch them together and perform single state update.
  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: "",
            isValid: false,
          },
        },
        false
      );
    }
    setLoginMode((prevMode) => !prevMode);
  };

  // useEffect(() => {
  //   if (location.state && auth.isLoggedIn) {
  //     props.history.push(location.state.prevLocation);
  //     console.log("location");
  //   } else if (auth.isLoggedIn) {
  //     props.history.push("/");
  //   }
  //   // if (auth.isLoggedIn) {
  //   //   props.history.goBack();
  //   // }
  // }, [auth.isLoggedIn]);

  // if (auth.isLoggedIn) {
  //   console.log(props.history);
  //   console.log(location);
  //   props.history.goBack();
  //   props.history.push("/cart");
  //   return <Redirect to={location.state.location} />;
  //   return <div>hello</div>;
  // } else {
  // }
  // if (location.state && auth.isLoggedIn) {
  //   return <Redirect to={location.state.prevlocation} />;
  // } else {
  // }

  if (location.state && auth.isLoggedIn) {
    return <Redirect to={location.state.prevLocation} />;
  }

  if (auth.isLoggedIn) {
    //implement redirecting to previous location
    return <Redirect to="/" />;
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}
      <Card className="authentication">
        <h2
          style={{
            fontWeight: "500",
            paddingBottom: "1rem",
            whiteSpace: "nowrap",
            borderBottom: "1px solid #ddd",
            textAlign: "center",
          }}
        >
          {isLoginMode ? "Login" : "Sign up"}
        </h2>
        <form onSubmit={authSubmitHandler}>
          {!isLoginMode && (
            <Input
              id="name"
              element="input"
              type="text"
              label="Name"
              validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(3)]}
              errorText="Please enter a valid name."
              onInput={inputHandler}
            />
          )}
          <Input
            id="email"
            element="input"
            type="email"
            validators={[VALIDATOR_REQUIRE(), VALIDATOR_EMAIL()]}
            label="E-mail"
            errorText="Please enter a valid email."
            onInput={inputHandler}
          />
          <Input
            id="password"
            element="input"
            type="password"
            validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(6)]}
            label="Password"
            errorText="Please enter a valid password."
            onInput={inputHandler}
          />
          <Button mr type="submit" disabled={!formState.isValid}>
            {isLoginMode ? "LOGIN" : "SIGNUP"}
          </Button>
        </form>
        <Button onClick={switchModeHandler}>
          SWITCH TO {isLoginMode ? "SIGNUP" : "LOGIN"}
        </Button>
      </Card>
    </React.Fragment>
  );
};

export default AuthPage;
