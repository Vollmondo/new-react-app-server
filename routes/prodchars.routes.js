const express = require('express');
const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri, { useUnifiedTopology: true });

const routerProdChars = express.Router();

routerProdChars.get('/characteristics', async (req, res) => {
    if (req.query.chars){
    try {
    const chars = req.query.chars;
    const db = client.db('react-app'); 
    const collection = db.collection('Characteristics'); 
    const charEntries = await Promise.all(Object.entries(chars).map(async ([key, value]) => {
      const doc = await collection.findOne({ [key]: { $exists: true } });
      if (doc) {
        const { title, values } = doc[key];
        return [title, values[value]];
      } else {
        return null;
      }
    }));

    const validEntries = charEntries.filter(entry => entry !== null);

    res.json(validEntries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
});

routerProdChars.get('/prodchars', async (req, res) => {
  try {
    const db = client.db('react-app');
    const collection = db.collection('Characteristics');
    const prodChars = await collection.find().toArray();
    res.json(prodChars);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = routerProdChars;