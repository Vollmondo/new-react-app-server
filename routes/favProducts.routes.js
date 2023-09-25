const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri, { useUnifiedTopology: true });
const routerFavProducts = express.Router();

routerFavProducts.get("/userProfile/:userId/fav", async (req, res) => {
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
  
  routerFavProducts.post("/userProfile/:userId/fav/:productId", async (req, res) => {
    try {
      console.log("Поступил POST-запрос на сервер");
      
      await client.connect();
      const collection = client.db('react-app').collection('users');
      const userId = req.params.userId;
      const productId = req.params.productId;
    
      console.log("Получены параметры userId и productId:", userId, productId);
  
      const user = await collection.findOne({ _id: new ObjectId(userId) });
      if (!user) {
        console.log("Пользователь не найден");
        return res.status(404).json({ error: "Пользователь не найден" });
      }
    
      const isProductInFav = user.fav.includes(productId);
      if (isProductInFav) {
        console.log("Товар уже в избранном");
        return res.status(400).json({ error: "Товар уже в избранном" });
      }
    
      user.fav.push(productId);
      await collection.updateOne({ _id: new ObjectId(userId) }, { $set: { fav: user.fav } });
    
      console.log("Изменения успешно внесены в базу данных");
      res.json(user.fav);
    } catch (error) {
      console.error("Ошибка при добавлении товара в избранное:", error);
      res.status(500).json({ error: "Внутренняя ошибка сервера" });
    }
  });
  
  routerFavProducts.delete("/userProfile/:userId/fav/:productId", async (req, res) => {
    try {
      await client.connect();
      const collection = client.db('react-app').collection('users');
      const userId = req.params.userId;
      const productId = req.params.productId;
  
      const user = await collection.findOne({ _id: new ObjectId(userId) });
      if (!user) {
        return res.status(404).json({ error: "Пользователь не найден" });
      }
  
      const isProductInFav = user.fav.includes(productId);
      if (!isProductInFav) {
        return res.status(400).json({ error: "Товар не найден в избранном" });
      }
  
      user.fav = user.fav.filter((favProductId) => favProductId !== productId);
      await collection.updateOne({ _id: new ObjectId(userId) }, { $set: { fav: user.fav } });
  
      res.json(user.fav);
    } catch (error) {
      console.error("Ошибка при удалении товара из избранного:", error);
      res.status(500).json({ error: "Внутренняя ошибка сервера" });
    }
  });

module.exports = routerFavProducts;