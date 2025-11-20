// ============================
// FULL CLEANED script.js
// Portfolio + Featured + Modals + Navigation
// ============================

/* ---------- Navigation ---------- */
function showPage(pageId) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  const target = document.getElementById(pageId);
  if (target) target.classList.add("active");

  document.querySelectorAll(".nav-link, .mobile-nav-link").forEach(l => l.classList.remove("active"));
  const desktop = document.querySelector(`.nav-link[data-page="${pageId}"]`);
  const mobile = document.querySelector(`.mobile-nav-link[data-page="${pageId}"]`);
  if (desktop) desktop.classList.add("active");
  if (mobile) mobile.classList.add("active");
}

document.querySelectorAll(".nav-link").forEach(link =>
  link.addEventListener("click", e => {
    e.preventDefault();
    showPage(link.getAttribute("data-page"));
  })
);

document.querySelectorAll(".mobile-nav-link").forEach(link =>
  link.addEventListener("click", e => {
    e.preventDefault();
    showPage(link.getAttribute("data-page"));
    document.getElementById("mobile-nav")?.classList.remove("active");
    document.getElementById("mobile-menu-btn")?.classList.remove("active");
  })
);

document.getElementById("mobile-menu-btn")?.addEventListener("click", () => {
  document.getElementById("mobile-nav")?.classList.toggle("active");
  document.getElementById("mobile-menu-btn")?.classList.toggle("active");
});


/* ---------- Portfolio Light Modal ---------- */
(function initLightModal() {
  const modalEl = document.getElementById("artwork-modal");
  if (!modalEl) return;

  function closeLightModal() {
    modalEl.classList.remove("active");
    document.body.classList.remove("modal-open"); // re-enable background scroll
  }

  modalEl.querySelectorAll(".modal-close").forEach(btn => btn.addEventListener("click", closeLightModal));
  modalEl.addEventListener("click", e => { if (e.target === modalEl) closeLightModal(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeLightModal(); });

  window.__openLightModal = function openLightModal(art) {
    const m = id => document.getElementById(id);
    m("modal-image").innerHTML = art.image ? `<img src="${art.image}" alt="${art.title}" />` : "";
    m("modal-title").textContent = art.title || "";
    m("modal-artist").textContent = art.artist || "";
    m("modal-size").textContent = art.size || "";
    m("modal-medium").textContent = art.medium || "";
    m("modal-year").textContent = art.year || "";
    m("modal-style").textContent = art.style || "";
    m("modal-description").textContent = art.description || "";

    const modal = document.getElementById("artwork-modal");
    modal.classList.add("active");
    document.body.classList.add("modal-open"); // prevent background scroll

    // Mobile viewport adjustments
    const content = modal.querySelector(".modal-content");
    if (window.innerWidth <= 768) {
      content.style.height = (window.innerHeight - 100) + "px"; // leave navbar space
      content.style.flexDirection = "column";
    } else {
      content.style.height = "auto";
      content.style.flexDirection = "row";
    }
  };
})();


/* ---------- Featured Hover + No Popup ---------- */
(function initFeatured() {
  function initHover() {
    const container = document.getElementById("featured-grid");
    if (!container) return;

    container.querySelectorAll(".artwork-item").forEach(item => {
      const infoBar = item.querySelector(".info-bar");
      const artworkInfo = item.querySelector(".artwork-info");
      const desc = artworkInfo.querySelector(".featured-hover-description");
      if (!desc) return;

      desc.style.display = "none";

      item.addEventListener("mouseenter", () => {
        infoBar.classList.add("hover-active");
        desc.style.display = "block";
      });

      item.addEventListener("mouseleave", () => {
        infoBar.classList.remove("hover-active");
        desc.style.display = "none";
      });
    });
  }

  window.initFeaturedHoverEffect = initHover;
})();


/* ---------- Show Portfolio Detail ---------- */
function showArtworkDetail(artIndex) {
  if (!window.portfolioData || !window.portfolioData[artIndex]) return;
  const art = window.portfolioData[artIndex];
  if (window.__openLightModal) window.__openLightModal(art);
}


/* ---------- Portfolio ---------- */
const ITEMS_PER_PAGE = 16;
let currentPage = 1;
let featuredCurrentPage = 1;

async function loadPortfolio() {
  try {
    const response = await fetch("portfolio_artworks.json");
    if (!response.ok) throw new Error("Failed fetching portfolio_artworks.json");
    const data = await response.json();
    window.portfolioData = data;
    currentPage = 1;
    renderPortfolioPage(currentPage);
  } catch (error) {
    console.error("Error loading portfolio:", error);
  }
}

function renderPortfolioPage(page = 1) {
  if (!window.portfolioData) return;
  const container = document.getElementById("portfolio-grid");
  if (!container) return;
  container.innerHTML = "";

  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const pageItems = window.portfolioData.slice(start, end);

  pageItems.forEach((art, index) => {
    const item = document.createElement("div");
    item.className = "artwork-item";

    item.innerHTML = `
      <img src="${art.image}" alt="${art.title}" />
      <div class="info-bar">
        <div class="artwork-info">
          <h3>${art.title}</h3>
          <p>${art.style}</p>
          <p>${art.size} • ${art.medium}</p>
        </div>
        <button class="read-more-btn">Details</button>
      </div>
    `;

    item.querySelector(".read-more-btn").addEventListener("click", () => 
      showArtworkDetail((page - 1) * ITEMS_PER_PAGE + index)
    );

    container.appendChild(item);
  });

  renderPagination();
}

function renderPagination() {
  const container = document.getElementById("portfolio-pagination");
  if (!container || !window.portfolioData) return;
  container.innerHTML = "";

  const totalPages = Math.ceil(window.portfolioData.length / ITEMS_PER_PAGE);
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.className = `pagination-button ${i === currentPage ? "active" : ""}`;
    btn.textContent = i;
    btn.addEventListener("click", () => {
      currentPage = i;
      renderPortfolioPage(currentPage);
    });
    container.appendChild(btn);
  }
}


/* ---------- Portfolio Filter ---------- */
function applyPortfolioFilter(filter) {
  const container = document.getElementById("portfolio-grid");
  if (!container || !window.portfolioData) return;

  container.innerHTML = "";
  window.portfolioData.forEach((art, index) => {
    if (filter === "available" && !art.available) return;

    const item = document.createElement("div");
    item.className = "artwork-item";

    item.innerHTML = `
      <img src="${art.image}" alt="${art.title}" />
      <div class="info-bar">
        <div class="artwork-info">
          <h3>${art.title}</h3>
          <p>${art.style}</p>
          <p>${art.size} • ${art.medium}</p>
        </div>
        <button class="read-more-btn">Details</button>
      </div>
    `;

    item.querySelector(".read-more-btn").addEventListener("click", () => showArtworkDetail(index));
    container.appendChild(item);
  });
}

document.addEventListener("click", e => {
  if (e.target.classList.contains("filter-btn")) {
    document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
    e.target.classList.add("active");
    const filter = e.target.getAttribute("data-filter");
    applyPortfolioFilter(filter);
  }
});


/* ---------- Featured Artworks ---------- */
async function loadFeaturedArtworks() {
  try {
    const response = await fetch("featured_artworks.json");
    if (!response.ok) throw new Error("Failed fetching featured_artworks.json");
    const data = await response.json();
    window.featuredData = data;
    featuredCurrentPage = 1;
    renderFeaturedPage(featuredCurrentPage);
  } catch (error) {
    console.error("Error loading featured artworks:", error);
  }
}

function renderFeaturedPage(page = 1) {
  if (!window.featuredData) return;
  const container = document.getElementById("featured-grid");
  if (!container) return;
  container.innerHTML = "";

  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const pageItems = window.featuredData.slice(start, end);

  pageItems.forEach(art => {
    const item = document.createElement("div");
    item.className = "artwork-item";

    // Featured card - hover shows description, no popup
    item.innerHTML = `
      <img src="${art.image}" alt="${art.title}" />
      <div class="info-bar">
        <div class="artwork-info">
          <h3>${art.title}</h3>
          <p class="featured-hover-description">${art.description || ""}</p>
        </div>
      </div>
    `;
    container.appendChild(item);
  });

  renderFeaturedPagination();
  initFeaturedHoverEffect();
}

function renderFeaturedPagination() {
  const container = document.getElementById("featured-pagination");
  if (!container || !window.featuredData) return;
  container.innerHTML = "";

  const totalPages = Math.ceil(window.featuredData.length / ITEMS_PER_PAGE);
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.className = `pagination-button ${i === featuredCurrentPage ? "active" : ""}`;
    btn.textContent = i;
    btn.addEventListener("click", () => {
      featuredCurrentPage = i;
      renderFeaturedPage(featuredCurrentPage);
    });
    container.appendChild(btn);
  }
}


/* ---------- Preload Originality Images ---------- */
const originalityImages = [
  'images/handmade.webp',
  'images/uta.webp',
  'images/certificate.webp',
  'images/heritage.webp'
];

originalityImages.forEach(src => { const img = new Image(); img.src = src; });


/* ---------- Initialize ---------- */
document.addEventListener("DOMContentLoaded", () => {
  loadPortfolio();
  loadFeaturedArtworks();
});

document.body.classList.add("modal-open"); // block scroll
document.body.classList.remove("modal-open"); // restore scroll
