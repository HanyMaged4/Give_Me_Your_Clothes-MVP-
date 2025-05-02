const fs = require('fs');
const path = require('path');
const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const rentals = require('../api/rentals');

const app = express();
app.use(bodyParser.json());

// API routes
app.get('/api/users', rentals.getAllUsers);
app.get('/api/users/:username', rentals.getUser);
app.post('/api/users', rentals.addUser);
app.put('/api/users/:username', rentals.updateUser);
app.delete('/api/users/:username', rentals.deleteUser);

app.get('/api/users/:username/clothes', rentals.getClothes);
app.post('/api/users/:username/clothes', rentals.addClothingItem);
app.put('/api/users/:username/clothes/:itemId', rentals.updateClothingItem);
app.delete('/api/users/:username/clothes/:itemId', rentals.deleteClothingItem);

app.get('/api/users/:username/renteditems', rentals.getRentedItems);
app.post('/api/users/:username/renteditems', rentals.addRentedItem);
app.delete('/api/users/:username/renteditems/:itemId', rentals.deleteRentedItem);

const dataFilePath = path.join(__dirname, '../data/data.json');
const initialData = {
  users: [
    {
      username: 'alice',
      hashedPassword: 'hashed_password_1',
      itemsForRent: [],
      rentedItems: [
        {
          itemId: 2,
          description: 'Rented Item'
        }
      ]
    },
    {
      username: 'testuser',
      hashedPassword: 'hashed_password_2',
      itemsForRent: [],
      rentedItems: []
    }
  ]
};

beforeEach(() => {
  fs.writeFileSync(dataFilePath, JSON.stringify(initialData, null, 2), 'utf8');
});

describe('Rentals API', () => {
  test('GET /api/users should return all users', async () => {
    const response = await request(app).get('/api/users');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('POST /api/users should add a new user', async () => {
    const newUser = {
      username: 'newuser',
      itemsForRent: [],
      rentedItems: []
    };
    const response = await request(app).post('/api/users').send(newUser);
    expect(response.status).toBe(201);
    expect(response.body.username).toBe(newUser.username);
  });

  test('GET /api/users/:username should return a specific user', async () => {
    const response = await request(app).get('/api/users/testuser');
    expect(response.status).toBe(200);
    expect(response.body.username).toBe('testuser');
  });

  test('PUT /api/users/:username should update a user', async () => {
    const updatedUser = { rentedItems: [{ itemId: 1, description: 'Updated Item' }] };
    const response = await request(app).put('/api/users/testuser').send(updatedUser);
    expect(response.status).toBe(200);
    expect(response.body.rentedItems.length).toBe(1);
  });

  test('DELETE /api/users/:username should delete a user', async () => {
    const response = await request(app).delete('/api/users/testuser');
    expect(response.status).toBe(200);
    expect(response.body.username).toBe('testuser');
  });

  test('POST /api/users/:username/clothes should add a clothing item', async () => {
    const newClothingItem = { itemId: 1, description: 'Test Clothing', size: 'M' };
    const response = await request(app).post('/api/users/alice/clothes').send(newClothingItem);
    expect(response.status).toBe(201);
    expect(response.body.description).toBe(newClothingItem.description);
  });

  test('GET /api/users/:username/clothes should return all clothes for a user', async () => {
    const response = await request(app).get('/api/users/alice/clothes');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('POST /api/users/:username/renteditems should add a rented item', async () => {
    const newRentedItem = { itemId: 3, description: 'Another Rented Item' };
    const response = await request(app).post('/api/users/alice/renteditems').send(newRentedItem);
    expect(response.status).toBe(201);
    expect(response.body.description).toBe(newRentedItem.description);
  });

  test('GET /api/users/:username/renteditems should return all rented items for a user', async () => {
    const response = await request(app).get('/api/users/alice/renteditems');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('DELETE /api/users/:username/renteditems/:itemId should delete a rented item', async () => {
    const response = await request(app).delete('/api/users/alice/renteditems/2');
    expect(response.status).toBe(200);
    expect(response.body.itemId).toBe(2);
  });
});
