import React, { useState, useEffect } from 'react';
import './songsuggest.css';

interface Song {
    title: string;
    artist: string;
    albumImage: string;
}

const CLIENT_ID = '8af6542b2cd3449c93103801e10a07f6';
const CLIENT_SECRET = '5e63eea52cd7402696cbcafbfdb4ad5d';

function SongSuggest() {
    const [songs, setSongs] = useState<Song[]>([]);
    const [comments, setComments] = useState<string[]>([]);
    const [newComment, setNewComment] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [category, setCategory] = useState<string>('mood'); // Default to 'mood'
    const [error, setError] = useState<string | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [tokenExpiryTime, setTokenExpiryTime] = useState<number | null>(null);

    // Request an access token using client credentials
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
            setTokenExpiryTime(Date.now() + data.expires_in * 1000); // Set token expiry time
        } else {
            console.error('Failed to get access token');
        }
    };

    // Get the current access token, and refresh if expired
    const getAccessToken = async () => {
        if (accessToken && tokenExpiryTime && Date.now() < tokenExpiryTime) {
            return accessToken; // Return current token if it hasn't expired
        }
        await fetchAccessToken(); // Fetch a new token if expired or doesn't exist
        return accessToken;
    };

    // Shuffle the song array
    const shuffleArray = (array: any[]) => {
        let shuffledArray = [...array];
        for (let i = shuffledArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
        }
        return shuffledArray;
    };

    // Fetch songs from Spotify based on category (mood or genre)
    const fetchSongsFromSpotify = async () => {
        setLoading(true);
    
        let valence = 0.5;  // Default to neutral valence
        let energy = 0.5;   // Default to neutral energy
    
        let url = '';  // Default to empty URL
    
        if (category === 'genre') {
            // If querying by genre, create the search query for genre
            url = `https://api.spotify.com/v1/search?q=genre:${encodeURIComponent(searchQuery)}&type=track&limit=20`;
        }
    
        if (category === 'mood') {
            // Adjust valence and energy based on the mood selected
            if (searchQuery === "happy") {
                valence = 0.7;  // Positive valence for happy mood
                energy = 0.6;   // Medium energy for happy mood
            } else if (searchQuery === "sad") {
                valence = 0.2;  // Low valence for sad mood
                energy = 0.3;   // Low energy for sad mood
            } else if (searchQuery === "angry") {
                valence = 0.3;  // Low valence for angry mood
                energy = 0.8;   // High energy for angry mood
            } else if (searchQuery === "chill") {
                valence = 0.6;  // Medium-high valence for chill mood
                energy = 0.4;   // Low energy for chill mood
            } else {
                setError("Invalid mood. Try happy, sad, angry, or chill.");
                setLoading(false);
                return;
            }
    
            // Construct the URL for mood-based recommendations
            url = `https://api.spotify.com/v1/search?q=genre:pop&target_valence=${valence}&target_energy=${energy}&type=track&limit=20`
        }
    
        if (!url) {
            setError("Please select a valid category and enter a valid search query.");
            setLoading(false);
            return;
        }
    
        try {
            const token = await getAccessToken();
            if (!token) throw new Error('No valid access token found!');
    
            // Log the URL and token to make sure they are correct
            console.log('Making API request with token:', token);
            console.log('Using URL:', url);
    
            const response = await fetch(url, {
                headers: { Authorization: `Bearer ${token}` },
            });
    
            if (!response.ok) throw new Error('Failed to fetch songs from Spotify');
    
            const data = await response.json();
            const tracks = data.tracks.items;
    
            // Shuffle the fetched songs
            const shuffledTracks = shuffleArray(tracks);
    
            const songList = shuffledTracks.map((track: any) => ({
                title: track.name,
                artist: track.artists[0].name,
                albumImage: track.album.images[0].url,
            }));
    
            setSongs(songList);
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error('Error fetching song:', error);
                setError('Error fetching song: ' + error.message); 
            } else {
                console.error('An unknown error occurred', error);
                setError('An unknown error occurred');
            }
            setSongs([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleCategoryChange = (type: string) => {
        setCategory(type);
        setSearchQuery('');  // Clear search query when changing category
    };

    const handleAddComment = () => {
        if (newComment.trim()) {
            setComments([...comments, newComment]);
            setNewComment('');
        }
    };

    useEffect(() => {
        fetchAccessToken(); // Get the access token when the component mounts

        const refreshInterval = setInterval(() => {
            // Refresh the access token if it's close to expiry (e.g., every 55 minutes)
            if (tokenExpiryTime && Date.now() > tokenExpiryTime - 60000) {
                fetchAccessToken();
            }
        }, 60 * 1000); // Check token expiry every 1 minute

        return () => clearInterval(refreshInterval); // Clean up the interval on component unmount
    }, []);

    return (
        <div className="song-suggest-container">
            <h1>What's your vibe?</h1>

            <div className="category-buttons">
                <button onClick={() => handleCategoryChange('mood')}>Mood</button>
                <button onClick={() => handleCategoryChange('genre')}>Genre</button>
            </div>

            <div className="search-bar">
                <input
                    className="search"
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder={`Search for a song by ${category}`}
                />
                <button onClick={fetchSongsFromSpotify}>Search</button>
            </div>

            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div className="song-suggestions-header">
                <h2>Suggested Songs:</h2>
            </div>

            {songs.length > 0 ? (
                <div className="song-list">
                    <ul>
                        {songs.map((song, index) => (
                            <li key={index} className="song-item">
                                <img src={song.albumImage} alt={song.title} className="album-image" />
                                <div>
                                    <h3>{song.title}</h3>
                                    <p>{song.artist}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p>{songs.length === 0 && 'No songs found. Try another search.'}</p>
            )}

            <div className="comment-section">
                <h3>Comments:</h3>
                <ul>
                    {comments.map((comment, index) => (
                        <li key={index}>{comment}</li>
                    ))}
                </ul>
                <div className="add-comment">
                    <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                    />
                    <button onClick={handleAddComment}>Add Comment</button>
                </div>
            </div>
        </div>
    );
}

export default SongSuggest;


