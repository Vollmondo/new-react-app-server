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

routerUserProfile.get("/userProfile/:userId/fav", async (req, res) => {
  try {
    await client.connect();
    const collection = client.db('react-app').collection('users');
    const userId = req.params.userId;
    const user = await collection.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }
    const favProductIds = user.fav;
    res.json(favProductIds);
  } catch (error) {
    console.error("Ошибка при получении избранных товаров:", error);
    res.status(500).json({ error: "Внутренняя ошибка сервера" });
  }
});

// Добавление товара в избранное пользователя
routerUserProfile.post("/userProfile/:userId/fav", async (req, res) => {
  try {
    await client.connect();
    const collection = client.db('react-app').collection('users');
    const userId = req.params.userId;
    const productId = req.body.productId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }

    // Проверяем, есть ли товар уже в избранном пользователя
    const isProductInFav = user.fav.includes(productId);
    if (isProductInFav) {
      return res.status(400).json({ error: "Товар уже в избранном" });
    }

    // Добавляем товар в избранное пользователя
    user.fav.push(productId);
    await user.save();

    res.json(user.fav);
  } catch (error) {
    console.error("Ошибка при добавлении товара в избранное:", error);
    res.status(500).json({ error: "Внутренняя ошибка сервера" });
  }
});

// Удаление товара из избранного пользователя
routerUserProfile.delete("/userProfile/:userId/fav/:productId", async (req, res) => {
  try {
    await client.connect();
    const collection = client.db('react-app').collection('users');
    const userId = req.params.userId;
    const productId = req.params.productId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }

    // Проверяем, есть ли товар в избранном пользователя
    const isProductInFav = user.fav.includes(productId);
    if (!isProductInFav) {
      return res.status(400).json({ error: "Товар не найден в избранном" });
    }

    // Удаляем товар из избранного пользователя
    user.fav = user.fav.filter((favProductId) => favProductId !== productId);
    await user.save();

    res.json(user.fav);
  } catch (error) {
    console.error("Ошибка при удалении товара из избранного:", error);
    res.status(500).json({ error: "Внутренняя ошибка сервера" });
  }
});

module.exports = routerUserProfile;