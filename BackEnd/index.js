const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/users');
const clothesRoutes = require('./routes/clothes');
const rentalsRoutes = require('./routes/rentals');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/users', userRoutes);
app.use('/clothes', clothesRoutes);
app.use('/rentals', rentalsRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
