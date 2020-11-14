const express = require('express')
const app = express()
const PORT = process.env.PORT || 5000

// to create modular, mountable route handlers
const adminRoutes = require('./routes/admin.js');
const shopRoutes = require('./routes/shop.js');

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));

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