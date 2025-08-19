// Main JavaScript file for academic website
// Handles theme switching, data loading, and interactive features

class AcademicSite {
    constructor() {
        this.data = {
            site: null,
            publications: null,
            news: null
        };
        this.init();
    }

    async init() {
        this.setupTheme();
        await this.loadData();
        this.setupEventListeners();
        this.renderContent();
    }

    // Theme Management
    setupTheme() {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
        } else if (prefersDark) {
            document.documentElement.setAttribute('data-theme', 'dark');
        }

        this.updateThemeToggle();
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        this.updateThemeToggle();
    }

    updateThemeToggle() {
        const toggle = document.querySelector('.theme-toggle-icon');
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        
        if (toggle) {
            toggle.textContent = isDark ? '☀️' : '🌙';
        }
    }

    // Data Loading
    async loadData() {
        try {
            console.log('Starting data load...');
            const basePath = window.location.pathname.includes('/pages/') ? '../' : '';
            const [siteData, publicationsData, newsData] = await Promise.all([
                this.fetchJSON(basePath + 'data/site.json'),
                this.fetchJSON(basePath + 'data/publications.json'),
                this.fetchJSON(basePath + 'data/news.json')
            ]);

            this.data.site = siteData;
            this.data.publications = publicationsData;
            this.data.news = newsData;
            
            console.log('Data loaded successfully:', {
                site: !!siteData,
                publications: !!publicationsData,
                news: !!newsData
            });
            console.log('Publications count:', publicationsData ? publicationsData.length : 0);
        } catch (error) {
            console.error('Error loading data:', error);
        }
    }

    async fetchJSON(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Error fetching ${url}:`, error);
            return null;
        }
    }

    // Content Rendering
    renderContent() {
        this.renderPersonalInfo();
        this.renderAbout();
        this.renderInterests();
        this.renderNews();
        this.renderSelectedPublications();
    }

    renderPersonalInfo() {
        console.log('renderPersonalInfo called');
        if (!this.data.site) {
            console.log('No site data available');
            return;
        }

        console.log('Site data:', this.data.site);

        // Update navigation brand
        const navBrand = document.getElementById('nav-brand-name');
        if (navBrand) {
            console.log('Updating nav brand to:', this.data.site.name);
            navBrand.textContent = this.data.site.name;
        } else {
            console.log('nav-brand-name element not found');
        }

        // Update hero section
        const heroName = document.getElementById('hero-name');
        const heroTitle = document.getElementById('hero-title');
        const heroAffiliation = document.getElementById('hero-affiliation');
        const heroLocation = document.getElementById('hero-location');
        const profileImage = document.getElementById('profile-image');

        if (heroName) {
            console.log('Updating hero name to:', this.data.site.name);
            heroName.textContent = this.data.site.name;
        } else {
            console.log('hero-name element not found');
        }
        
        if (heroTitle) heroTitle.textContent = this.data.site.title;
        if (heroAffiliation) heroAffiliation.textContent = this.data.site.affiliation;
        if (heroLocation) heroLocation.textContent = this.data.site.location;
        if (profileImage) {
            profileImage.alt = `Profile photo of ${this.data.site.name}`;
        }

        // Update page title
        document.title = `${this.data.site.name} - ${this.data.site.title}`;
        
        // Update meta description
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.content = `${this.data.site.name} - ${this.data.site.title} at ${this.data.site.affiliation}. ${this.data.site.about}`;
        }

        // Update contact section
        const contactEmail = document.getElementById('contact-email');
        const contactLocation = document.getElementById('contact-location');
        const contactAffiliation = document.getElementById('contact-affiliation');

        if (contactEmail) {
            contactEmail.textContent = this.data.site.email;
            contactEmail.href = `mailto:${this.data.site.email}`;
        }
        if (contactLocation) contactLocation.textContent = this.data.site.location;
        if (contactAffiliation) contactAffiliation.textContent = this.data.site.affiliation;
    }

    renderAbout() {
        const aboutElement = document.getElementById('about-text');
        if (aboutElement && this.data.site) {
            aboutElement.textContent = this.data.site.about;
        }
    }

    renderInterests() {
        const interestsGrid = document.getElementById('interests-grid');
        if (interestsGrid && this.data.site && this.data.site.interests) {
            interestsGrid.innerHTML = this.data.site.interests
                .map(interest => `<div class="interest-tag">${this.escapeHtml(interest)}</div>`)
                .join('');
        }
    }

    renderNews() {
        const newsList = document.getElementById('news-list');
        if (newsList && this.data.news) {
            const sortedNews = this.data.news
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 5); // Show only latest 5

            newsList.innerHTML = sortedNews
                .map(item => `
                    <div class="news-item">
                        <div class="news-date">${this.formatDate(item.date)}</div>
                        <div class="news-text">${this.escapeHtml(item.text)}</div>
                    </div>
                `)
                .join('');
        }
    }

    renderSelectedPublications() {
        const publicationsList = document.getElementById('selected-publications');
        if (publicationsList && this.data.publications) {
            const selectedPubs = this.data.publications
                .sort((a, b) => b.year - a.year)
                .slice(0, 3); // Show top 3

            publicationsList.innerHTML = selectedPubs
                .map(pub => this.renderPublicationItem(pub))
                .join('');
        }
    }

    renderPublicationItem(pub) {
        const authors = this.formatAuthors(pub.authors);
        const links = this.renderPublicationLinks(pub.links);
        const tags = pub.tags ? this.renderPublicationTags(pub.tags) : '';
        const abstract = pub.abstract ? `
            <button class="abstract-toggle" onclick="site.toggleAbstract(this)">
                Show Abstract
            </button>
            <div class="publication-abstract">
                ${this.escapeHtml(pub.abstract)}
            </div>
        ` : '';

        return `
            <div class="publication-item">
                <h3 class="publication-title">${this.escapeHtml(pub.title)}</h3>
                <div class="publication-authors">${authors}</div>
                <div class="publication-venue">${this.escapeHtml(pub.venue)} ${pub.year}</div>
                ${links}
                ${tags}
                ${abstract}
            </div>
        `;
    }

    renderPublicationLinks(links) {
        if (!links) return '';
        
        const linkTypes = {
            pdf: '📄 PDF',
            code: '💻 Code',
            arxiv: '📚 arXiv',
            doi: '🔗 DOI',
            slides: '📊 Slides',
            poster: '🖼️ Poster',
            video: '🎥 Video',
            demo: '🚀 Demo'
        };

        return `
            <div class="publication-links">
                ${Object.entries(links)
                    .filter(([key, value]) => value)
                    .map(([key, value]) => `
                        <a href="${this.escapeHtml(value)}" class="publication-link" target="_blank" rel="noopener">
                            ${linkTypes[key] || key}
                        </a>
                    `)
                    .join('')}
            </div>
        `;
    }

    renderPublicationTags(tags) {
        return `
            <div class="publication-tags">
                ${tags.map(tag => `<span class="publication-tag">${this.escapeHtml(tag)}</span>`).join('')}
            </div>
        `;
    }

    formatAuthors(authors) {
        if (!authors) return '';
        
        return authors
            .map(author => {
                // Highlight the site owner's name
                if (this.data.site && author.includes(this.data.site.name.split(' ')[0])) {
                    return `<span class="publication-author-highlight">${this.escapeHtml(author)}</span>`;
                }
                return this.escapeHtml(author);
            })
            .join(', ');
    }

    // Publications Page Specific Functions
    initPublicationsPage() {
        console.log('initPublicationsPage called');
        console.log('Data at init:', this.data);
        this.setupSearch();
        this.setupFilters();
        this.renderAllPublications();
    }

    setupSearch() {
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', this.debounce(() => {
                this.filterPublications();
            }, 300));
        }
    }

    setupFilters() {
        const yearFilter = document.getElementById('year-filter');
        const tagFilter = document.getElementById('tag-filter');
        
        if (yearFilter) {
            yearFilter.addEventListener('change', () => this.filterPublications());
        }
        
        if (tagFilter) {
            tagFilter.addEventListener('change', () => this.filterPublications());
        }

        this.populateFilters();
    }

    populateFilters() {
        if (!this.data.publications) return;

        // Populate year filter
        const years = [...new Set(this.data.publications.map(pub => pub.year))].sort((a, b) => b - a);
        const yearFilter = document.getElementById('year-filter');
        if (yearFilter) {
            yearFilter.innerHTML = '<option value="">All Years</option>' +
                years.map(year => `<option value="${year}">${year}</option>`).join('');
        }

        // Populate tag filter
        const allTags = this.data.publications
            .flatMap(pub => pub.tags || [])
            .filter((tag, index, arr) => arr.indexOf(tag) === index)
            .sort();
        
        const tagFilter = document.getElementById('tag-filter');
        if (tagFilter) {
            tagFilter.innerHTML = '<option value="">All Tags</option>' +
                allTags.map(tag => `<option value="${tag}">${tag}</option>`).join('');
        }
    }

    filterPublications() {
        const searchTerm = document.getElementById('search-input')?.value.toLowerCase() || '';
        const selectedYear = document.getElementById('year-filter')?.value || '';
        const selectedTag = document.getElementById('tag-filter')?.value || '';

        let filtered = this.data.publications.filter(pub => {
            const matchesSearch = !searchTerm || 
                pub.title.toLowerCase().includes(searchTerm) ||
                pub.authors.some(author => author.toLowerCase().includes(searchTerm)) ||
                pub.venue.toLowerCase().includes(searchTerm) ||
                (pub.tags && pub.tags.some(tag => tag.toLowerCase().includes(searchTerm)));

            const matchesYear = !selectedYear || pub.year.toString() === selectedYear;
            
            const matchesTag = !selectedTag || (pub.tags && pub.tags.includes(selectedTag));

            return matchesSearch && matchesYear && matchesTag;
        });

        this.renderFilteredPublications(filtered);
    }

    renderAllPublications() {
        console.log('renderAllPublications called');
        console.log('Publications data:', this.data.publications);
        
        const publicationsList = document.getElementById('publications-list');
        console.log('Publications list element:', publicationsList);
        
        if (!publicationsList) {
            console.error('Publications list element not found');
            return;
        }
        
        if (!this.data.publications) {
            console.error('Publications data not loaded');
            publicationsList.innerHTML = '<p class="text-center">Error: Publications data could not be loaded.</p>';
            return;
        }
        
        if (this.data.publications.length === 0) {
            publicationsList.innerHTML = '<p class="text-center">No publications available.</p>';
            return;
        }
        
        const sortedPubs = this.data.publications.sort((a, b) => b.year - a.year);
        console.log('Sorted publications:', sortedPubs);
        publicationsList.innerHTML = sortedPubs
            .map(pub => this.renderPublicationItem(pub))
            .join('');
        console.log('Publications rendered successfully');
    }

    renderFilteredPublications(publications) {
        const publicationsList = document.getElementById('publications-list');
        if (publicationsList) {
            if (publications.length === 0) {
                publicationsList.innerHTML = '<p class="text-center">No publications found matching your criteria.</p>';
            } else {
                publicationsList.innerHTML = publications
                    .map(pub => this.renderPublicationItem(pub))
                    .join('');
            }
        }
    }

    // Interactive Features
    toggleAbstract(button) {
        const abstract = button.nextElementSibling;
        const isShowing = abstract.classList.contains('show');
        
        if (isShowing) {
            abstract.classList.remove('show');
            button.textContent = 'Show Abstract';
        } else {
            abstract.classList.add('show');
            button.textContent = 'Hide Abstract';
        }
    }

    copyBibTeX(pub) {
        const bibtex = this.generateBibTeX(pub);
        navigator.clipboard.writeText(bibtex).then(() => {
            // Show temporary feedback
            this.showToast('BibTeX copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy BibTeX:', err);
        });
    }

    generateBibTeX(pub) {
        const key = pub.title.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '') + pub.year;
        const authors = pub.authors.join(' and ');
        
        return `@article{${key},
    title={${pub.title}},
    author={${authors}},
    journal={${pub.venue}},
    year={${pub.year}}
}`;
    }

    showToast(message) {
        // Simple toast implementation
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--primary-color);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: var(--radius);
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }

    // Event Listeners
    setupEventListeners() {
        // Theme toggle
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // System theme change detection
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
            if (!localStorage.getItem('theme')) {
                this.setupTheme();
            }
        });

        // Page-specific initialization
        const currentPage = window.location.pathname;
        if (currentPage.includes('publications.html')) {
            this.initPublicationsPage();
        }
    }

    // Utility Functions
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short' 
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Initialize the site when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.site = new AcademicSite();
});

// Add CSS animations for toast
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===== CONFERENCE HIGHLIGHTS CAROUSEL =====

class ConferenceCarousel {
    constructor(container) {
        this.container = container;
        this.viewport = container.querySelector('.carousel-viewport');
        this.track = container.querySelector('#carousel-track');
        this.slides = container.querySelectorAll('.carousel-slide');
        this.prevBtn = container.querySelector('#carousel-prev');
        this.nextBtn = container.querySelector('#carousel-next');
        this.indicators = container.querySelectorAll('.carousel-indicator');
        this.announcer = container.querySelector('#carousel-announcer');
        
        this.currentIndex = 0;
        this.autoplayInterval = null;
        this.autoplayDelay = 3500; // 3.5 seconds
        this.isUserInteracting = false;
        
        // Mouse movement interaction state
        this.lastMouseMoveTime = 0;
        this.mouseMoveThrottle = 1000; // 1 second between mouse-triggered advances
        this.isMouseInViewport = false;
        
        // Check for reduced motion preference
        this.respectsReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        this.init();
    }
    
    init() {
        if (this.slides.length === 0) return;
        
        this.setupEventListeners();
        this.setupKeyboardNavigation();
        this.updateSlidePosition();
        
        // Only start autoplay if user hasn't requested reduced motion
        if (!this.respectsReducedMotion) {
            this.startAutoplay();
        }
        
        // Update total slides for screen readers
        this.updateSlideLabels();
    }
    
    setupEventListeners() {
        // Navigation buttons
        this.prevBtn?.addEventListener('click', () => this.goToPrevious());
        this.nextBtn?.addEventListener('click', () => this.goToNext());
        
        // Indicator dots
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Pause autoplay on hover/focus
        this.container.addEventListener('mouseenter', () => this.pauseAutoplay());
        this.container.addEventListener('mouseleave', () => this.resumeAutoplay());
        this.container.addEventListener('focusin', () => this.pauseAutoplay());
        this.container.addEventListener('focusout', () => this.resumeAutoplay());
        
        // Mouse movement interaction on viewport
        this.setupMouseMovementInteraction();
        
        // Touch/swipe support
        this.setupTouchEvents();
        
        // Listen for reduced motion changes
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        mediaQuery.addEventListener('change', (e) => {
            this.respectsReducedMotion = e.matches;
            if (e.matches) {
                this.stopAutoplay();
            } else if (!this.isUserInteracting) {
                this.startAutoplay();
            }
        });
    }
    
    setupKeyboardNavigation() {
        this.container.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    this.goToPrevious();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.goToNext();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.goToSlide(0);
                    break;
                case 'End':
                    e.preventDefault();
                    this.goToSlide(this.slides.length - 1);
                    break;
            }
        });
    }
    
    setupTouchEvents() {
        let startX = 0;
        let startY = 0;
        let isScrolling = false;
        
        this.track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isScrolling = false;
        }, { passive: true });
        
        this.track.addEventListener('touchmove', (e) => {
            if (!startX || !startY) return;
            
            const diffX = Math.abs(e.touches[0].clientX - startX);
            const diffY = Math.abs(e.touches[0].clientY - startY);
            
            // Determine if user is scrolling vertically
            if (diffY > diffX) {
                isScrolling = true;
            }
        }, { passive: true });
        
        this.track.addEventListener('touchend', (e) => {
            if (!startX || isScrolling) return;
            
            const endX = e.changedTouches[0].clientX;
            const diffX = startX - endX;
            const threshold = 50; // Minimum swipe distance
            
            if (Math.abs(diffX) > threshold) {
                if (diffX > 0) {
                    this.goToNext(); // Swipe left - go to next
                } else {
                    this.goToPrevious(); // Swipe right - go to previous
                }
            }
            
            startX = 0;
            startY = 0;
        }, { passive: true });
    }
    
    setupMouseMovementInteraction() {
        if (!this.viewport) return;
        
        // Track mouse enter/leave on viewport specifically
        this.viewport.addEventListener('mouseenter', () => {
            this.isMouseInViewport = true;
        });
        
        this.viewport.addEventListener('mouseleave', () => {
            this.isMouseInViewport = false;
        });
        
        // Mouse movement to advance slides
        this.viewport.addEventListener('mousemove', (e) => {
            if (!this.isMouseInViewport) return;
            
            const currentTime = Date.now();
            
            // Throttle mouse movement to prevent too rapid firing
            if (currentTime - this.lastMouseMoveTime < this.mouseMoveThrottle) {
                return;
            }
            
            this.lastMouseMoveTime = currentTime;
            
            // Advance to next slide
            this.goToNext();
        }, { passive: true });
    }
    
    goToNext() {
        this.userInteraction();
        this.currentIndex = (this.currentIndex + 1) % this.slides.length;
        this.updateSlidePosition();
        this.announceSlideChange();
    }
    
    goToPrevious() {
        this.userInteraction();
        this.currentIndex = this.currentIndex === 0 ? this.slides.length - 1 : this.currentIndex - 1;
        this.updateSlidePosition();
        this.announceSlideChange();
    }
    
    goToSlide(index) {
        if (index >= 0 && index < this.slides.length && index !== this.currentIndex) {
            this.userInteraction();
            this.currentIndex = index;
            this.updateSlidePosition();
            this.announceSlideChange();
        }
    }
    
    updateSlidePosition() {
        // Update slide positions
        const translateX = -this.currentIndex * 100;
        this.track.style.transform = `translateX(${translateX}%)`;
        
        // Update slide visibility for screen readers
        this.slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === this.currentIndex);
            slide.setAttribute('aria-hidden', index !== this.currentIndex);
        });
        
        // Update indicators
        this.indicators.forEach((indicator, index) => {
            const isActive = index === this.currentIndex;
            indicator.classList.toggle('active', isActive);
            indicator.setAttribute('aria-selected', isActive);
        });
    }
    
    updateSlideLabels() {
        this.slides.forEach((slide, index) => {
            slide.setAttribute('aria-label', `${index + 1} of ${this.slides.length}`);
        });
    }
    
    announceSlideChange() {
        const currentSlideCaption = this.slides[this.currentIndex].querySelector('.carousel-caption')?.textContent;
        if (this.announcer && currentSlideCaption) {
            this.announcer.textContent = `Slide ${this.currentIndex + 1} of ${this.slides.length}: ${currentSlideCaption}`;
        }
    }
    
    startAutoplay() {
        if (this.respectsReducedMotion || this.slides.length <= 1) return;
        
        this.stopAutoplay(); // Clear any existing interval
        this.autoplayInterval = setInterval(() => {
            if (!this.isUserInteracting) {
                this.goToNext();
            }
        }, this.autoplayDelay);
    }
    
    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }
    
    pauseAutoplay() {
        this.isUserInteracting = true;
        this.stopAutoplay();
    }
    
    resumeAutoplay() {
        this.isUserInteracting = false;
        if (!this.respectsReducedMotion) {
            // Delay restart to avoid immediate transitions when user is still interacting
            setTimeout(() => {
                if (!this.isUserInteracting) {
                    this.startAutoplay();
                }
            }, 1000);
        }
    }
    
    userInteraction() {
        this.pauseAutoplay();
        // Resume autoplay after a delay
        setTimeout(() => this.resumeAutoplay(), 5000);
    }
    
    destroy() {
        this.stopAutoplay();
        // Remove all event listeners
        this.container.removeEventListener('mouseenter', this.pauseAutoplay);
        this.container.removeEventListener('mouseleave', this.resumeAutoplay);
        this.container.removeEventListener('focusin', this.pauseAutoplay);
        this.container.removeEventListener('focusout', this.resumeAutoplay);
    }
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        window.conferenceCarousel = new ConferenceCarousel(carouselContainer);
    }
});
