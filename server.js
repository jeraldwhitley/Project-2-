
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 3000;

// Resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Dummy endpoints for login and signup
app.post('/login', (req, res) => {
  // Example: find user in your data store
  // For demo purposes, we're simply returning success
  res.status(200).json({ message: 'Login successful', username: 'John Doe' });
});

app.post('/signup', (req, res) => {
  // Example: create user in your data store
  // For demo purposes, we're simply echoing back the request body as the new user
  res.status(200).json({ message: 'Signup successful', user: req.body });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
