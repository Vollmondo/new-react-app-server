const express = require('express');
const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri, { useUnifiedTopology: true });

const routerCheckout = express.Router();
routerCheckout.post('/checkout-success.json', (req, res) => {
  
    
  const response = {
    success: true,
    message: 'Заказ успешно завершен',
  };
  res.json(response);
});

routerCheckout.post('/checkout-error.json', (req, res) => {
 
    
  const response = {
    success: false,
    error: 'Произошла ошибка при оформлении заказа',
  };
  res.json(response);
});

module.exports = routerCheckout;