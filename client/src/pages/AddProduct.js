import React from "react";

const AddProductPage = (props) => {
  const onSubmitHandler = (event) => {
    event.preventDefault();
    console.log("Form Submited");
  };
  return (
    <div>
      <form className="product-form" onSubmit={onSubmitHandler}>
        <h2>The AddProduct Page</h2>
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
    </div>
  );
};

export default AddProductPage;
