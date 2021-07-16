import { createContext } from "react";

export const MiscContext = createContext({
  cartItemsQuantity: null,
  updateQuantity: () => {},
  setCartQantity: () => {},
  clearCart: () => {},
});
