const express = require('express');
const { MongoClient } = require('mongodb');
const { ObjectId } = require('mongodb');

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

routerCheckout.post('/updatebalance/:id', async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    console.log('Received data:', data);
    await client.connect();
    const collection = client.db('react-app').collection('users');
    
    const updateData = {
      credit: data.credit.toFixed(2),
    };
    
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData}
    );

    console.log('Update result:', result);
    if (result.modifiedCount === 1) {
      res.sendStatus(200);
    } else {
      res.status(404).send('Пользователь не найден');
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка выполнения запроса' });
  } finally {
    await client.close();
  }
});

module.exports = routerCheckout;