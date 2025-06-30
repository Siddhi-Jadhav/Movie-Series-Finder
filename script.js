const OMDB_API_KEY = 'Enter Your API';
const YOUTUBE_API_KEY = 'Enter Your API';

async function searchMovie() {
  const query = document.getElementById('searchInput').value.trim();
  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = "🔍 Searching...";

  if (!query) {
    resultDiv.innerHTML = "<p>Please enter a movie or series name.</p>";
    return;
  }

  // Search for all matches
  const searchRes = await fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=${OMDB_API_KEY}`);
  const searchData = await searchRes.json();

  if (searchData.Response !== "True") {
    resultDiv.innerHTML = `<p>❌ No results found.</p>`;
    return;
  }

  // Show a list of results
  let listHTML = `<h2>🔎 Results for "${query}"</h2><ul>`;
  searchData.Search.forEach(item => {
    listHTML += `
      <li onclick="getMovieDetails('${item.imdbID}')">
        <img src="${item.Poster}" alt="${item.Title}" height="100">
        <strong>${item.Title}</strong> (${item.Year})
      </li>`;
  });
  listHTML += "</ul>";

  resultDiv.innerHTML = listHTML;
}

async function getMovieDetails(imdbID) {
  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = "🎬 Loading movie details...";

  const omdbRes = await fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=${OMDB_API_KEY}`);
  const movie = await omdbRes.json();

  const youtubeRes = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(movie.Title + " trailer")}&type=video&key=${YOUTUBE_API_KEY}`
  );
  const youtubeData = await youtubeRes.json();
  const videoId = youtubeData.items[0]?.id?.videoId;
  const trailerLink = videoId ? `https://www.youtube.com/watch?v=${videoId}` : null;

  resultDiv.innerHTML = `
    <div class="clearfix">
      <img src="${movie.Poster}" alt="${movie.Title}" />
      <div>
        <h2>${movie.Title} (${movie.Year})</h2>
        <p><strong>Genre:</strong> ${movie.Genre}</p>
        <p><strong>IMDb Rating:</strong> ${movie.imdbRating}</p>
        <p><strong>Plot:</strong> ${movie.Plot}</p>
        ${trailerLink ? `<p><strong>🎬 Trailer:</strong> <a href="${trailerLink}" target="_blank">Watch on YouTube</a></p>` : ''}
      </div>
    </div>
    <button onclick="searchMovie()">🔙 Back to Results</button>
  `;
}
