import React from "react";

import { useForm } from "../hooks/form-hook";
import Button from "../components/FormElements/Button";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
  VALIDATOR_MIN,
} from "../util/validators";
import Input from "../components/FormElements/Input";
import "./ProductForm.css";

// const formReducer = (state, action) => {
//   switch (action.type) {
//     case "INPUT_CHANGE":
//       let formIsValid = true;
//       for (const inputId in state.inputs) {
//         if (inputId === action.inputId) {
//           formIsValid = formIsValid && action.isValid;
//         } else {
//           formIsValid = formIsValid && state.inputs[inputId].isValid;
//         }
//       }
//       return {
//         ...state,
//         inputs: {
//           ...state.inputs,
//           [action.inputId]: { value: action.value, isValid: action.isValid },
//         },
//         isValid: formIsValid,
//       };
//     default:
//       return state;
//   }
// };

const NewProductPage = (props) => {
  const [formState, inputHandler] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
      price: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  // const [formState, dispatch] = useReducer(formReducer, {
  //   inputs: {
  //     title: {
  //       value: "",
  //       isValid: false,
  //     },
  //     description: {
  //       value: "",
  //       isValid: false,
  //     },
  //   },
  //   isValid: false,
  // });

  // const inputHandler = useCallback((id, value, isValid) => {
  //   dispatch({
  //     type: "INPUT_CHANGE",
  //     value: value,
  //     isValid: isValid,
  //     inputId: id,
  //   });
  // }, []);

  const productSubmitHandler = (event) => {
    event.preventDefault();
    console.log(formState.inputs);
  };

  return (
    <form className="product-form" onSubmit={productSubmitHandler}>
      <Input
        id="title"
        element="input"
        type="text"
        label="Title"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid title."
        onInput={inputHandler}
      />
      <Input
        id="description"
        element="textarea"
        label="Description"
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText="Please enter a valid description (at least 5 characters)."
        onInput={inputHandler}
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
      />
      <div className="product-form__btn">
        <Button type="submit" disabled={!formState.isValid}>
          ADD PRODUCT
        </Button>
      </div>
    </form>
  );
};

export default NewProductPage;

{
  /* <div>
      <form className="product-form" onSubmit={onSubmitHandler}>
        <h2>NewProduct</h2>
        <div className="form-control">
          <label htmlFor="title">Title</label>
          <input type="text" name="title" />
        </div>
        <div className="form-control">
          <textarea name="desciption" placeholder="description" />
        </div>
        <div className="form-control">
          <label htmlFor="imageURL">Image URL</label>
          <input type="url" name="imageURL" />
        </div>
        <div className="form-control">
          <label htmlFor="price">Price</label>
          <input type="number" name="price" />
        </div>
        <button className="btn">Submit</button>
        <div className="form-control">
          <input type="reset" />
        </div>
      </form>
    </div> */
}
