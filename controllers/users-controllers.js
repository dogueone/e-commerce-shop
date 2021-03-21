const HttpError = require("../models/http-error");
const { v4: uuidv4 } = require("uuid");

DUMMY_USERS = [
  {
    id: "u1",
    email: "test@test.com",
    password: "12345",
  },
  {
    id: "u2",
    email: "test2@test.com",
    password: "12345",
  },
];

const getUsers = (req, res, next) => {
  res.json({ users: DUMMY_USERS });
};

const signup = (req, res, next) => {
  const { email, password } = req.body;

  const hasUser = DUMMY_USERS.find((u) => u.email === email);

  if (hasUser) {
    throw new HttpError("Could not create user, email already exists.", 422);
  }

  const createdUser = {
    id: uuidv4(),
    email,
    password,
  };

  DUMMY_USERS.push(createdUser);

  res.status(201).json({ user: createdUser });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  const identifiedUser = DUMMY_USERS.find((u) => u.email === email);

  if (!identifiedUser || identifiedUser.password !== password) {
    throw new HttpError("Could not identify user, invalid credentials", 401);
  }

  res.json({ message: "Logged in!" });
};

module.exports = {
  getUsers,
  signup,
  login,
};
