const express = require('express');
const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri, { useUnifiedTopology: true });

const routerLogin = express.Router();

routerLogin.post('/users/login', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      await client.connect();
      const collection = client.db('react-app').collection('users');
      const user = await collection.findOne({ username, password });
  
      if (user) {
        res.json(user);
      } else {
        res.status(401).send('Неверные имя пользователя или пароль');
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Ошибка выполнения запроса' });
    } finally {
      await client.close();
    }
  });

module.exports = routerLogin;