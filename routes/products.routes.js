const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri, { useUnifiedTopology: true });

const routerProducts = express.Router();

routerProducts.get('/products', async (req, res) => {
  try {
    await client.connect();
    const database = client.db('react-app');
    const collection = database.collection('products');
    const data = await collection.find().toArray();
    res.json(data);
  } catch (error) {
    console.error('Ошибка выполнения запроса:', error);
    res.status(500).json({ error: 'Ошибка выполнения запроса' });
  }
});

routerProducts.get('/products/:id', async (req, res) => {
    const { id } = req.params;
    try {
      await client.connect();
      const database = client.db('react-app');
      const collection = database.collection('products');
      const product = await collection.findOne({ _id: new ObjectId(id) });
      if (product) {
        res.json(product);
      } else {
        res.status(401).send('Товара не существует');
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Ошибка выполнения запроса' });
    } finally {
      await client.close();
    }
  });

routerProducts.post('/products', async (req, res) => {
    
        try {
          await client.connect();
          const database = client.db('react-app');
          const collection = database.collection('products');
          const newData = req.body;
          const result = await collection.insertOne(newData);
          res.json(result);
        } catch (error) {
          console.error('Ошибка выполнения запроса:', error);
          res.status(500).json({ error: 'Ошибка выполнения запроса' });
        }

    });

module.exports = routerProducts;