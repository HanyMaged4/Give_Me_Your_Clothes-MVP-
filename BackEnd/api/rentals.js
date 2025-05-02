const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, '../data/data.json');

// Helper function to read data
function readData() {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading data file:', error);
    throw new Error('Could not read data file');
  }
}

// Helper function to write data
function writeData(data) {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing to data file:', error);
    throw new Error('Could not write to data file');
  }
}

// Get all users and their rental items
function getAllUsers(req, res) {
  const data = readData();
  res.json(data.users);
}

// Get a specific user's rental items
function getUser(req, res) {
  const data = readData();
  const { username } = req.params;
  const user = data.users.find(u => u.username === username);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json(user);
}

// Add a new user
function addUser(req, res) {
  const data = readData();
  const newUser = req.body;
  data.users.push(newUser);
  writeData(data);
  res.status(201).json(newUser);
}

// Update a user's rental items
function updateUser(req, res) {
  const data = readData();
  const { username } = req.params;
  const userIndex = data.users.findIndex(u => u.username === username);

  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  data.users[userIndex] = { ...data.users[userIndex], ...req.body };
  writeData(data);
  res.json(data.users[userIndex]);
}

// Delete a user
function deleteUser(req, res) {
  const data = readData();
  const { username } = req.params;
  const userIndex = data.users.findIndex(u => u.username === username);

  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  const [deletedUser] = data.users.splice(userIndex, 1); // Use destructuring to get the deleted user
  writeData(data);
  res.json({ username: deletedUser.username }); // Return the deleted user's username
}

// Get all clothes for a specific user
function getClothes(req, res) {
  const data = readData();
  const { username } = req.params;
  const user = data.users.find(u => u.username === username);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json(user.itemsForRent);
}

// Add a new clothing item for a specific user
function addClothingItem(req, res) {
  const data = readData();
  const { username } = req.params;
  const user = data.users.find(u => u.username === username);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const newClothingItem = req.body;
  user.itemsForRent.push(newClothingItem);
  writeData(data);
  res.status(201).json(newClothingItem);
}

// Update a specific clothing item for a user
function updateClothingItem(req, res) {
  const data = readData();
  const { username, itemId } = req.params;
  const user = data.users.find(u => u.username === username);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const clothingIndex = user.itemsForRent.findIndex(item => item.itemId == itemId);

  if (clothingIndex === -1) {
    return res.status(404).json({ error: 'Clothing item not found' });
  }

  user.itemsForRent[clothingIndex] = { ...user.itemsForRent[clothingIndex], ...req.body };
  writeData(data);
  res.json(user.itemsForRent[clothingIndex]);
}

// Delete a specific clothing item for a user
function deleteClothingItem(req, res) {
  const data = readData();
  const { username, itemId } = req.params;
  const user = data.users.find(u => u.username === username);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const clothingIndex = user.itemsForRent.findIndex(item => item.itemId == itemId);

  if (clothingIndex === -1) {
    return res.status(404).json({ error: 'Clothing item not found' });
  }

  const deletedItem = user.itemsForRent.splice(clothingIndex, 1);
  writeData(data);
  res.json(deletedItem);
}

// Get all rented items for a specific user
function getRentedItems(req, res) {
  const data = readData();
  const { username } = req.params;
  const user = data.users.find(u => u.username === username);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json(user.rentedItems || []);
}

// Add a rented item for a specific user
function addRentedItem(req, res) {
  const data = readData();
  const { username } = req.params;
  const user = data.users.find(u => u.username === username);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (!user.rentedItems) {
    user.rentedItems = [];
  }

  const newRentedItem = req.body;
  user.rentedItems.push(newRentedItem);
  writeData(data);
  res.status(201).json(newRentedItem);
}

// Remove a rented item for a specific user
function deleteRentedItem(req, res) {
  const data = readData();
  const { username, itemId } = req.params;
  const user = data.users.find(u => u.username === username);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (!user.rentedItems) {
    return res.status(404).json({ error: 'No rented items found for this user' });
  }

  const rentedIndex = user.rentedItems.findIndex(item => item.itemId == itemId);

  if (rentedIndex === -1) {
    return res.status(404).json({ error: 'Rented item not found' });
  }

  const [deletedItem] = user.rentedItems.splice(rentedIndex, 1); // Use destructuring to get the deleted item
  writeData(data);
  res.json({ itemId: deletedItem.itemId }); // Return the deleted item's itemId
}

module.exports = {
  getAllUsers,
  getUser,
  addUser,
  updateUser,
  deleteUser,
  getClothes,
  addClothingItem,
  updateClothingItem,
  deleteClothingItem,
  getRentedItems,
  addRentedItem,
  deleteRentedItem,
};
