import React, { useState, useEffect } from "react";
import {getToken} from '../API/spotifyAPI.js'
interface SongProps {
  trackId: string;  // Explicitly define the type for trackId
}

const Song: React.FC<SongProps> = ({ trackId }) => {
  const [artist, setArtist] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);


  const fetchSong = async () => {
    try {
      const token = await getToken();
      const response = await fetch(
        `https://api.spotify.com/v1/artists/${trackId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch song");

      const data = await response.json();
      console.log(data);
      setArtist(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSong();
  }, [trackId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={{ border: "1px solid #ccc", padding: "10px", borderRadius: "8px", maxWidth: "400px" }}>
      {artist && (
        <div>
          <h2>{artist.name}</h2>
          <img 
            src={artist.images[0]?.url} 
            alt={artist.name}
            style={{ height: '200px' }}
          />
          <p>Followers: {artist.followers.total.toLocaleString()}</p>
        </div>
      )}
    </div>
  );
};

export default Song;
