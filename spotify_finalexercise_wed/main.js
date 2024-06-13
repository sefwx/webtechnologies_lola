const SPOTIFY_CLIENT_ID = "67b411e20d594f30bf7a8d3bbde54285";
const SPOTIFY_CLIENT_SECRET = "161fc5e3df004b95af3ba8c62f3eaf54";
const PLAYLIST_ID = "4ESEEfyoQAdPwVQ9jRjGbt";
const container = document.querySelector('div[data-js="tracks"]');

let currentTrackIndex = 0;
let tracksData = [];

function fetchPlaylist(token, playlistId) {
  console.log("token: ", token);

  fetch(`https://api.spotify.com/v1/playlists/${PLAYLIST_ID}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      if (data.tracks && data.tracks.items) {
        tracksData = data.tracks.items;
        displayCurrentTrack(tracksData[currentTrackIndex].track);
        displayNextTracks(tracksData); // Display all tracks
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function displayCurrentTrack(track) {
  const currentTrackContainer = document.querySelector('div[data-js="current"]');
  currentTrackContainer.innerHTML = `
    <img src="${track.album.images[0].url}" alt="${track.album.name}" width="300">
    <div>
      <h2>${track.name}</h2>
      <p>Artist: ${track.artists.map(artist => artist.name).join(', ')}</p>
      <p>Album: ${track.album.name}</p>
    </div>
  `;

  const playerContainer = document.querySelector('div[data-js="player"]');
  playerContainer.innerHTML = `
    <audio controls>
      <source src="${track.preview_url}" type="audio/mpeg">
      Your browser does not support the audio element.
    </audio>
  `;
}

function displayNextTracks(tracks) {
  container.innerHTML = ''; // Clear previous track list
  const ul = document.createElement("ul");

  tracks.forEach((track, index) => {
    const li = document.createElement("li");
    li.classList.add("list-item");
    li.setAttribute("data-index", index); // Set data-index attribute

   li.innerHTML = `
  <span class="artist">Artist: ${track.track.artists.map(artist => artist.name).join(', ')}</span>
  <span class="album">Album: ${track.track.album.name}</span>
  <span class="song">Track: ${track.track.name}</span>
`;
    `;

    // Add click event listener to switch track
    li.addEventListener('click', () => {
      switchTrack(index);
    });

    ul.appendChild(li);

    // Display sidebar tracks for the first two tracks
    if (index === 1) {
      displaySidebarTrack('left-sidebar', track.track, index);
    } else if (index === 2) {
      displaySidebarTrack('right-sidebar', track.track, index);
    }
  });

  container.appendChild(ul);
}

function displaySidebarTrack(side, track, index) {
  const sidebar = document.querySelector(`div[data-js="${side}"]`);
  sidebar.innerHTML = `
    <div class="sidebar-track" data-index="${index}">
      <img src="${track.album.images[0].url}" alt="${track.album.name}">
      <p>${track.name}</p>
      <p>Artist: ${track.artists.map(artist => artist.name).join(', ')}</p>
      <p>Album: ${track.album.name}</p>
    </div>
  `;
  sidebar.addEventListener('click', () => {
    switchTrack(index);
  });
}

function switchTrack(index) {
  if (index >= 0 && index < tracksData.length) {
    currentTrackIndex = index;
    displayCurrentTrack(tracksData[currentTrackIndex].track);
    displayNextTracks(tracksData.slice(currentTrackIndex)); // Update the displayed next tracks
  }
}

function fetchAccessToken() {
  fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `grant_type=client_credentials&client_id=${SPOTIFY_CLIENT_ID}&client_secret=${SPOTIFY_CLIENT_SECRET}`,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (data.access_token) {
        fetchPlaylist(data.access_token, PLAYLIST_ID);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

fetchAccessToken();