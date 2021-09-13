import React, { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import ImageUpload from "../components/FormElements/ImageUpload";
import Card from "../components/UIElements/Card";
import { useHttpClient } from "../hooks/http-hook";
import LoadingSpinner from "../components/UIElements/LoadingSpinner";
import ErrorModal from "../components/UIElements/ErrorModal";
import { useForm } from "../hooks/form-hook";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
  VALIDATOR_MIN,
  VALIDATOR_MAX,
} from "../util/validators";
import Input from "../components/FormElements/Input";
import Button from "../components/FormElements/Button";
import BackElement from "../components/UIElements/BackElement";

const EditProductPage = (props) => {
  const { error, clearError, sendRequest, isLoading } = useHttpClient();
  const [loadedBook, setLoadedBook] = useState();
  const bookId = useParams().bid;
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
      image: {
        value: "",
        isValid: false,
      },
      price: {
        value: 0,
        isValid: false,
      },
    },
    false
  );

  const history = useHistory();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/books/${bookId}`
        );
        setLoadedBook(responseData.book);
        console.log(loadedBook);
        console.log(formState);
        setFormData(
          {
            title: {
              value: responseData.book.title,
              isValid: true,
            },
            description: {
              value: responseData.book.description,
              isValid: true,
            },
            image: {
              value: responseData.book.image,
              isValid: true,
            },
            price: {
              value: responseData.book.price,
              isValid: true,
            },
          },
          true
        );
        console.log(formState);
      } catch (err) {}
    };
    fetchBook();
  }, [sendRequest, bookId, setFormData]); // setFormData will never be recreated during rerender because of useCallback, identifiedBook either, because it has same place in memory.

  const bookUpdateSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/books/${bookId}`,
        "PATCH",
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
          image: formState.inputs.image.value,
          price: formState.inputs.price.value,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
    } catch (err) {}
    history.push("/");
  };

  if (isLoading) {
    return <LoadingSpinner asOverlay />;
  }

  // if (!loadedBook && !error) {
  //   return <BackElement>Could not find such product</BackElement>;
  // }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedBook && (
        <Card className="product-form">
          <form onSubmit={bookUpdateSubmitHandler}>
            <Input
              id="title"
              element="input"
              type="text"
              label="Title"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a valid title."
              onInput={inputHandler}
              initialValue={loadedBook.title}
              initialValid={true}
            />
            <Input
              id="description"
              element="textarea"
              type="text"
              label="Description"
              validators={[VALIDATOR_MINLENGTH(5)]}
              errorText="Please enter a valid description (at least 5 characters)."
              onInput={inputHandler}
              initialValue={loadedBook.description}
              initialValid={true}
            />
            {/* <Input
            id="image"
            element="input"
            type="text"
            label="Image"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please upload an image."
            onInput={inputHandler}
            initialValue={loadedBook.image}
            initialValid={true}
          /> */}
            <Input
              step="0.1"
              id="price"
              element="input"
              type="number"
              label="Price"
              validators={[
                VALIDATOR_REQUIRE(),
                VALIDATOR_MIN(0.1),
                VALIDATOR_MAX(999.99),
              ]}
              errorText="Please enter a valid price from $0.1 to $999.99"
              onInput={inputHandler}
              initialValue={loadedBook.price}
              initialValid={true}
            />
            <div>
              <Button type="submit" disabled={!formState.isValid}>
                UPDATE PRODUCT
              </Button>
            </div>
          </form>
        </Card>
      )}
    </React.Fragment>
  );
};

export default EditProductPage;
