const API_KEY = 'b2d13de8';
const DEFAULT_MOVIES = ['Avengers', 'Batman', 'Inception', 'Spider-Man', 'Interstellar', 'Matrix'];

let detail = document.getElementById('detail');
let closeBtn = document.getElementById('close');

document.addEventListener('DOMContentLoaded', onPageLoad);

function onPageLoad() {
  setupUserAccountUI();
  setupPageSpecificFeatures();
  setupPopupEvents();
}

function setupUserAccountUI() {
  initAuthUI();
  initAuthFormListeners();
}

function setupPageSpecificFeatures() {
  let isBrowsePage = document.getElementById('movie-grid') !== null;
  let isHomePage = document.querySelector('.movie-rows') !== null;

  if (isBrowsePage) {
    initExplorePage();
  }

  if (isHomePage) {
    initHomePageRows();
  }
}

function setupPopupEvents() {
  if (closeBtn) {
    closeBtn.addEventListener('click', closePopup);
  }
  if (detail) {
    detail.addEventListener('click', handleBackgroundClick);
  }
}

function handleBackgroundClick(event) {
  let clickedOutside = event.target === detail;
  if (clickedOutside) {
    closePopup();
  }
}

function initAuthUI() {
  let currentUser = JSON.parse(localStorage.getItem('currentUser'));

  let signinLink = document.getElementById('signin-link');
  let userMenu = document.getElementById('user-menu');
  let avatarBtn = document.getElementById('avatar-btn');
  let emailDisplay = document.getElementById('user-email-display');
  let dropdownMenu = document.getElementById('dropdown-menu');
  let logoutBtn = document.getElementById('logout-btn');

  if (currentUser) {
    if (signinLink) signinLink.classList.add('hidden');
    if (userMenu) userMenu.classList.remove('hidden');

    if (avatarBtn && currentUser.email) {
      avatarBtn.textContent = currentUser.email.charAt(0).toUpperCase();
    }
    if (emailDisplay && currentUser.email) {
      emailDisplay.textContent = currentUser.email;
    }

    if (avatarBtn && dropdownMenu) {
      avatarBtn.addEventListener('click', () => {
        dropdownMenu.classList.toggle('show');
      });
    }

    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        window.location.reload();
      });
    }
  } else {
    if (signinLink) signinLink.classList.remove('hidden');
    if (userMenu) userMenu.classList.add('hidden');
  }
}

function initAuthFormListeners() {
  let signinForm = document.getElementById('signin-form');
  let signupForm = document.getElementById('signup-form');

  if (signinForm) {
    signinForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let email = document.getElementById('email').value;
      localStorage.setItem('currentUser', JSON.stringify({ email }));
      window.location.href = 'main.html';
    });
  }

  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let email = document.getElementById('signup-email').value;
      localStorage.setItem('currentUser', JSON.stringify({ email }));
      window.location.href = 'main.html';
    });
  }
}

function fetchMoviesByQuery(query) {
  return fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(query)}`)
    .then(response => response.json())
    .then(data => {
      return data.Response === 'True' ? data.Search : [];
    })
    .catch(error => {
      console.error('Error fetching movies:', error);
      return [];
    });
}

function fetchMovieDetails(imdbID) {
  return fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${imdbID}&plot=full`)
    .then(response => response.json())
    .catch(error => {
      console.error('Error fetching movie details:', error);
      return null;
    });
}

async function initExplorePage() {
  let movieGrid = document.getElementById('movie-grid');
  let searchInput = document.getElementById('search-input');

  let initialMovies = await fetchMoviesByQuery('Marvel');
  renderGrid(initialMovies, movieGrid);

  let debounceTimer;
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(async () => {
        let query = e.target.value.trim();
        if (query.length > 2) {
          let results = await fetchMoviesByQuery(query);
          renderGrid(results, movieGrid);
        } else if (query.length === 0) {
          renderGrid(initialMovies, movieGrid);
        }
      }, 400);
    });
  }
}

async function initHomePageRows() {
  let rowsContainer = document.querySelector('.movie-rows');
  if (!rowsContainer) return;

  let categories = [
    { title: 'Trending Now', query: 'Avengers' },
    { title: 'Action Blockbusters', query: 'Batman' },
    { title: 'Sci-Fi Classics', query: 'Star Wars' }
  ];

  rowsContainer.innerHTML = '';

  for (let cat of categories) {
    let movies = await fetchMoviesByQuery(cat.query);
    let rowHTML = `
      <div class="row-container">
        <h2>${cat.title}</h2>
        <div class="movie-row" id="row-${cat.query}">
          ${movies.map(m => createMovieCardHTML(m)).join('')}
        </div>
      </div>
    `;
    rowsContainer.insertAdjacentHTML('beforeend', rowHTML);
  }

  attachCardClickEvents();
}

function renderGrid(movies, container) {
  if (!container) return;
  if (movies.length === 0) {
    container.innerHTML = `<p style="color: #aaa; grid-column: 1/-1;">No movies found.</p>`;
    return;
  }
  container.innerHTML = movies.map(m => createMovieCardHTML(m)).join('');
  attachCardClickEvents();
}

function createMovieCardHTML(movie) {
  let poster = movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Poster';
  return `
    <div class="movie-card" data-id="${movie.imdbID}">
      <img src="${poster}" alt="${movie.Title}" loading="lazy" />
      <div class="movie-card-info">
        <div class="movie-card-title">${movie.Title}</div>
      </div>
    </div>
  `;
}

function attachCardClickEvents() {
  document.querySelectorAll('.movie-card').forEach(card => {
    card.addEventListener('click', async () => {
      let imdbID = card.getAttribute('data-id');
      if (imdbID) openPopup(imdbID);
    });
  });
}

async function openPopup(imdbID) {
  let details = await fetchMovieDetails(imdbID);
  if (!details) return;

  document.getElementById('title').textContent = details.Title;
  document.getElementById('year').textContent = details.Year;
  document.getElementById('type').textContent = details.Genre || 'Movie';
  document.getElementById('rating').textContent = `⭐ IMDb: ${details.imdbRating || 'N/A'}`;
  document.getElementById('plot').textContent = details.Plot;
  document.getElementById('actors').innerHTML = `<strong>Cast:</strong> ${details.Actors}`;

  let hero = document.getElementById('hero');
  if (details.Poster !== 'N/A') {
    hero.style.backgroundImage = `linear-gradient(to top, #181818, transparent), url('${details.Poster}')`;
  } else {
    hero.style.backgroundImage = 'none';
  }

  if (detail) detail.classList.add('active');
}

function closePopup() {
  if (detail) detail.classList.remove('active');
}