const express = require('express');
const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri, { useUnifiedTopology: true });

const routerProdChars = express.Router();

routerProdChars.get('/characteristics', async (req, res) => {
    try {
      const chars = req.query.chars;
  console.log(chars)
      // Преобразование объекта chars в массив пар ключ-значение
      const charEntries = Object.entries(chars);
        
      res.json(charEntries);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

module.exports = routerProdChars;