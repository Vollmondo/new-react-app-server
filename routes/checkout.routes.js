const express = require('express');
const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri, { useUnifiedTopology: true });

const routerCheckout = express.Router();
routerCheckout.post('/checkout-success.json', async (req, res) => {
  try {
    const order = req.body;
    await client.connect();
    const ordersCollection = client.db('react-app').collection('orders');
    
    await ordersCollection.insertOne(order);

    const response = {
      success: true,
      message: 'Заказ успешно завершен'
    };
    res.json(response);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  } finally {
    await client.close();
  }
});

routerCheckout.post('/checkout-error.json', (req, res) => {
  const response = {
    success: false,
    error: 'Произошла ошибка при оформлении заказа'
  };
  res.json(response);
});

module.exports = routerCheckout;