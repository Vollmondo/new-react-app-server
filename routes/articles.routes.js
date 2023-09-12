const express = require('express');
const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri, { useUnifiedTopology: true });

const routerArticles = express.Router();

routerArticles.get('/articles', async (req, res) => {
  try {
    await client.connect();
    const database = client.db('react-app');
    const collection = database.collection('articles');
    const data = await collection.find().toArray();
    res.json(data);
  } catch (error) {
    console.error('Ошибка выполнения запроса:', error);
    res.status(500).json({ error: 'Ошибка выполнения запроса' });
  }
});

routerArticles.post('/articles', async (req, res) => {
    
        try {
          await client.connect();
          const database = client.db('react-app');
          const collection = database.collection('articles');
          const newData = req.body;
          const result = await collection.insertOne(newData);
          res.json(result);
        } catch (error) {
          console.error('Ошибка выполнения запроса:', error);
          res.status(500).json({ error: 'Ошибка выполнения запроса' });
        }

    });

module.exports = routerArticles;