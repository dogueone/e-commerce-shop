import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

import { useForm } from "../hooks/form-hook";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
  VALIDATOR_MIN,
} from "../util/validators";
import Input from "../components/FormElements/Input";
import Button from "../components/FormElements/Button";
import "./ProductForm.css";

const BOOKS = [
  {
    id: "1",
    title: "Book1",
    image:
      "https://images.pexels.com/photos/415071/pexels-photo-415071.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    description:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eos consequatur minima recusandae nemo quo corporis, molestiae nobis ut obcaecati ea saepe, hic praesentium cupiditate excepturi quibusdam sed! Totam, nihil velit.",
    price: "1.99",
  },
  {
    id: "2",
    title: "Book2",
    image:
      "https://images.pexels.com/photos/415071/pexels-photo-415071.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    description:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eos consequatur minima recusandae nemo quo corporis, molestiae nobis ut obcaecati ea saepe, hic praesentium cupiditate excepturi quibusdam sed! Totam, nihil velit.",
    price: "2.99",
  },
  {
    id: "3",
    title: "Book3",
    image:
      "https://images.pexels.com/photos/415071/pexels-photo-415071.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    description:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eos consequatur minima recusandae nemo quo corporis, molestiae nobis ut obcaecati ea saepe, hic praesentium cupiditate excepturi quibusdam sed! Totam, nihil velit.",
    price: "3.99",
  },
];

const EditProductPage = (props) => {
  const bookId = useParams().bid;

  const identifiedBook = BOOKS.find((book) => book.id === bookId);

  const [formState, inputHandler] = useForm(
    {
      title: {
        value: identifiedBook.title,
        isValid: true,
      },
      description: {
        value: identifiedBook.description,
        isValid: true,
      },
      price: {
        value: identifiedBook.price,
        isValid: true,
      },
    },
    true
  );

  // useEffect(() => {
  //   setFormData(
  //     {
  //       title: {
  //         value: identifiedBook.title,
  //         isValid: true,
  //       },
  //       description: {
  //         value: identifiedBook.description,
  //         isValid: true,
  //       },
  //       price: {
  //         value: identifiedBook.price,
  //         isValid: true,
  //       },
  //     },
  //     true
  //   );
  // }, [setFormData, identifiedBook]); //setFormData will never change because of useCallback, identifiedBook either becase it has same place in memmory.

  const bookUpdateSubmitHandler = (event) => {
    event.preventDefault();
    console.log(formState.inputs);
  };

  if (!identifiedBook) {
    return (
      <div className="center">
        <h2>Could not find Book!</h2>
      </div>
    );
  }

  return (
    <form className="product-form" onSubmit={bookUpdateSubmitHandler}>
      <Input
        id="title"
        element="input"
        type="text"
        label="Title"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid title."
        onInput={inputHandler}
        initialValue={formState.inputs.title.value}
        initialValid={formState.inputs.title.isValid}
      />
      <Input
        id="description"
        element="textarea"
        type="text"
        label="Description"
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText="Please enter a valid description (at least 5 characters)."
        onInput={inputHandler}
        initialValue={formState.inputs.description.value}
        initialValid={formState.inputs.description.isValid}
      />
      {/* <Input
        id="image"
        element="input"
        type="url"
        label="Image URL"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please upload an image."
        onInput={inputHandler}
      /> */}
      <Input
        id="price"
        element="input"
        type="number"
        label="Price"
        validators={[VALIDATOR_REQUIRE(), VALIDATOR_MIN(1)]}
        errorText="Please enter a valid price."
        onInput={inputHandler}
        initialValue={formState.inputs.price.value}
        initialValid={formState.inputs.price.isValid}
      />
      <div>
        <Button type="submit" disabled={!formState.isValid}>
          EDIT PRODUCT
        </Button>
      </div>
    </form>
  );
};

export default EditProductPage;
