import { createContext } from "react";

export const MiscContext = createContext({
  cartItems: null,
  // increment: () => {},
  // decrement: () => {},
  updateQuantity: () => {},
  setCartQantity: () => {},
});
