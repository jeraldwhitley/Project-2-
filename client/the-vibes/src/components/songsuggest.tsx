import { useState, useEffect } from 'react';
import './songsuggest.css';

interface Song {
    title: string;
    artist: string;
    albumImage: string;
}

interface Comment {
    id: number;
    songTitle: string;
    text: string;
}

const CLIENT_ID = '8af6542b2cd3449c93103801e10a07f6';
const CLIENT_SECRET = '5e63eea52cd7402696cbcafbfdb4ad5d';
const API_URL = 'http://localhost:5000';

function SongSuggest() {
    const [songs, setSongs] = useState<Song[]>([]);
    const [comments, setComments] = useState<{ [key: string]: Comment[] }>({});
    const [newComment, setNewComment] = useState<{ [key: string]: string }>({});
    const [showComments, setShowComments] = useState<{ [key: string]: boolean }>({});
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [category, setCategory] = useState<string>('mood');
    const [error, setError] = useState<string | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [tokenExpiryTime, setTokenExpiryTime] = useState<number | null>(null);

    // Fetch access token from Spotify API
    const fetchAccessToken = async () => {
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`,
            },
            body: 'grant_type=client_credentials',
        });
        const data = await response.json();
        if (data.access_token) {
            setAccessToken(data.access_token);
            setTokenExpiryTime(Date.now() + data.expires_in * 1000);
        } else {
            console.error('Failed to get access token');
        }
    };

    const getAccessToken = async () => {
        if (accessToken && tokenExpiryTime && Date.now() < tokenExpiryTime) {
            return accessToken;
        }
        await fetchAccessToken();
        return accessToken;
    };

    // Shuffle songs randomly
    const shuffleArray = (array: any[]) => {
        return array.sort(() => Math.random() - 0.5);
    };

    // Fetch songs from Spotify
    const fetchSongsFromSpotify = async () => {
        setLoading(true);
        let valence = 0.5, energy = 0.5;
        let url = '';

        if (category === 'genre') {
            url = `https://api.spotify.com/v1/search?q=genre:${encodeURIComponent(searchQuery)}&type=track&limit=20`;
        }

        if (category === 'mood') {
            if (searchQuery === "happy") { valence = 0.7; energy = 0.6; }
            else if (searchQuery === "sad") { valence = 0.2; energy = 0.3; }
            else if (searchQuery === "angry") { valence = 0.3; energy = 0.8; }
            else if (searchQuery === "chill") { valence = 0.6; energy = 0.4; }
            else {
                setError("Invalid mood. Try happy, sad, angry, or chill.");
                setLoading(false);
                return;
            }
            url = `https://api.spotify.com/v1/search?q=genre:pop&target_valence=${valence}&target_energy=${energy}&type=track&limit=20`;
        }

        if (!url) {
            setError("Please select a valid category and enter a valid search query.");
            setLoading(false);
            return;
        }

        try {
            const token = await getAccessToken();
            if (!token) throw new Error('No valid access token found!');

            const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
            if (!response.ok) throw new Error('Failed to fetch songs from Spotify');

            const data = await response.json();
            const shuffledTracks = shuffleArray(data.tracks.items);

            const songList = shuffledTracks.map((track: any) => ({
                title: track.name,
                artist: track.artists[0].name,
                albumImage: track.album.images[0].url,
            }));

            setSongs(songList);
        } catch (error: unknown) {
            setError(error instanceof Error ? error.message : 'An unknown error occurred');
            setSongs([]);
        } finally {
            setLoading(false);
        }
    };

    // Fetch comments for a specific song
    const fetchComments = async (songTitle: string) => {
        try {
            const response = await fetch(`${API_URL}/comments/${encodeURIComponent(songTitle)}`);
            const data = await response.json();
            setComments((prev) => ({ ...prev, [songTitle]: data }));
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    // Handle adding a comment
    // Handle adding a comment
    const handleAddComment = async (songTitle: string) => {
        if (!newComment[songTitle]?.trim()) return;

        try {
            // Send the comment to the server
            const response = await fetch(`${API_URL}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ songTitle, comment: newComment[songTitle] }),
            });

            if (response.ok) {
                // Directly update the local comments state
                const newCommentObj: Comment = {
                    id: Date.now(),
                    songTitle,
                    text: newComment[songTitle],
                };

                // Update comments for the current song
                setComments((prev) => ({
                    ...prev,
                    [songTitle]: [...(prev[songTitle] || []), newCommentObj], // Add the new comment to the song's comment array
                }));

                // Clear the input field for the new comment
                setNewComment((prev) => ({ ...prev, [songTitle]: '' }));
            }
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };


    // Toggle visibility of comments
    const toggleComments = (songTitle: string) => {
        setShowComments((prev) => ({
            ...prev,
            [songTitle]: !prev[songTitle],
        }));
    };

    // Initialize Spotify access token and refresh interval
    useEffect(() => {
        fetchAccessToken();
        const refreshInterval = setInterval(() => {
            if (tokenExpiryTime && Date.now() > tokenExpiryTime - 60000) {
                fetchAccessToken();
            }
        }, 60 * 1000);
        return () => clearInterval(refreshInterval);
    }, []);

    // Fetch comments for each song when songs are updated
    useEffect(() => {
        songs.forEach((song) => fetchComments(song.title));
    }, [songs]);

    return (
        <div className="song-suggest-container">
            <h1>What's your vibe?</h1>

            <div className="category-buttons">
                <button onClick={() => setCategory('mood')}>Mood</button>
                <button onClick={() => setCategory('genre')}>Genre</button>
            </div>

            <div className="search-bar">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={`Search for a song by ${category}`}
                />
                <button onClick={fetchSongsFromSpotify}>Search</button>
            </div>

            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div className="song-list">
                {songs.map((song) => (
                    <div key={song.title} className="song-item">
                        <img src={song.albumImage} alt={song.title} className="album-image" />
                        <div>
                            <h3>{song.title}</h3>
                            <p>{song.artist}</p>
                        </div>

                        <button onClick={() => toggleComments(song.title)}>
                            {showComments[song.title] ? 'Hide Comments' : 'Show Comments'}
                        </button>

                        {showComments[song.title] && (
                            <div className="comment-section">
                                <ul>
                                    {comments[song.title]?.map((comment) => (
                                        <li key={comment.id}>{comment.text}</li>
                                    ))}
                                </ul>
                                <input
                                    type="text"
                                    value={newComment[song.title] || ''}
                                    onChange={(e) =>
                                        setNewComment((prev) => ({ ...prev, [song.title]: e.target.value }))
                                    }
                                    placeholder="Add a comment..."
                                />
                                <button onClick={() => handleAddComment(song.title)}>Add Comment</button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SongSuggest;
