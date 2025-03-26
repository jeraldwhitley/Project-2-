import React, { useState, useEffect } from 'react';
import './songsuggest.css';

interface Song {
    title: string;
    artist: string;
}

interface SongResponse {
    song: Song;
    comments: string[];
}

function SongSuggest() {
    const [song, setSong] = useState<Song | null>(null);
    const [comments, setComments] = useState<string[]>([]);
    const [newComment, setNewComment] = useState<string>('');

    const handleSuggest = async (type: string) => {
        setSuggestType(type);
        try {
            const response = await fetch(); // NEED TO INSERT API INFORMATION
            if (response.ok) {
                const data: SongResponse = await response.json(); // NEED TO INSERT JSON
                setSong(data.song);
                setComments(data.comments || []);
            } else {
                console.error('Failed to find song');
                setSong(null);
            }
        } catch (error) {
            console.error('Error finding song:', error);
            setSong(null);
        }
    };
    const handleAddComment = () => {
        if (newComment.trim()) {
            setComments([...comments, newComment]);
            setNewComment(''); // SHOULD WE ALSO SEND COMMENTS TO BACKEND API?
        }
    };
    return (
        <div className="song-suggest-container">
            <h1>Song Suggestion</h1>
            <div className="request-buttons">
                <button onClick={() => handleSuggest('mood')}>Suggest By Mood</button>
                <button onClick={() => handleSuggest('genre')}>Suggest By Genre</button>
            </div>
           
            {song && (
                <div className="song-suggestion"> 
                <h2>Suggested Song:</h2>
                    <p>{song.title} - {song.artist}</p>

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
            )}
        </div>
    );
}

export default SongSuggest;

function setSuggestType(type: string) {
    throw new Error('Function not implemented.');
}

