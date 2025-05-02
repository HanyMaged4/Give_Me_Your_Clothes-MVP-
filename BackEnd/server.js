const express = require('express');
const bodyParser = require('body-parser');
const rentals = require('./api/rentals');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// API routes
app.get('/api/users', rentals.getAllUsers);
app.get('/api/users/:username', rentals.getUser);
app.post('/api/users', rentals.addUser);
app.put('/api/users/:username', rentals.updateUser);
app.delete('/api/users/:username', rentals.deleteUser);

// Clothes API routes
app.get('/api/users/:username/clothes', rentals.getClothes);
app.post('/api/users/:username/clothes', rentals.addClothingItem);
app.put('/api/users/:username/clothes/:itemId', rentals.updateClothingItem);
app.delete('/api/users/:username/clothes/:itemId', rentals.deleteClothingItem);

// Rented Items API routes
app.get('/api/users/:username/renteditems', rentals.getRentedItems);
app.post('/api/users/:username/renteditems', rentals.addRentedItem);
app.delete('/api/users/:username/renteditems/:itemId', rentals.deleteRentedItem);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
