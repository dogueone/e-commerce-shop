const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const HttpError = require("../models/http-error");
const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");
const User = require("../models/user");

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    const error = new HttpError(
      "Fetching users failed, please try again later.",
      500
    );
    return next(error);
  }

  if (users.length === 0) {
    return next(new HttpError("Could not find any users.", 404));
  }

  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    return next(
      new HttpError("Signing up failed, please try again later.", 500)
    );
  }

  // also we have mongoose email validator pluged in userSchema
  if (existingUser) {
    return next(
      new HttpError("Could not create user, email already exists.", 422)
    );
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    return next("Signing up failed, please try again later.", 500);
  }

  const createdUser = new User({
    name,
    email,
    password: hashedPassword,
    books: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    return next(
      new HttpError("Signing up failed, please try again later.", 500)
    );
  }

  let token;
  try {
    token = await jwt.sign(
      {
        userId: createdUser.id,
        email: createdUser.email,
      },
      "secret_keyabc",
      { expiresIn: "1h" }
    );
  } catch (err) {
    next(new HttpError("Signing up failed, please try again later.", 500));
  }

  res
    .status(201)
    .json({ userId: createdUser.id, email: createdUser.email, token: token });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let identifiedUser;
  try {
    identifiedUser = await User.findOne({ email: email });
  } catch (err) {
    return next(
      new HttpError("Logging in failed, please try again later.", 500)
    );
  }

  if (!identifiedUser) {
    return next(
      new HttpError("Invalid credentials, could not log you in", 401)
    );
  }

  let isValidPassword;
  try {
    isValidPassword = await bcrypt.compare(password, identifiedUser.password);
  } catch (err) {
    new HttpError(
      "Could not log you in, please check your credentials and try again.",
      500
    );
  }

  if (!isValidPassword) {
    return next(
      new HttpError("Invalid credentials, could not log you in", 401)
    );
  }

  let token;
  try {
    token = await jwt.sign(
      {
        userId: identifiedUser.id,
        email: identifiedUser.email,
      },
      "secret_keyabc",
      { expiresIn: "1h" }
    );
  } catch (err) {
    next(new HttpError("Logging in failed, please try again later.", 500));
  }

  res.json({
    userId: identifiedUser.id,
    email: identifiedUser.email,
    token: token,
  });
};

module.exports = {
  getUsers,
  signup,
  login,
};
