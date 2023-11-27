const express = require('express');
const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri, { useUnifiedTopology: true });

const routerLogs = express.Router();

routerLogs.use(express.json());

routerLogs.post('/api/logs', async (req, res) => {
  try {
    await client.connect();
    const database = client.db('react-app');
    const collection = database.collection('logs');
    const newData = req.body;
    newData.entryTime = new Date();
    console.log('Полученные данные:', newData);
    const result = await collection.insertOne(newData);
    res.json({ insertedId: result.insertedId });
} catch (error) {
    console.error('Ошибка выполнения запроса:', error);
    res.status(500).json({ error: 'Ошибка выполнения запроса' });
  }
});

module.exports = routerLogs;