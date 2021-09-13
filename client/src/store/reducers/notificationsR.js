import * as actionTypes from "../actions/notificationsA";

const initialState = [];

const reducer = (popUpList = initialState, action) => {
  switch (action.type) {
    case actionTypes.ADD_TO_CART:
      console.log("ADDTOCART");
      if (popUpList.length >= 4) {
        let listToMutate = [
          {
            content: action.payload.content,
            ukey: action.payload.ukey,
            popUpStyle: "add-to-cart",
          },
          ...popUpList.map((obj) => ({ ...obj })),
        ];
        listToMutate.pop();
        return listToMutate;
      } else {
        return [
          {
            content: action.payload.content,
            ukey: action.payload.ukey,
            popUpStyle: "add-to-cart",
          },
          ...popUpList.map((obj) => ({ ...obj })),
        ];
      }

    case actionTypes.DELETE_ITEM:
      console.log("DELETEITEM");
      return [
        ...popUpList.map((obj) => ({ ...obj })),
        {
          content: action.payload.content,
          ukey: action.payload.ukey,
          popUpStyle: "delete-item",
        },
      ];
    case actionTypes.MAXIMUM_ITEMS:
      if (popUpList.length >= 4) {
        let listToMutate = [
          {
            content: action.payload.content,
            ukey: action.payload.ukey,
            popUpStyle: "delete-item",
          },
          ...popUpList.map((obj) => ({ ...obj })),
        ];
        listToMutate.pop();
        return listToMutate;
      } else {
        return [
          {
            ukey: action.payload.ukey,
            content: action.payload.content,
            popUpStyle: "delete-item",
          },
          ...popUpList.map((obj) => ({ ...obj })),
        ];
      }

    case actionTypes.ITEM_TIMEOUT:
      console.log("ITEMTIMEOUT");
      let NewData = [...popUpList.map((obj) => ({ ...obj }))];

      NewData.shift();
      console.log(NewData);
      return NewData;

    default:
      return popUpList;
  }
};

export default reducer;
