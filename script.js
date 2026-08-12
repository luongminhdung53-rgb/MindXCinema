// ==========================================================
// 1. STATIC HERO DATA & TEMPLATE RENDERER
// ==========================================================
let movieData = {
    title: "Space Cadet",
    description: 'Tiffany "Rex" Simpson has always dreamed of going to space, and her "doctored" application lands her in NASA\'s ultra-competitive astronaut training program. In over her head, can this Florida girl rely on her quick wits, moxie and determination...',
    watchUrl: "#watch-now-player",
    infoUrl: "#more-info-details",
    
    // Image assets paths
    backdropImageUrl: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1200",
    posterImageUrl: "" // Leave blank to fallback to stylized CSS card design
};

function renderTemplate(data) {
    const movieTitle = document.getElementById('movieTitle');
    const posterTitle = document.getElementById('posterTitle');
    const movieDescription = document.getElementById('movieDescription');
    const watchLink = document.getElementById('watchLink');
    const infoLink = document.getElementById('infoLink');
    const hero = document.getElementById('heroContainer');
    const poster = document.getElementById('posterCard');

    if (movieTitle) movieTitle.textContent = data.title;
    if (posterTitle) posterTitle.textContent = data.title;
    if (movieDescription) movieDescription.textContent = data.description;
    
    document.title = `MindX Cinema - ${data.title}`;

    if (watchLink) watchLink.setAttribute('href', data.watchUrl);
    if (infoLink) infoLink.setAttribute('href', data.infoUrl);

    if (hero) {
        hero.style.backgroundImage = `linear-gradient(to right, rgba(11, 17, 30, 0.95) 30%, rgba(11, 17, 30, 0.6) 60%, rgba(11, 17, 30, 0.4)), url('${data.backdropImageUrl}')`;
    }

    if (poster && data.posterImageUrl) {
        poster.style.backgroundImage = `url('${data.posterImageUrl}')`;
        if (posterTitle) posterTitle.style.display = 'none';
    }
}

// ==========================================================
// 2. CONFIGURATION & GLOBAL AUTHENTICATION STATE
// ==========================================================
const API_KEY = 'trilogy'; // Free OMDb API key
const BASE_URL = 'https://www.omdbapi.com/';

let currentUser = JSON.parse(localStorage.getItem('mindx_user')) || null;

// ==========================================================
// 3. CORE INITIALIZATION
// ==========================================================
document.addEventListener('DOMContentLoaded', () => {
    // Render initial static template assets if present
    if (document.getElementById('heroContainer')) {
        renderTemplate(movieData);
    }

    setupNavbarScroll();
    updateAuthStatusUI();

    // Page-specific initialization handlers
    if (document.getElementById('trending-row')) {
        initHomePage();
    }
    
    if (document.getElementById('movie-grid')) {
        initMoviesPage();
    }

    if (document.getElementById('login-form')) {
        initLoginForm();
    }

    if (document.getElementById('signup-form') || document.getElementById('signupForm')) {
        initSignUpForm();
    }

    // Modal listeners
    const detailModal = document.getElementById('detail-modal');
    const modalCloseBtn = document.getElementById('modal-close');
    if (detailModal && modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal);
        detailModal.addEventListener('click', (e) => {
            if (e.target === detailModal) closeModal();
        });
    }
});

// ==========================================================
// 4. AUTHENTICATION & UI LOGIC
// ==========================================================
function updateAuthStatusUI() {
    const userDisplay = document.getElementById('user-display');
    const authBtn = document.getElementById('auth-btn');

    if (!authBtn) return;

    if (currentUser) {
        if (userDisplay) userDisplay.textContent = `Welcome, ${currentUser.email.split('@')[0]}`;
        authBtn.textContent = 'Sign Out';
        authBtn.href = '#';
        authBtn.onclick = (e) => {
            e.preventDefault();
            logout();
        };
    } else {
        if (userDisplay) userDisplay.textContent = '';
        authBtn.textContent = 'Sign In';
        authBtn.href = 'signin.html';
        authBtn.onclick = null;
    }
}

function logout() {
    localStorage.removeItem('mindx_user');
    currentUser = null;
    window.location.href = 'index.html';
}

function initLoginForm() {
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('signin-email').value;
        const password = document.getElementById('signin-password').value;

        const users = JSON.parse(localStorage.getItem('mindx_users_db')) || [];
        const validUser = users.find(u => u.email === email && u.password === password);

        if (!validUser) {
            alert('Invalid email or password.');
            return;
        }

        localStorage.setItem('mindx_user', JSON.stringify(validUser));
        window.location.href = 'index.html';
    });
}

function initSignUpForm() {
    const signupForm = document.getElementById('signup-form') || document.getElementById('signupForm');
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = document.getElementById('signup-email') || document.getElementById('email');
        const passwordInput = document.getElementById('signup-password') || document.getElementById('password');

        const email = emailInput ? emailInput.value : '';
        const password = passwordInput ? passwordInput.value : '';

        if (!email || !password) {
            alert('Please enter a valid email and password.');
            return;
        }

        const users = JSON.parse(localStorage.getItem('mindx_users_db')) || [];
        const userExists = users.some(u => u.email === email);

        if (userExists) {
            alert('An account with this email already exists.');
            return;
        }

        const newUser = { email, password };
        users.push(newUser);
        localStorage.setItem('mindx_users_db', JSON.stringify(users));
        localStorage.setItem('mindx_user', JSON.stringify(newUser));

        alert('Account created successfully!');
        window.location.href = 'index.html';
    });
}

// ==========================================================
// 5. MOVIES API & BANNER LOGIC
// ==========================================================
function initHomePage() {
    fetchRowMovies('Avenger', document.getElementById('trending-row'));
    fetchRowMovies('Batman', document.getElementById('action-row'));
    
    if (document.getElementById('hero-banner')) {
        loadHeroBanner('tt0848228'); // Avengers hero banner
    }
}

async function loadHeroBanner(imdbID) {
    try {
        const res = await fetch(`${BASE_URL}?i=${imdbID}&plot=full&apikey=${API_KEY}`);
        const movie = await res.json();
        
        const heroBanner = document.getElementById('hero-banner');
        const heroTitle = document.getElementById('hero-title');
        const heroOverview = document.getElementById('hero-overview');
        const heroInfoBtn = document.getElementById('hero-info-btn');

        if (heroBanner) heroBanner.style.backgroundImage = `url(${movie.Poster})`;
        if (heroTitle) heroTitle.textContent = movie.Title;
        if (heroOverview) heroOverview.textContent = movie.Plot;
        if (heroInfoBtn) heroInfoBtn.onclick = () => openDetailModal(imdbID);
    } catch (err) {
        console.error('Error loading hero banner:', err);
    }
}

function initMoviesPage() {
    const gridContainer = document.getElementById('movie-grid');
    const searchInput = document.getElementById('search-input');

    fetchGridMovies('Marvel', gridContainer);

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            if (query.length > 2) {
                fetchGridMovies(query, gridContainer);
            }
        });
    }
}

async function fetchRowMovies(query, container) {
    if (!container) return;
    try {
        const res = await fetch(`${BASE_URL}?s=${query}&apikey=${API_KEY}`);
        const data = await res.json();
        if (data.Search) {
            container.innerHTML = '';
            data.Search.forEach(movie => {
                container.appendChild(createMovieCard(movie));
            });
        }
    } catch (err) {
        console.error('Error fetching row movies:', err);
    }
}

async function fetchGridMovies(query, container) {
    if (!container) return;
    try {
        const res = await fetch(`${BASE_URL}?s=${query}&apikey=${API_KEY}`);
        const data = await res.json();
        if (data.Search) {
            container.innerHTML = '';
            data.Search.forEach(movie => {
                container.appendChild(createMovieCard(movie));
            });
        }
    } catch (err) {
        console.error('Error fetching grid movies:', err);
    }
}

function createMovieCard(movie) {
    const card = document.createElement('div');
    card.className = 'movie-card';
    
    const poster = movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/160x240?text=No+Poster';
    
    card.innerHTML = `
        <img src="${poster}" alt="${movie.Title}">
        <div class="movie-card-info">
            <div class="movie-card-title">${movie.Title}</div>
        </div>
    `;

    card.addEventListener('click', () => openDetailModal(movie.imdbID));
    return card;
}

// ==========================================================
// 6. DETAIL MODAL & NAVIGATION HELPERS
// ==========================================================
async function openDetailModal(imdbID) {
    const detailModal = document.getElementById('detail-modal');
    if (!detailModal) return;

    try {
        const res = await fetch(`${BASE_URL}?i=${imdbID}&plot=full&apikey=${API_KEY}`);
        const movie = await res.json();

        document.getElementById('modal-hero').style.backgroundImage = `url(${movie.Poster !== 'N/A' ? movie.Poster : ''})`;
        document.getElementById('modal-title').textContent = movie.Title;
        document.getElementById('modal-year').textContent = movie.Year;
        document.getElementById('modal-type').textContent = movie.Type ? movie.Type.toUpperCase() : 'MOVIE';
        document.getElementById('modal-rating').textContent = `⭐ IMDb: ${movie.imdbRating}`;
        document.getElementById('modal-plot').textContent = movie.Plot;
        document.getElementById('modal-actors').innerHTML = `<strong>Cast:</strong> ${movie.Actors}`;

        detailModal.classList.add('active');
    } catch (err) {
        console.error('Error fetching movie details:', err);
    }
}

function closeModal() {
    const detailModal = document.getElementById('detail-modal');
    if (detailModal) {
        detailModal.classList.remove('active');
    }
}

function setupNavbarScroll() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}