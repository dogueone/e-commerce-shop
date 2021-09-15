import * as actionTypes from "../actions/notificationsA";

const initialState = [];

const reducer = (popUpList = initialState, action) => {
  switch (action.type) {
    case actionTypes.ITEM_TIMEOUT:
      console.log("ITEMTIMEOUT");
      let NewData = [...popUpList.map((obj) => ({ ...obj }))];

      const ResultData = NewData.filter(
        (item) => item.ukey !== action.payload.ukey
      );
      // shift();
      console.log(ResultData);
      return ResultData;
    case actionTypes.ADD_TO_CART:
      console.log("ADDTOCART");
      if (popUpList.length >= 3) {
        let listToMutate = [
          ...popUpList.map((obj) => ({ ...obj })),
          {
            content: action.payload.content,
            ukey: action.payload.ukey,
            popUpStyle: "add-to-cart",
          },
        ];
        listToMutate.shift();
        return listToMutate;
      } else {
        return [
          ...popUpList.map((obj) => ({ ...obj })),
          {
            content: action.payload.content,
            ukey: action.payload.ukey,
            popUpStyle: "add-to-cart",
          },
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
      if (popUpList.length >= 3) {
        let listToMutate = [
          ...popUpList.map((obj) => ({ ...obj })),
          {
            content: action.payload.content,
            ukey: action.payload.ukey,
            popUpStyle: "delete-item",
          },
        ];
        listToMutate.shift();
        return listToMutate;
      } else {
        return [
          ...popUpList.map((obj) => ({ ...obj })),
          {
            ukey: action.payload.ukey,
            content: action.payload.content,
            popUpStyle: "delete-item",
          },
        ];
      }

    default:
      return popUpList;
  }
};

export default reducer;
