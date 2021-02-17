const express = require('express')
const app = express()
const PORT = process.env.PORT || 5000

const connectDB = require('./config/db');

// to create modular, mountable route handlers
const adminRoutes = require('./routes/admin.js');
const shopRoutes = require('./routes/shop.js');

const bodyParser = require('body-parser');

connectDB();

app.use(bodyParser.urlencoded({ extended: true }));

// To allow cross origin request on this server(CORS-security mechanism build in the modern browsers) - to allow client to make a request to a different server ( by deafault its not allowed and client can only sent requests to the same host and port)
app.use((req, res, next) => {
  //give access to any client (* - any host can sent requests)
  res.setHeader('Access-Control-Allow-Origin', '*');
  //browser by default sent first options request before send post request (to look if post request allowed by the server)
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use('/', (req, res, next) => {
  console.log('Runs every time');
  next();
});

app.use(adminRoutes);
app.use(shopRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`)
})