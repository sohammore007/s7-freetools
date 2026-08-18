
// Theme and Toast Logic injected below
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
}
initTheme(); // Run immediately

// Create Toast Container
const toastContainer = document.createElement('div');
toastContainer.className = 'toast-container';
document.addEventListener('DOMContentLoaded', () => {
    document.body.appendChild(toastContainer);
});

window.showToast = function(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = 'toast' + (type === 'error' ? ' error' : '');
    toast.textContent = message;
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        if(toast.parentNode) toast.parentNode.removeChild(toast);
    }, 3000);
};

document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            const isExpanded = menuToggle.classList.contains('active');
            menuToggle.setAttribute('aria-expanded', isExpanded);
        });
    }
});

// Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(err => {
      console.error('SW Registration Failed:', err);
    });
  });
}

// Native Share API
window.shareTool = function() {
    if (navigator.share) {
        navigator.share({
            title: document.title,
            url: window.location.href
        }).catch(err => console.error('Share failed', err));
    } else {
        navigator.clipboard.writeText(window.location.href).then(() => {
            if (typeof showToast === 'function') showToast('Link copied to clipboard!');
        });
    }
};


// Recent Tools Tracker
document.addEventListener('DOMContentLoaded', () => {
    const pageTitle = document.querySelector('h1');
    if (pageTitle) {
        const toolName = pageTitle.textContent;
        // Only track explicit tool pages
        const validTools = [
            '/image-compressor', '/qr-code-generator', '/password-generator', 
            '/word-counter', '/unit-converter', '/age-calculator', 
            '/bmi-calculator', '/cgpa-to-percentage', '/json-formatter', 
            '/text-case-converter', '/emi-calculator', '/gst-calculator',
            '/discount-calculator', '/simple-interest-calculator', 
            '/base64-encoder-decoder', '/color-palette-generator'
        ];
        
        // Remove .html from current path to support both local files and live clean URLs
        const currentPath = window.location.pathname.replace(/\.html$/, '');
        const isTool = validTools.some(path => currentPath.endsWith(path));
        
        if (isTool) {
            let recent = JSON.parse(localStorage.getItem('recentTools') || '[]');
            recent = recent.filter(t => t.name !== toolName);
            recent.unshift({ name: toolName, url: window.location.pathname });
            if (recent.length > 3) recent.pop();
            localStorage.setItem('recentTools', JSON.stringify(recent));
        }
    }

    // Tracking logic only runs once on fresh load
});

// Render Recent Tools on Homepage
function renderRecentlyUsed() {
    const recentContainer = document.getElementById('recentToolsContainer');
    if (recentContainer) {
        recentContainer.innerHTML = ''; // clear existing content
        const recent = JSON.parse(localStorage.getItem('recentTools') || '[]');
        if (recent.length > 0) {
            let html = '<h2 style="font-size: 1.25rem; margin-bottom: 1rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 2px solid var(--border-color); padding-bottom: 0.5rem;">Recently Used</h2>';
            html += '<div style="display: flex; gap: 0.75rem; overflow-x: auto; padding-bottom: 0.5rem; scrollbar-width: none;">';
            recent.forEach(t => {
                html += `<a href="${t.url}" style="white-space: nowrap; padding: 0.5rem 1rem; background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 20px; font-size: 0.9rem; font-weight: 500; color: var(--text-color); transition: all 0.2s ease; text-decoration: none;">${t.name}</a>`;
            });
            html += '</div>';
            recentContainer.innerHTML = html;
        }
    }
}

document.addEventListener('DOMContentLoaded', renderRecentlyUsed);
window.addEventListener('pageshow', renderRecentlyUsed);


// Theme Toggle with SVG icons
const themeToggle = document.getElementById('themeToggle');

function updateThemeIcon() {
    if (!themeToggle) return;
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const sun = themeToggle.querySelector('.sun-icon');
    const moon = themeToggle.querySelector('.moon-icon');
    if (sun && moon) {
        sun.style.display = isDark ? 'block' : 'none';
        moon.style.display = isDark ? 'none' : 'block';
    }
}

// Initial icon setup
updateThemeIcon();

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        if (newTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
        }
        updateThemeIcon();
    });
}

// Fix back/forward cache bug
window.addEventListener('pageshow', (e) => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }
    updateThemeIcon();
});

// Homepage Live Search Filter
document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("toolSearch");
    const noResultsMsg = document.getElementById("noResultsMsg");
    
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            const query = e.target.value.toLowerCase().trim();
            const toolCards = document.querySelectorAll(".tool-card");
            let hasVisible = false;
            
            toolCards.forEach(card => {
                const title = card.querySelector(".tool-card-title")?.textContent.toLowerCase() || "";
                const desc = card.querySelector(".tool-card-desc")?.textContent.toLowerCase() || "";
                
                if (title.includes(query) || desc.includes(query)) {
                    card.style.display = "block"; // or flex depending on CSS, but block works for grid children
                    hasVisible = true;
                } else {
                    card.style.display = "none";
                }
            });
            
            if (noResultsMsg) {
                noResultsMsg.style.display = hasVisible ? "none" : "block";
            }
            
            // Hide empty category headers
            const sections = document.querySelectorAll(".tools-grid");
            sections.forEach(grid => {
                const header = grid.previousElementSibling;
                if (header && header.classList.contains("category-header")) {
                    // Check if any child card is visible
                    const visibleCards = Array.from(grid.children).some(card => card.style.display !== "none");
                    header.style.display = visibleCards ? "block" : "none";
                    grid.style.display = visibleCards ? "grid" : "none"; // Hide empty grids to prevent margin issues
                }
            });
        });
    }
});

