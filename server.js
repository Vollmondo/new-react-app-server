const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const routerCategories = require('./routes/categories.routes');
const routerUsers = require('./routes/users.routes');
const routerLogin = require('./routes/login.routes');
const routerRegister = require('./routes/registration.router');
const routerUserProfile = require('./routes/profile.routes');

const app = express();
const port = 5000;

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri, { useUnifiedTopology: true });
module.exports = client;

app.use(express.json());
app.use(cors());
app.use(routerCategories);
app.use(routerUsers);
app.use(routerLogin)
app.use(routerRegister)
app.use(routerUserProfile)

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});