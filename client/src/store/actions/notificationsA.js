import { v4 as uuidv4 } from "uuid";

export const ADD_TO_CART = "ADDTOCART";
export const DELETE_ITEM = "DELETEITEM";
export const MAXIMUM_ITEMS = "MAXIMUMITEMS";
export const ITEM_TIMEOUT = "ITEMTIMEOUT";

//actions creators

export const addToCartAC = (payload) => {
  return {
    type: ADD_TO_CART,
    payload,
  };
};

export const maximumItemsAC = (payload) => {
  return {
    type: MAXIMUM_ITEMS,
    payload,
  };
};

export const itemTimeoutAC = (payload) => {
  return {
    type: ITEM_TIMEOUT,
    payload,
  };
};

export const deleteItemAC = (payload) => {
  return {
    type: DELETE_ITEM,
    payload,
  };
};

export function pushNotification(actionCreator, content) {
  const ukey = uuidv4();
  return (dispatch, getState) => {
    dispatch(actionCreator({ ...content, ukey }));
    setTimeout(() => {
      dispatch(itemTimeoutAC({ ukey }));
    }, 2000);
  };
}

export function itemTimeoutACAsync(payload) {
  return (dispatch) => {
    // dispatch(actionCreator(payload));
    setTimeout(() => {
      dispatch(itemTimeoutAC(payload));
    }, 2000);
  };
}
