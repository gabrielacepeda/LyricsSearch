const form = document.getElementById("form");
const search = document.getElementById("search");
const result = document.getElementById("result");
const more = document.getElementById("more");

const url = "https://api.lyrics.ovh";

// Search by song or artist
async function searchSongs(term) {
  const res = await fetch(`${url}/suggest/${term}`);
  const data = await res.json();
  showData(data);
  console.log(data);
}
searchSongs();

// show song and artists
function showData(data) {
  let output = "";

  data.data.forEach(song => {
    output += `
    <li>
      <span><strong>${song.artist.name}</strong> - ${song.title}</span>
      <button class="btn" data-artist="${song.artist.name}" 
      data-songtitle="${song.title}">Get Lyrics</button>
      </li>
    `;
  });
  result.innerHTML = `
  <ul class="songs">
  ${data.data
    .map(
      song => `<li>
  <span><strong>${song.artist.name}</strong> - ${song.title}</span>
  <button class="btn" data-artist="${song.artist.name}" 
  data-songtitle="${song.title}">Get Lyrics</button>
  </li>`
    )
    .join("")}
  </ul>
  `;

  if (data.prev || data.next) {
    more.innerHTML = `

  
  ${
    data.prev
      ? `<button class="btn" onclick="getMoreSongs('${data.prev}')">Prev</button>`
      : ""
  }
  ${
    data.next
      ? `<button class="btn" onclick="getMoreSongs('${data.next}')">Next</button>`
      : ""
  }
  `;
  } else {
    more.innerHTML = "";
  }
}

// Get prev and next songs
async function getMoreSongs(url) {
  const res = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
  const data = await res.json();
  showData(data);
}

// get lyrics

async function getLyrics(artist, songTitle) {
  const res = await fetch(`${url}/v1/${artist}/${songTitle}`);
  const data = await res.json();

  const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, "<br>");
  result.innerHTML = `<div class="song-lyrics"><h2 class="song-title">${songTitle}</h2><h3>${artist}</h3>${lyrics}</div>`;
  more.innerHTML = "";
}

async function getAudio(audio) {
  const res = await fetch(`${url}/v1/${artist}/${songTitle}`);
  const data = await res.json();
  audio.play();
}

// Event Listeners
form.addEventListener("submit", e => {
  e.preventDefault();

  const searchTerm = search.value.trim();

  if (!searchTerm) {
    alert("please type in a search term");
  } else {
    searchSongs(searchTerm);
  }
});

// Get Lyrics
result.addEventListener("click", e => {
  const clickedButton = e.target;

  if (clickedButton.tagName === "BUTTON") {
    const artist = clickedButton.getAttribute("data-artist");
    const songTitle = clickedButton.getAttribute("data-songtitle");

    getLyrics(artist, songTitle);
  }
  if (clickedButton.tagName === "AUDIO") {
    const audio = clickedButton.getAttribute("data-audio");

    getAudio(audio);
  }
});
