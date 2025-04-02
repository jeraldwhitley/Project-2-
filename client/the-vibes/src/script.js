// Sample song data (replace this with API data later)
const songData = {
    "genres": {
        "rock": [
            { "title": "Stairway to Heaven", "artist": "Led Zeppelin", "year": 1971 },
            { "title": "Bohemian Rhapsody", "artist": "Queen", "year": 1975 }
        ],
        "pop": [
            { "title": "Billie Jean", "artist": "Michael Jackson", "year": 1982 },
            { "title": "Shake It Off", "artist": "Taylor Swift", "year": 2014 }
        ]
    }
};

// Function to render songs
function renderSongs(filter = "all") {
    const songList = document.getElementById("song-list");
    songList.innerHTML = ""; // Clear existing songs

    Object.keys(songData.genres).forEach(genre => {
        if (filter !== "all" && genre !== filter) return; // Apply filter

        songData.genres[genre].forEach(song => {
            const songCard = document.createElement("div");
            songCard.classList.add("song-card");

            songCard.innerHTML = `
                <h3>${song.title}</h3>
                <p>${song.artist} (${song.year})</p>
                <button class="downvote">Downvote</button>
                <button class="remove">Remove</button>
            `;

            // Add event listener for downvote button
            songCard.querySelector(".downvote").addEventListener("click", () => {
                songCard.remove();
            });

            // Add event listener for remove button
            songCard.querySelector(".remove").addEventListener("click", () => {
                songCard.remove();
            });

            songList.appendChild(songCard);
        });
    });
}

// Search functionality
document.getElementById("search").addEventListener("input", function() {
    const searchTerm = this.value.toLowerCase();
    document.querySelectorAll(".song-card").forEach(card => {
        const title = card.querySelector("h3").textContent.toLowerCase();
        card.style.display = title.includes(searchTerm) ? "block" : "none";
    });
});

// Filter functionality
document.getElementById("filter").addEventListener("change", function() {
    renderSongs(this.value);
});

// Initial render
renderSongs();
