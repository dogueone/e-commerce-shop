const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

// to create modular, mountable route handlers
const usersRoutes = require("./routes/users-routes.js");
const booksRoutes = require("./routes/books-routes.js");
const orderRoutes = require("./routes/order-routes.js");
const connectDB = require("./db");
const HttpError = require("./models/http-error");

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

// app.use(bodyParser.json());
app.use(express.json());
// app.use(
//   express.urlencoded({
//     extended: true,
//   })
// );

// middleware to serve images statically
// app.use("/uploads/images", express.static(path.join("uploads", "images")));
// to serve other files statically, it works for index.html, assets.. but not for routes
app.use(express.static(path.join("public")));

// To allow cross origin request on this server(CORS-security mechanism build in the modern browsers) - to allow client to make a request to a different server ( by deafault its not allowed and client can only sent requests to the same host and port)
app.use((req, res, next) => {
  //give access to any client (* - any host can sent requests)
  res.setHeader("Access-Control-Allow-Origin", "*");
  //browser by default sent first options request before send post request (to look if post request allowed by the server) Origin, X-Requested-With, Accept - set automaticaly
  res.setHeader(
    "Access-Control-Allow-Methods",
    "POST, GET, PATCH, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// app.use("/", (req, res, next) => {
//   console.log("Runs every time");
//   next();
// });

app.use("/api/users", usersRoutes);
app.use("/api/books", booksRoutes); // => /api/books/... routes will be forwarded
app.use("/api/order", orderRoutes);

//to catch unhandled requests (unknown routes) so the react-router can take over and resolve unknown URL
app.use((req, res, next) => {
  res.sendFile(path.resolve(__dirname, "public", "index.html"));
});

// app.use((req, res, next) => {
//   const error = new HttpError("Could not find this route", 404);
//   throw error;
// });

// special error handling middleware
app.use((error, req, res, next) => {
  //
  if (req.file) {
    // fs.unlink(req.file.path, (err) => {
    //   console.log(err);
    // });
    console.log(req.file);
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});
