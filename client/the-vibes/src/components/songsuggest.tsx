// import React, { useState, useEffect } from 'react';
// import './songsuggest.css';

// interface Song {
//     title: string;
//     artist: string;
// }

// interface SongResponse {
//     song: Song;
//     comments: string[];
// }

// function SongSuggest() {
//     const [song, setSong] = useState<Song | null>(null);
//     const [comments, setComments] = useState<string[]>([]);
//     const [newComment, setNewComment] = useState<string>('');

//     const handleSuggest = async (type: string) => {
//         setSuggestType(type);
//         try {
//             const response = await fetch(); // NEED TO INSERT API INFORMATION
//             if (response.ok) {
//                 const data: SongResponse = await response.json(); // NEED TO INSERT JSON
//                 setSong(data.song);
//                 setComments(data.comments || []);
//             } else {
//                 console.error('Failed to find song');
//                 setSong(null);
//             }
//         } catch (error) {
//             console.error('Error finding song:', error);
//             setSong(null);
//         }
//     };
//     const handleAddComment = () => {
//         if (newComment.trim()) {
//             setComments([...comments, newComment]);
//             setNewComment(''); // SHOULD WE ALSO SEND COMMENTS TO BACKEND API?
//         }
//     };
//     return (
//         <div className="song-suggest-container">
//             <h1>Song Suggestion</h1>
//             <div className="request-buttons">
//                 <button onClick={() => handleSuggest('mood')}>Suggest By Mood</button>
//                 <button onClick={() => handleSuggest('genre')}>Suggest By Genre</button>
//             </div>
           
//             {song && (
//                 <div className="song-suggestion"> 
//                 <h2>Suggested Song:</h2>
//                     <p>{song.title} - {song.artist}</p>

//                     <div className="comment-section">
//                         <h3>Comments:</h3>
//                         <ul>
//                             {comments.map((comment, index) => (
//                                 <li key={index}>{comment}</li>
//                             ))}
//                         </ul>
//                         <div className="add-comment">
//                             <input 
//                             type="text"
//                             value={newComment}
//                             onChange={(e) => setNewComment(e.target.value)}
//                             placeholder="Add a comment..."
//                             />
//                             <button onClick={handleAddComment}>Add Comment</button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }

// export default SongSuggest;

// function setSuggestType(type: string) {
//     throw new Error('Function not implemented.');
// }

import { useState } from 'react';
import './songsuggest.css';

interface Song {
    title: string;
    artist: string;
    albumImage: string;
}

function SongSuggest() {
    const [songs, setSongs] = useState<Song[]>([]); // A list of suggested songs
    const [comments, setComments] = useState<string[]>([]);
    const [newComment, setNewComment] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [category, setCategory] = useState<string>('mood');
    const [error, setError] = useState<string | null>(null);

    // Directly defined Spotify Access Token
    const SPOTIFY_ACCESS_TOKEN = 'BQBh6jOZ0ZoXP5BlFaANckXqEDpj6peb00QugAKyp8wtKwJUe9mBA38XfrhXo9hrxK5GZcaGrtQFFYQ_1nBbfnMnAD6XdAyjQ3k9te9vJ4-FJve7-DaydH0DGJOxhelnPbugLVPfONI'; // Replace with your token

    if (!SPOTIFY_ACCESS_TOKEN) {
        console.error("Spotify Access Token not found.");
        return null;
    }

    const fetchSongsFromSpotify = async () => {
        setLoading(true);
        const query = searchQuery || (category === "mood" ? "chill" : "pop");
        const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=5`; // Increase limit to get more songs

        try {
            const response = await fetch(url, {
                headers: { Authorization: `Bearer ${SPOTIFY_ACCESS_TOKEN}` },
            });

            if (!response.ok) throw new Error("Failed to fetch songs from Spotify");

            const data = await response.json();
            const tracks = data.tracks.items;

            // Map through the tracks to create a list of songs with title, artist, and album image
            const songList = tracks.map((track: any) => ({
                title: track.name,
                artist: track.artists[0].name,
                albumImage: track.album.images[0].url, // Get the first image (usually the album cover)
            }));

            setSongs(songList);
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("Error fetching song:", error);
                setError("Error fetching song: " + error.message); // Set error state
            } else {
                console.error("An unknown error occurred", error);
                setError("An unknown error occurred");
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
        setSearchQuery('');
    };

    const handleAddComment = () => {
        if (newComment.trim()) {
            setComments([...comments, newComment]);
            setNewComment('');
        }
    };

    return (
        <div className="song-suggest-container">
            <h1>Song Suggestion</h1>

            <div className="category-buttons">
                <button onClick={() => handleCategoryChange('mood')}>Mood</button>
                <button onClick={() => handleCategoryChange('genre')}>Genre</button>
            </div>

            <div className="search-bar">
                <input
                    className= "search"
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder={`Search for a song by ${category}`}
                />
                <button onClick={fetchSongsFromSpotify}>Search</button>
            </div>

            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* Display the list of suggested songs with images */}
            {songs.length > 0 ? (
                <div className="song-list">
                    <h2>Suggested Songs:</h2>
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
                <p>{songs.length === 0 && "No songs found. Try another search."}</p>
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
