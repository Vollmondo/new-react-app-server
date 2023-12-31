const express = require('express');
const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri, { useUnifiedTopology: true });

const routerUsers = express.Router();

routerUsers.get('/users', async (req, res) => {
  try {
    await client.connect();
    const database = client.db('react-app');
    const collection = database.collection('users');
    const data = await collection.find().toArray();
    res.json(data);
  } catch (error) {
    console.error('Ошибка выполнения запроса:', error);
    res.status(500).json({ error: 'Ошибка выполнения запроса' });
  }
});

routerUsers.post('/users', async (req, res) => {
    
  try {
    await client.connect();
    const database = client.db('react-app');
    const collection = database.collection('users');
    const newData = req.body;
    const result = await collection.insertOne(newData);
    res.json(result);
  } catch (error) {
    console.error('Ошибка выполнения запроса:', error);
    res.status(500).json({ error: 'Ошибка выполнения запроса' });
  }

});

routerUsers.get('/roles', async (req, res) => {
  try {
    await client.connect();
    const database = client.db('react-app');
    const collection = database.collection('roles');
    const data = await collection.find().toArray();
    res.json(data);
  } catch (error) {
    console.error('Ошибка выполнения запроса:', error);
    res.status(500).json({ error: 'Ошибка выполнения запроса' });
  }
});

module.exports = routerUsers;