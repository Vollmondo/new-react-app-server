const express = require('express');
const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri, { useUnifiedTopology: true });

const routerRegister = express.Router();

routerRegister.post('/users/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    await client.connect();
    const collection = client.db('react-app').collection('users');
    const existingUser = await collection.findOne({ username });

    if (existingUser) {
      res.status(409).send('Пользователь с таким именем уже существует');
    } else {
        const newUser = { username, password };
        const result = await collection.insertOne(newUser);
        const registeredUser = { ...newUser, _id: result.insertedId };
        res.json(registeredUser);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка выполнения запроса' });
  } finally {
    await client.close();
  }
});

module.exports = routerRegister;