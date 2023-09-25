const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri, { useUnifiedTopology: true });
const routerUserProfile = express.Router();

routerUserProfile.get('/userProfile/:id', async (req, res) => {
  const { id } = req.params;

  try {
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      res.status(400).send('Неверный формат идентификатора пользователя');
      return;
    }

    await client.connect();
    const collection = client.db('react-app').collection('users');
    const user = await collection.findOne({ _id: new ObjectId(id) });

    if (user) {
      res.json(user);
    } else {
      res.status(401).send('Такого пользователя не существует');
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка выполнения запроса' });
  } finally {
    await client.close();
  }
});

module.exports = routerUserProfile;