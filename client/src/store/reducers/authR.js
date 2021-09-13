const initialState = {
  token: null,
  userId: null,
  expirationDate: null,
  isLoggedIn: false,
};

// const [checkingToken, setCheckingToken] = useState(true);

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN":
      const { userId, token, expiration } = action.payload;

      const tokenExpirationDate =
        expiration || new Date(new Date().getTime() + 1000 * 60 * 60);

      localStorage.setItem(
        "userData",
        JSON.stringify({
          userId: userId,
          token: token,
          expiration: tokenExpirationDate.toISOString(),
        })
      );

      //   setCheckingToken(false);

      return {
        token: token,
        userId: userId,
        expirationDate: tokenExpirationDate,
        isLoggedIn: true,
      };

    case "LOGOUT":
      localStorage.removeItem("userData");
      return {
        token: null,
        userId: null,
        expirationDate: null,
        isLoggedIn: false,
      };

    default:
      return state;
  }
};

export default reducer;
