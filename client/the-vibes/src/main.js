import { getToken } from './api/spotifyAuth.js';

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const token = await getToken();
        console.log("Spotify API Token:", token);
        // Use the token for fetching additional data if needed
    } catch (error) {
        console.error("Error fetching token:", error);
    }

    const songList = document.getElementById("song-list");
    const searchBar = document.getElementById("search-bar");
    const filterButtons = document.querySelectorAll(".filter-btn");

    let songs = [];

    // Load song data from JSON file
    fetch("songs.json")
        .then(response => response.json())
        .then(data => {
            songs = data.songs;
            displaySongs(songs);
        })
        .catch(error => console.error("Error loading songs:", error));

    // Function to display songs in the list
    function displaySongs(songsToDisplay) {
        songList.innerHTML = "";
        songsToDisplay.forEach(song => {
            const songItem = document.createElement("div");
            songItem.classList.add("song");
            songItem.innerHTML = `
                <span>${song.title} - ${song.artist}</span>
                <button class="downvote-btn" data-id="${song.id}">Downvote</button>
            `;
            songList.appendChild(songItem);
        });
    }

    // Search functionality
    searchBar.addEventListener("input", (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredSongs = songs.filter(song =>
            song.title.toLowerCase().includes(searchTerm) ||
            song.artist.toLowerCase().includes(searchTerm)
        );
        displaySongs(filteredSongs);
    });

    // Filter functionality
    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            const filter = button.getAttribute("data-filter");
            let filteredSongs;

            if (filter === "genres") {
                filteredSongs = songs.filter(song => song.genre === "pop"); // Example genre filter
            } else if (filter === "moods") {
                filteredSongs = songs.filter(song => song.mood === "happy"); // Example mood filter
            } else if (filter === "your-songs") {
                filteredSongs = songs.filter(song => song.favorite);
            } else {
                filteredSongs = songs;
            }
            displaySongs(filteredSongs);
        });
    });

    // Downvote functionality
    songList.addEventListener("click", (e) => {
        if (e.target.classList.contains("downvote-btn")) {
            const songId = e.target.getAttribute("data-id");
            songs = songs.filter(song => song.id !== songId);
            displaySongs(songs);
        }
    });
});

