import express from 'express';
import { Pool } from 'pg';
import cors from 'cors';

const app = express();
const pool = new Pool({ connectionString: 'your_database_url' });

app.use(cors());
app.use(express.json());

// Fetch comments for a song
app.get('/comments/:songTitle', async (req, res) => {
    try {
        const { songTitle } = req.params;
        const result = await pool.query('SELECT * FROM comments WHERE song_title = $1', [songTitle]);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add a new comment
app.post('/comments', async (req, res) => {
    try {
        const { songTitle, comment } = req.body;
        await pool.query('INSERT INTO comments (song_title, comment) VALUES ($1, $2)', [songTitle, comment]);
        res.status(201).json({ message: 'Comment added' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(5000, () => console.log('Server running on port 5000'));
