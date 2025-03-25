// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json()); // To parse incoming JSON requests

// Dummy user data (In a real application, you'd get this from a database)
const users = [
  { username: 'user1', password: 'password123' },
  { username: 'user2', password: 'password456' }
];

// POST endpoint for login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Check if user exists and password is correct
  const user = users.find((u) => u.username === username && u.password === password);

  if (user) {
    res.status(200).json({ message: 'Login successful', username: user.username });
  } else {
    res.status(401).json({ message: 'Invalid username or password' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
