// ============================
// CLEANED & MERGED script.js
// - Portfolio items now loaded from JSON
// - Artwork details stored in JSON
// - No CSS changes, no extra features
// ============================

/* ---------- Navigation ---------- */
function showPage(pageId) {
  document.querySelectorAll(".page").forEach((p) => p.classList.remove("active"));
  const target = document.getElementById(pageId);
  if (target) target.classList.add("active");

  document.querySelectorAll(".nav-link, .mobile-nav-link").forEach((l) => l.classList.remove("active"));
  const desktop = document.querySelector(`.nav-link[data-page="${pageId}"]`);
  const mobile = document.querySelector(`.mobile-nav-link[data-page="${pageId}"]`);
  if (desktop) desktop.classList.add("active");
  if (mobile) mobile.classList.add("active");
}

document.querySelectorAll(".nav-link").forEach((link) =>
  link.addEventListener("click", (e) => {
    e.preventDefault();
    showPage(link.getAttribute("data-page"));
  })
);

document.querySelectorAll(".mobile-nav-link").forEach((link) =>
  link.addEventListener("click", (e) => {
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

/* ---------- Light Modal ---------- */
(function initLightModal() {
  const modalEl = document.getElementById("artwork-modal");
  if (!modalEl) return;

  // Close modal
  function closeLightModal() {
    modalEl.classList.remove("active");
  }

  modalEl.querySelectorAll(".modal-close").forEach(btn => btn.addEventListener("click", closeLightModal));
  modalEl.addEventListener("click", (e) => { if (e.target === modalEl) closeLightModal(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLightModal(); });

  window.__openLightModal = function openLightModal(art) {
    const m = (id) => document.getElementById(id);
    m("modal-image").innerHTML = art.image ? `<img src="${art.image}" alt="${art.title}" style="width:100%;height:auto;" />` : "";
    m("modal-title").textContent = art.title || "";
    m("modal-artist").textContent = art.artist || "";
    m("modal-size").textContent = art.size || "";
    m("modal-medium").textContent = art.medium || "";
    m("modal-year").textContent = art.year || "";
    m("modal-style").textContent = art.style || "";
    m("modal-description").textContent = art.description || "";
    modalEl.classList.add("active");
  };
})();

/* ---------- Show Artwork Detail ---------- */
function showArtworkDetail(artIndex) {
  if (!window.portfolioData || !window.portfolioData[artIndex]) return;
  const art = window.portfolioData[artIndex];
  if (window.__openLightModal) window.__openLightModal(art);
}

/* ---------- Load Portfolio Items ---------- */
async function loadPortfolio() {
  try {
    const response = await fetch("portfolio_artworks.json");
    if (!response.ok) throw new Error("Failed fetching portfolio_artworks.json");
    const data = await response.json();
    window.portfolioData = data; // store globally for modal access

    const container = document.getElementById("portfolio-grid");
    if (!container) return;
    container.innerHTML = "";

    data.forEach((art, index) => {
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

      const btn = item.querySelector(".read-more-btn");
      btn.addEventListener("click", () => showArtworkDetail(index));

      container.appendChild(item);
    });
  } catch (error) {
    console.error("Error loading portfolio:", error);
  }
}

/* ---------- Load Featured Artworks (unchanged) ---------- */
async function loadFeaturedArtworks() {
  try {
    const response = await fetch("featured_artworks.json");
    if (!response.ok) throw new Error("Failed fetching featured_artworks.json");
    const artworks = await response.json();
    const container = document.getElementById("featured-artworks");
    if (!container) return;
    container.innerHTML = "";

    artworks.forEach((art) => {
      const item = document.createElement("div");
      item.className = "banner-item";

      item.innerHTML = `
        <div class="banner-image" style="${art.bg ? `background:${art.bg};` : ''} background-size:cover; background-position:center;">
          ${art.image ? `<img src="${art.image}" alt="${art.title}" class="banner-svg" />` : ""}
        </div>
        <div class="banner-overlay">
          <h3 class="banner-title">${art.title}</h3>
          <p class="banner-subtitle">${art.description}</p>
        </div>
      `;

      item.addEventListener("click", (e) => {
        e.preventDefault();
        const payload = {
          image: art.image || null,
          title: art.title || "",
          description: art.description || ""
        };
        if (window.__openDarkModal) window.__openDarkModal(payload);
      });

      container.appendChild(item);
    });
  } catch (error) {
    console.error("Error loading featured artworks:", error);
  }
}

/* ---------- Dark Modal (unchanged) ---------- */
(function initDarkModal() {
  if (document.body.querySelector(".dark-modal")) return;
  const dark = document.createElement("div");
  dark.className = "dark-modal";
  dark.innerHTML = `
    <div class="dark-modal-content">
      <div class="dark-modal-inner">
        <div class="dark-modal-image" id="dark-modal-image"></div>
        <div class="dark-modal-details">
          <h3 id="dark-modal-title"></h3>
          <p id="dark-modal-description"></p>
        </div>
      </div>
      <div class="dark-modal-close" data-dark-close>×</div>
    </div>
  `;
  document.body.appendChild(dark);

  function closeDark() { dark.classList.remove("active"); }
  dark.querySelectorAll("[data-dark-close]").forEach(btn => btn.addEventListener("click", closeDark));
  dark.addEventListener("click", (e) => { if (e.target === dark) closeDark(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeDark(); });

  window.__openDarkModal = function openDarkModal(payload) {
    const imgContainer = document.getElementById("dark-modal-image");
    const t = document.getElementById("dark-modal-title");
    const d = document.getElementById("dark-modal-description");

    imgContainer.innerHTML = payload.image ? `<img src="${payload.image}" alt="${payload.title}" style="width:100%;height:auto;" />` : "";
    t.textContent = payload.title || "";
    d.textContent = payload.description || "";
    dark.classList.add("active");
  };
})();

/* ---------- Initialize on DOMContentLoaded ---------- */
document.addEventListener("DOMContentLoaded", () => {
  loadPortfolio();
  loadFeaturedArtworks();
});


/* ---------- Portfolio Filter ---------- */
function applyPortfolioFilter(filter) {
  const container = document.getElementById("portfolio-grid");
  if (!container || !window.portfolioData) return;

  // Show/hide items based on filter
  container.innerHTML = "";
  window.portfolioData.forEach((art, index) => {
    if (filter === "available" && !art.available) return; // skip unavailable

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

/* Filter button click */
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("filter-btn")) {
    document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
    e.target.classList.add("active");
    const filter = e.target.getAttribute("data-filter");
    applyPortfolioFilter(filter);
  }
});


const ITEMS_PER_PAGE = 16; // 16 images per page
let currentPage = 1;

function renderPortfolioPage(page = 1) {
    if (!window.portfolioData) return;
    const container = document.getElementById("portfolio-grid");
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

        const btn = item.querySelector(".read-more-btn");
        btn.addEventListener("click", () => showArtworkDetail((page - 1) * ITEMS_PER_PAGE + index));

        container.appendChild(item);
    });

    renderPagination();
}

function renderPagination() {
    const container = document.getElementById("portfolio-pagination");
    container.innerHTML = "";

    if (!window.portfolioData) return;
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

// Update loadPortfolio to use pagination
async function loadPortfolio() {
    try {
        const response = await fetch("portfolio_artworks.json");
        if (!response.ok) throw new Error("Failed fetching portfolio_artworks.json");
        const data = await response.json();
        window.portfolioData = data; // store globally for modal access

        currentPage = 1;
        renderPortfolioPage(currentPage);
    } catch (error) {
        console.error("Error loading portfolio:", error);
    }
}

const originalityImages = [
    'images/handmade.webp',
    'images/uta.webp',
    'images/certificate.webp',
    'images/heritage.webp'
  ];

  originalityImages.forEach(src => {
    const img = new Image();
    img.src = src;
  });