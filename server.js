const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const routerCategories = require('./routes/categories.routes');
const routerUsers = require('./routes/users.routes');
const routerLogin = require('./routes/login.routes');
const routerRegister = require('./routes/registration.routes');
const routerUserProfile = require('./routes/profile.routes');
const routerArticles = require('./routes/articles.routes');
const routerProducts = require('./routes/products.routes');
const routerProdChars = require('./routes/prodchars.routes');
const routerCheckout = require('./routes/checkout.routes');
const routerFavProducts = require('./routes/favProducts.routes')
const routerSearch = require('./routes/search.routes')


const app = express();
const port = 5000;

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri, { useUnifiedTopology: true });
module.exports = client;

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(routerCategories);
app.use(routerUsers);
app.use(routerLogin);
app.use(routerRegister);
app.use(routerUserProfile);
app.use(routerArticles);
app.use(routerProducts);
app.use(routerProdChars);
app.use(routerCheckout);
app.use(routerFavProducts)
app.use(routerSearch)

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});