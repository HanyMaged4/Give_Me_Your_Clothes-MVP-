const express = require('express');
const fs = require('fs-extra');
const router = express.Router();

const RENTALS_DB = './data/rentals.json';

// View rentals
router.get('/', async (req, res) => {
  const rentals = await fs.readJson(RENTALS_DB).catch(() => []);
  res.json(rentals);
});

// Rent clothes
router.post('/', async (req, res) => {
  const { user, clothingId, rentalPeriod } = req.body;
  const rentals = await fs.readJson(RENTALS_DB).catch(() => []);
  const newRental = { id: Date.now(), user, clothingId, rentalPeriod, status: 'active' };
  rentals.push(newRental);
  await fs.writeJson(RENTALS_DB, rentals);
  res.status(201).json(newRental);
});

module.exports = router;
