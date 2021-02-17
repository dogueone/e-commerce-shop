import React from "react";

import BooksList from "../components/BooksList";

const Products = () => {
  const BOOKS = [
    {
      id: "1",
      title: "Book1",
      image:
        "https://images.pexels.com/photos/415071/pexels-photo-415071.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      price: "1.99",
    },
    {
      id: "2",
      title: "Book2",
      image:
        "https://images.pexels.com/photos/415071/pexels-photo-415071.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      price: "2.99",
    },
    {
      id: "3",
      title: "Book3",
      image:
        "https://images.pexels.com/photos/415071/pexels-photo-415071.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      price: "3.99",
    },
  ];
  return (
    <div>
      <BooksList items={BOOKS} />
    </div>
  );
};

export default Products;
