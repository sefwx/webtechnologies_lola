const SPOTIFY_CLIENT_ID = "1d50e930a8b34a4998dc537704793eb2";
const SPOTIFY_CLIENT_SECRET = "b6fbf298ba2141f49f9859341ec742dc";
const PLAYLIST_ID = "4ESEEfyoQAdPwVQ9jRjGbt";
const container = document.querySelector('div[data-js="tracks"]');

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
        data.tracks.items.forEach((item) => {
          console.log(item.track.name);
        });

        addTracksToPage(data.tracks.items);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function addTracksToPage(items) {
  items.forEach((item) => {
    console.log("track: ", item.track);
    const trackElement = document.createElement("div");
    trackElement.classList.add("track-item");

    trackElement.innerHTML = `
      <p class="track-name">${item.track.name}</p>
      <p class="artist-name">by ${item.track.artists.map((artist) => artist.name).join(", ")}</p>
      ${
        item.track.preview_url
          ? `<audio controls src="${item.track.preview_url}"></audio>`
          : "<p>No preview available</p>"
      }
      ${
        item.track.album.images[0]
            ? `<img class="asdf" src="${item.track.album.images[0].url}">`
            : "<p>No Image available</p>"
      }    
        
    `;

    container.appendChild(trackElement);
  });
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
