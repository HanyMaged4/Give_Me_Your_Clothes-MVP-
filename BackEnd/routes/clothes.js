const express = require('express');
const fs = require('fs-extra');
const router = express.Router();

const CLOTHES_DB = './data/clothes.json';

// List clothes
router.get('/', async (req, res) => {
  const clothes = await fs.readJson(CLOTHES_DB).catch(() => []);
  res.json(clothes);
});

// Add clothes
router.post('/', async (req, res) => {
  const { owner, size, type, images, price } = req.body;
  const clothes = await fs.readJson(CLOTHES_DB).catch(() => []);
  const newClothing = { id: Date.now(), owner, size, type, images, price };
  clothes.push(newClothing);
  await fs.writeJson(CLOTHES_DB, clothes);
  res.status(201).json(newClothing);
});

module.exports = router;
