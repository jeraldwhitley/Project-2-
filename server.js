import express from 'express';
import cors from 'cors';
import path from 'path';
import mysql from 'mysql2';
import { fileURLToPath } from 'url';

const app = express();
const port = process.env.PORT || 3000;

// Resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// MySQL Database Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "yourpassword", // Change this to your actual MySQL password
    database: "music_app"
});

db.connect(err => {
    if (err) {
        console.error("Database connection failed:", err);
        return;
    }
    console.log("Connected to MySQL database");
});

// Handle Login Request
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Check if user exists in the database
    const query = "SELECT * FROM users WHERE email = ?";
    
    db.query(query, [email], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ success: false, message: "Server error" });
        }

        if (results.length > 0) {
            // User found, allow login (password checking can be added later)
            res.status(200).json({ success: true, redirectUrl: "/main.html" });
        } else {
            // User not found
            res.status(401).json({ success: false, message: "Invalid email or password" });
        }
    });
});

app.listen(port, () => { 
    console.log(`Server listening on port ${port}`);
});

