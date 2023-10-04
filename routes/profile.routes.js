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

routerUserProfile.post('/saveUser/:id', async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    console.log('Received data:', data);
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      res.status(400).send('Неверный формат идентификатора пользователя');
      return;
    }
    
    await client.connect();
    const collection = client.db('react-app').collection('users');
    
    const updateData = {
      address: data.address,
      email: data.email,
      username: data.username,
      avatar: data.avatar,
      name: data.name,
      phone: data.phone,
      birthdate: data.birthdate,
    };
    
    if (data.password !== '') {
      updateData.password = data.password;
    }
    
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData, $inc: { __v: 1 } }
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

routerUserProfile.post('/saveUserPwd/:id', async (req, res) => {
  const { id } = req.params;
  const { oldPwd, newPwd } = req.body;

  try {
    console.log('Received data:', { oldPwd, newPwd });
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      res.status(400).send('Неверный формат идентификатора пользователя');
      return;
    }

    await client.connect();
    const collection = client.db('react-app').collection('users');

    const user = await collection.findOne({ _id: new ObjectId(id), password: oldPwd });
    if (!user) {
      res.status(401).send('Неверный идентификатор пользователя или старый пароль');
      return;
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { password: newPwd }, $inc: { __v: 1 } }
    );

    console.log('Update result:', result);
    if (result.modifiedCount === 1) {
      res.sendStatus(200);
    } else {
      res.status(500).send('Ошибка при обновлении пароля');
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка выполнения запроса' });
  } finally {
    await client.close();
  }
});

module.exports = routerUserProfile;