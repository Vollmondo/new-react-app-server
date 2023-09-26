const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri, { useUnifiedTopology: true });
const database = client.db('react-app');
const collection = database.collection('products');

const routerSearch = express.Router();

routerSearch.use(express.json());

routerSearch.post('/search', async (req, res) => {
  try {
    const productTitle = req.body.productTitle;
    const result = await collection.find({ title: { $regex: productTitle, $options: 'i' } }).toArray();
    res.json(result);
  } catch (error) {
    console.error('Ошибка выполнения запроса:', error);
    res.status(500).json({ error: 'Ошибка выполнения запроса' });
  }
});

module.exports = routerSearch;