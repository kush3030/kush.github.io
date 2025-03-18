/**
 * Cyber Threat Intelligence Dashboard
 * Main JavaScript File
 */

// DOM Elements
const feedContainer = document.getElementById('feedContainer');
const loadingContainer = document.getElementById('loadingContainer');
const emptyState = document.getElementById('emptyState');
const digitalClock = document.getElementById('digitalClock');
const lastUpdated = document.getElementById('lastUpdated');
const globalThreatLevel = document.getElementById('globalThreatLevel');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const refreshButton = document.getElementById('refreshButton');
const footerRefresh = document.getElementById('footerRefresh');
const emptyStateRefresh = document.getElementById('emptyStateRefresh');
const themeToggle = document.getElementById('themeToggle');
const settingsButton = document.getElementById('settingsButton');
const settingsModal = document.getElementById('settingsModal');
const closeSettings = document.getElementById('closeSettings');
const saveSettings = document.getElementById('saveSettings');
const resetSettings = document.getElementById('resetSettings');
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebar = document.querySelector('.sidebar');
const mainContent = document.querySelector('.main-content');
const viewButtons = document.querySelectorAll('.view-button');
const sortSelect = document.getElementById('sortSelect');
const categoryItems = document.querySelectorAll('.category-item');
const filterButtons = document.querySelectorAll('.filter-button');
const feedItemTemplate = document.getElementById('feedItemTemplate');
const activityTimeline = document.getElementById('activityTimeline');
const feedCount = document.getElementById('feedCount');
const articleCount = document.getElementById('articleCount');
const totalFeedCount = document.getElementById('totalFeedCount');
const allCount = document.getElementById('allCount');
const governmentCount = document.getElementById('governmentCount');
const newsCount = document.getElementById('newsCount');
const blogsCount = document.getElementById('blogsCount');
const vendorsCount = document.getElementById('vendorsCount');
const researchCount = document.getElementById('researchCount');

// RSS Feeds
const rssFeeds = [
    "https://www.us-cert.gov/ncas/alerts.xml",
    "https://www.bleepingcomputer.com/feed/",
    "https://threatpost.com/feed/",
    "https://www.darkreading.com/rss.xml",
    "https://www.sans.org/webcasts/rss",
    "https://krebsonsecurity.com/feed/",
    "https://cyware.com/rss-feed/",
    "https://www.securityweek.com/rss",
    "https://feeds.feedburner.com/TheHackersNews",
    "https://www.schneier.com/blog/atom.xml",
    "https://isc.sans.edu/rssfeed.xml",
    "https://www.fireeye.com/blog/threat-research/_jcr_content.feed",
    "https://blogs.cisco.com/security/feed",
    "https://www.mcafee.com/blogs/feed/",
    "https://nakedsecurity.sophos.com/feed/",
    "https://www.tripwire.com/state-of-security/feed/",
    "https://research.checkpoint.com/feed/",
    "https://www.zdnet.com/topic/security/rss.xml",
    "https://www.infosecurity-magazine.com/rss/news/",
    "https://cybersecurity.att.com/site/blog-all-rss",
    "https://www.cybereason.com/blog/rss.xml",
    "https://blog.qualys.com/feed/",
    "https://www.tenable.com/blog/feed",
    "https://www.blackhillsinfosec.com/feed/",
    "https://rss.packetstormsecurity.com/files/",
    "https://unit42.paloaltonetworks.com/feed/",
    "https://www.arbornetworks.com/blog/asert/feed/",
    "https://www.trendmicro.com/rss/index.xml",
    "https://www.crowdstrike.com/blog/feed/",
    "https://securityaffairs.co/wordpress/feed"
];

// Feed categories mapping
const feedCategories = {
    "us-cert.gov": "government",
    "cisa.gov": "government",
    "bleepingcomputer.com": "news",
    "threatpost.com": "news",
    "darkreading.com": "news",
    "sans.org": "research",
    "krebsonsecurity.com": "blogs",
    "cyware.com": "news",
    "securityweek.com": "news",
    "feedburner.com": "news",
    "schneier.com": "blogs",
    "sans.edu": "research",
    "fireeye.com": "vendors",
    "cisco.com": "vendors",
    "mcafee.com": "vendors",
    "sophos.com": "vendors",
    "tripwire.com": "vendors",
    "checkpoint.com": "vendors",
    "zdnet.com": "news",
    "infosecurity-magazine.com": "news",
    "att.com": "vendors",
    "cybereason.com": "vendors",
    "qualys.com": "vendors",
    "tenable.com": "vendors",
    "blackhillsinfosec.com": "blogs",
    "packetstormsecurity.com": "research",
    "paloaltonetworks.com": "vendors",
    "arbornetworks.com": "vendors",
    "trendmicro.com": "vendors",
    "crowdstrike.com": "vendors",
    "securityaffairs.co": "blogs"
};

// Keywords for severity detection
const severityKeywords = {
    critical: ["critical", "urgent", "emergency", "severe", "high-risk", "zero-day", "0day", "breach", "leaked", "compromise", "attack", "exploit", "vulnerability", "CVE"],
    high: ["important", "warning", "alert", "security", "threat", "malware", "ransomware", "phishing", "backdoor", "trojan", "worm", "botnet"],
    medium: ["update", "patch", "fix", "advisory", "disclosure", "detected", "discovered"],
    low: ["research", "analysis", "overview", "report", "summary", "guide", "tutorial"],
    info: ["announcement", "release", "news", "information", "update"]
};

// Settings
let settings = {
    theme: 'dark',
    animations: true,
    refreshInterval: 600000, // 10 minutes
    maxItems: 3,
    showDescriptions: true,
    showTimestamps: true
};

// State
let allFeeds = [];
let filteredFeeds = [];
let currentCategory = 'all';
let currentView = 'card';
let currentSort = 'newest';
let currentSearch = '';
let isLoading = false;
let lastRefreshTime = null;
let categoryCounts = {
    all: 0,
    government: 0,
    news: 0,
    blogs: 0,
    vendors: 0,
    research: 0
};

// Proxy URL for CORS
const proxyUrl = "https://api.rss2json.com/v1/api.json?rss_url=";

// Initialize the dashboard
function initDashboard() {
    // Load settings from localStorage
    loadSettings();
    
    // Initialize UI based on settings
    applyTheme();
    
    // Apply animation settings
    toggleAnimations();
    
    // Initialize clock
    updateClock();
    setInterval(updateClock, 1000);
    
    // Initialize threat chart
    initThreatChart();
    
    // Initialize particles background
    initParticles();
    
    // Fetch feeds on load
    fetchFeeds();
    
    // Set up auto-refresh
    setAutoRefresh();
    
    // Set up event listeners
    setupEventListeners();
}

// Load settings from localStorage
function loadSettings() {
    const savedSettings = localStorage.getItem('threatDashboardSettings');
    if (savedSettings) {
        settings = JSON.parse(savedSettings);
    }
    
    // Apply settings to UI elements
    document.getElementById('themeSelect').value = settings.theme;
    document.getElementById('animationToggle').checked = settings.animations;
    document.getElementById('refreshInterval').value = settings.refreshInterval;
    document.getElementById('maxItems').value = settings.maxItems;
    document.getElementById('showDescriptions').checked = settings.showDescriptions;
    document.getElementById('showTimestamps').checked = settings.showTimestamps;
}

// Save settings to localStorage
function saveSettingsToStorage() {
    localStorage.setItem('threatDashboardSettings', JSON.stringify(settings));
}

// Apply theme based on settings
function applyTheme() {
    if (settings.theme === 'dark') {
        document.body.classList.add('dark-mode');
        document.body.classList.remove('light-mode');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    } else if (settings.theme === 'light') {
        document.body.classList.add('light-mode');
        document.body.classList.remove('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else if (settings.theme === 'system') {
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDarkMode) {
            document.body.classList.add('dark-mode');
            document.body.classList.remove('light-mode');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        } else {
            document.body.classList.add('light-mode');
            document.body.classList.remove('dark-mode');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
    }
}

// Toggle animations based on settings
function toggleAnimations() {
    if (!settings.animations) {
        const style = document.createElement('style');
        style.id = 'no-animations';
        style.textContent = '* { animation: none !important; transition: none !important; }';
        document.head.appendChild(style);
    } else {
        const noAnimations = document.getElementById('no-animations');
        if (noAnimations) {
            noAnimations.remove();
        }
    }
}

// Set up auto-refresh
function setAutoRefresh() {
    // Clear any existing interval
    if (window.refreshInterval) {
        clearInterval(window.refreshInterval);
    }
    
    // Set new interval if not set to 0 (never)
    if (settings.refreshInterval > 0) {
        window.refreshInterval = setInterval(fetchFeeds, settings.refreshInterval);
    }
}

// Update digital clock
function updateClock() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    
    digitalClock.textContent = `${hours}:${minutes}:${seconds}`;
}

// Update last updated timestamp
function updateLastUpdated() {
    if (lastRefreshTime) {
        const now = new Date();
        const diff = now - lastRefreshTime;
        
        // Format the time difference
        let timeAgo;
        if (diff < 60000) { // less than 1 minute
            timeAgo = 'Just now';
        } else if (diff < 3600000) { // less than 1 hour
            const minutes = Math.floor(diff / 60000);
            timeAgo = `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        } else if (diff < 86400000) { // less than 1 day
            const hours = Math.floor(diff / 3600000);
            timeAgo = `${hours} hour${hours > 1 ? 's' : ''} ago`;
        } else {
            const days = Math.floor(diff / 86400000);
            timeAgo = `${days} day${days > 1 ? 's' : ''} ago`;
        }
        
        lastUpdated.textContent = `Last updated: ${timeAgo}`;
    } else {
        lastUpdated.textContent = 'Last updated: Never';
    }
}

// Initialize threat chart
function initThreatChart() {
    const ctx = document.getElementById('threatChart').getContext('2d');
    
    window.threatChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Critical', 'High', 'Medium', 'Low', 'Info'],
            datasets: [{
                data: [0, 0, 0, 0, 0],
                backgroundColor: [
                    'rgba(255, 77, 79, 0.8)',
                    'rgba(250, 140, 22, 0.8)',
                    'rgba(250, 173, 20, 0.8)',
                    'rgba(82, 196, 26, 0.8)',
                    'rgba(24, 144, 255, 0.8)'
                ],
                borderColor: [
                    'rgba(255, 77, 79, 1)',
                    'rgba(250, 140, 22, 1)',
                    'rgba(250, 173, 20, 1)',
                    'rgba(82, 196, 26, 1)',
                    'rgba(24, 144, 255, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--text-primary'),
                        font: {
                            family: "'Roboto Mono', monospace",
                            size: 10
                        }
                    }
                },
                tooltip: {
                    backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--card-bg'),
                    titleColor: getComputedStyle(document.documentElement).getPropertyValue('--text-primary'),
                    bodyColor: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary'),
                    borderColor: getComputedStyle(document.documentElement).getPropertyValue('--border-color'),
                    borderWidth: 1,
                    displayColors: true,
                    titleFont: {
                        family: "'Orbitron', sans-serif",
                        size: 12
                    },
                    bodyFont: {
                        family: "'Roboto Mono', monospace",
                        size: 11
                    }
                }
            }
        }
    });
}

// Update threat chart with new data
function updateThreatChart() {
    const severityCounts = {
        critical: 0,
        high: 0,
        medium: 0,
        low: 0,
        info: 0
    };
    
    // Count feeds by severity
    filteredFeeds.forEach(feed => {
        severityCounts[feed.severity]++;
    });
    
    // Update chart data
    window.threatChart.data.datasets[0].data = [
        severityCounts.critical,
        severityCounts.high,
        severityCounts.medium,
        severityCounts.low,
        severityCounts.info
    ];
    
    window.threatChart.update();
    
    // Update global threat level
    updateGlobalThreatLevel(severityCounts);
}

// Update global threat level indicator
function updateGlobalThreatLevel(severityCounts) {
    let threatLevel = 'info';
    let threatText = 'INFO';
    
    if (severityCounts.critical > 0) {
        threatLevel = 'critical';
        threatText = 'CRITICAL';
    } else if (severityCounts.high > 0) {
        threatLevel = 'high';
        threatText = 'HIGH';
    } else if (severityCounts.medium > 0) {
        threatLevel = 'medium';
        threatText = 'MEDIUM';
    } else if (severityCounts.low > 0) {
        threatLevel = 'low';
        threatText = 'LOW';
    }
    
    // Remove all classes
    const threatDot = globalThreatLevel.querySelector('.threat-dot');
    threatDot.classList.remove('critical', 'high', 'medium', 'low', 'info');
    
    // Add current class
    threatDot.classList.add(threatLevel);
    
    // Update text
    globalThreatLevel.querySelector('.threat-text').textContent = threatText;
}

// Initialize particles background
function initParticles() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: {
                    value: 80,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: '#00e5ff'
                },
                shape: {
                    type: 'circle',
                    stroke: {
                        width: 0,
                        color: '#000000'
                    },
                    polygon: {
                        nb_sides: 5
                    }
                },
                opacity: {
                    value: 0.3,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 1,
                        opacity_min: 0.1,
                        sync: false
                    }
                },
                size: {
                    value: 3,
                    random: true,
                    anim: {
                        enable: false,
                        speed: 40,
                        size_min: 0.1,
                        sync: false
                    }
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#00e5ff',
                    opacity: 0.2,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: 'none',
                    random: false,
                    straight: false,
                    out_mode: 'out',
                    bounce: false,
                    attract: {
                        enable: false,
                        rotateX: 600,
                        rotateY: 1200
                    }
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: {
                        enable: true,
                        mode: 'grab'
                    },
                    onclick: {
                        enable: true,
                        mode: 'push'
                    },
                    resize: true
                },
                modes: {
                    grab: {
                        distance: 140,
                        line_linked: {
                            opacity: 0.5
                        }
                    },
                    push: {
                        particles_nb: 4
                    }
                }
            },
            retina_detect: true
        });
    }
}

// Set up event listeners
function setupEventListeners() {
    // Theme toggle
    themeToggle.addEventListener('click', () => {
        if (settings.theme === 'dark') {
            settings.theme = 'light';
        } else {
            settings.theme = 'dark';
        }
        applyTheme();
        saveSettingsToStorage();
    });
    
    // Settings modal
    settingsButton.addEventListener('click', () => {
        settingsModal.classList.add('active');
    });
    
    closeSettings.addEventListener('click', () => {
        settingsModal.classList.remove('active');
    });
    
    saveSettings.addEventListener('click', () => {
        // Get values from form
        settings.theme = document.getElementById('themeSelect').value;
        settings.animations = document.getElementById('animationToggle').checked;
        settings.refreshInterval = parseInt(document.getElementById('refreshInterval').value);
        settings.maxItems = parseInt(document.getElementById('maxItems').value);
        settings.showDescriptions = document.getElementById('showDescriptions').checked;
        settings.showTimestamps = document.getElementById('showTimestamps').checked;
        
        // Apply settings
        applyTheme();
        toggleAnimations();
        setAutoRefresh();
        saveSettingsToStorage();
        
        // Update UI based on settings
        document.querySelectorAll('.feed-description').forEach(el => {
            el.style.display = settings.showDescriptions ? 'block' : 'none';
        });
        
        document.querySelectorAll('.feed-timestamp').forEach(el => {
            el.style.display = settings.showTimestamps ? 'flex' : 'none';
        });
        
        // Refresh feeds with new settings
        fetchFeeds();
        
        // Close modal
        settingsModal.classList.remove('active');
    });
    
    resetSettings.addEventListener('click', () => {
        // Reset to defaults
        settings = {
            theme: 'dark',
            animations: true,
            refreshInterval: 600000,
            maxItems: 3,
            showDescriptions: true,
            showTimestamps: true
        };
        
        // Update form values
        document.getElementById('themeSelect').value = settings.theme;
        document.getElementById('animationToggle').checked = settings.animations;
        document.getElementById('refreshInterval').value = settings.refreshInterval;
        document.getElementById('maxItems').value = settings.maxItems;
        document.getElementById('showDescriptions').checked = settings.showDescriptions;
        document.getElementById('showTimestamps').checked = settings.showTimestamps;
        
        // Apply settings
        applyTheme();
        toggleAnimations();
        setAutoRefresh();
        saveSettingsToStorage();
    });
    
    // Sidebar toggle
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        if (sidebar.classList.contains('collapsed')) {
            sidebarToggle.querySelector('i').classList.remove('fa-chevron-left');
            sidebarToggle.querySelector('i').classList.add('fa-chevron-right');
        } else {
            sidebarToggle.querySelector('i').classList.remove('fa-chevron-right');
            sidebarToggle.querySelector('i').classList.add('fa-chevron-left');
        }
    });
    
    // View toggle
    viewButtons.forEach(button => {
        button.addEventListener('click', () => {
            viewButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentView = button.dataset.view;
            
            if (currentView === 'card') {
                mainContent.classList.remove('list-view');
            } else {
                mainContent.classList.add('list-view');
            }
        });
    });
    
    // Sort select
    sortSelect.addEventListener('change', () => {
        currentSort = sortSelect.value;
        sortAndFilterFeeds();
        renderFeeds();
    });
    
    // Category filters
    categoryItems.forEach(item => {
        item.addEventListener('click', () => {
            categoryItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            currentCategory = item.dataset.category;
            sortAndFilterFeeds();
            renderFeeds();
        });
    });
    
    // Quick filters
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            
            if (filter === 'critical') {
                // Filter for critical severity
                filteredFeeds = allFeeds.filter(feed => feed.severity === 'critical');
            } else if (filter === 'today') {
                // Filter for items from today
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                filteredFeeds = allFeeds.filter(feed => {
                    const pubDate = new Date(feed.pubDate);
                    return pubDate >= today;
                });
            } else if (filter === 'vulnerabilities') {
                // Filter for vulnerability-related items
                filteredFeeds = allFeeds.filter(feed => {
                    return feed.title.toLowerCase().includes('vulnerability') || 
                           feed.title.toLowerCase().includes('cve') ||
                           feed.description.toLowerCase().includes('vulnerability') ||
                           feed.description.toLowerCase().includes('cve');
                });
            } else if (filter === 'malware') {
                // Filter for malware-related items
                filteredFeeds = allFeeds.filter(feed => {
                    return feed.title.toLowerCase().includes('malware') || 
                           feed.title.toLowerCase().includes('ransomware') ||
                           feed.title.toLowerCase().includes('trojan') ||
                           feed.description.toLowerCase().includes('malware') ||
                           feed.description.toLowerCase().includes('ransomware') ||
                           feed.description.toLowerCase().includes('trojan');
                });
            } else if (filter === 'bookmarked') {
                // Filter for bookmarked items
                filteredFeeds = allFeeds.filter(feed => feed.bookmarked === true);
            }
            
            renderFeeds();
        });
    });
    
    // Search
    searchButton.addEventListener('click', () => {
        currentSearch = searchInput.value.trim().toLowerCase();
        sortAndFilterFeeds();
        renderFeeds();
    });
    
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            currentSearch = searchInput.value.trim().toLowerCase();
            sortAndFilterFeeds();
            renderFeeds();
        }
    });
    
    // Refresh buttons
    refreshButton.addEventListener('click', fetchFeeds);
    footerRefresh.addEventListener('click', fetchFeeds);
    emptyStateRefresh.addEventListener('click', fetchFeeds);
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === settingsModal) {
            settingsModal.classList.remove('active');
        }
    });
    
    // Update last updated time every minute
    setInterval(updateLastUpdated, 60000);
}

// Fetch RSS feeds
async function fetchFeeds() {
    if (isLoading) return;
    
    isLoading = true;
    showLoading(true);
    
    // Reset feeds
    allFeeds = [];
    
    // Update feed counts
    totalFeedCount.textContent = rssFeeds.length;
    
    try {
        for (let feedUrl of rssFeeds) {
            try {
                const response = await fetch(proxyUrl + encodeURIComponent(feedUrl));
                const data = await response.json();
                
                if (data.items && data.items.length > 0) {
                    // Get feed source domain for categorization
                    const feedDomain = extractDomain(feedUrl);
                    const category = getFeedCategory(feedDomain);
                    
                    // Process feed items
                    data.items.slice(0, settings.maxItems).forEach(item => {
                        // Determine severity based on keywords
                        const severity = determineSeverity(item.title, item.description);
                        
                        // Add to feeds array
                        allFeeds.push({
                            title: item.title,
                            description: item.description,
                            link: item.link,
                            pubDate: item.pubDate,
                            source: data.feed.title || extractDomain(feedUrl),
                            sourceDomain: feedDomain,
                            category: category,
                            severity: severity,
                            bookmarked: false
                        });
                    });
                }
            } catch (error) {
                console.error('Error fetching feed:', feedUrl, error);
            }
        }
        
        // Update last refresh time
        lastRefreshTime = new Date();
        updateLastUpdated();
        
        // Add to activity timeline
        addActivityItem(`Refreshed feeds: ${allFeeds.length} items loaded`);
        
        // Sort and filter feeds
        sortAndFilterFeeds();
        
        // Update category counts
        updateCategoryCounts();
        
        // Render feeds
        renderFeeds();
        
    } catch (error) {
        console.error('Error fetching feeds:', error);
        showEmptyState(true);
    } finally {
        isLoading = false;
        showLoading(false);
    }
}

// Extract domain from URL
function extractDomain(url) {
    try {
        const domain = new URL(url).hostname;
        return domain.replace('www.', '');
    } catch (e) {
        return url;
    }
}

// Get feed category based on domain
function getFeedCategory(domain) {
    for (const [key, value] of Object.entries(feedCategories)) {
        if (domain.includes(key)) {
            return value;
        }
    }
    return 'news'; // Default category
}

// Determine severity based on keywords
function determineSeverity(title, description) {
    const combinedText = (title + ' ' + description).toLowerCase();
    
    // Check for critical keywords
    for (const keyword of severityKeywords.critical) {
        if (combinedText.includes(keyword)) {
            return 'critical';
        }
    }
    
    // Check for high keywords
    for (const keyword of severityKeywords.high) {
        if (combinedText.includes(keyword)) {
            return 'high';
        }
    }
    
    // Check for medium keywords
    for (const keyword of severityKeywords.medium) {
        if (combinedText.includes(keyword)) {
            return 'medium';
        }
    }
    
    // Check for low keywords
    for (const keyword of severityKeywords.low) {
        if (combinedText.includes(keyword)) {
            return 'low';
        }
    }
    
    // Default to info
    return 'info';
}

// Sort and filter feeds
function sortAndFilterFeeds() {
    // Filter by category
    if (currentCategory === 'all') {
        filteredFeeds = [...allFeeds];
    } else {
        filteredFeeds = allFeeds.filter(feed => feed.category === currentCategory);
    }
    
    // Filter by search
    if (currentSearch) {
        filteredFeeds = filteredFeeds.filter(feed => {
            return feed.title.toLowerCase().includes(currentSearch) || 
                   feed.description.toLowerCase().includes(currentSearch) ||
                   feed.source.toLowerCase().includes(currentSearch);
        });
    }
    
    // Sort feeds
    if (currentSort === 'newest') {
        filteredFeeds.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
    } else if (currentSort === 'oldest') {
        filteredFeeds.sort((a, b) => new Date(a.pubDate) - new Date(b.pubDate));
    } else if (currentSort === 'severity') {
        const severityOrder = { critical: 0, high: 1, medium: 2, low: 3, info: 4 };
        filteredFeeds.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
    } else if (currentSort === 'source') {
        filteredFeeds.sort((a, b) => a.source.localeCompare(b.source));
    }
}

// Update category counts
function updateCategoryCounts() {
    // Reset counts
    categoryCounts = {
        all: allFeeds.length,
        government: 0,
        news: 0,
        blogs: 0,
        vendors: 0,
        research: 0
    };
    
    // Count by category
    allFeeds.forEach(feed => {
        categoryCounts[feed.category]++;
    });
    
    // Update UI
    allCount.textContent = categoryCounts.all;
    governmentCount.textContent = categoryCounts.government;
    newsCount.textContent = categoryCounts.news;
    blogsCount.textContent = categoryCounts.blogs;
    vendorsCount.textContent = categoryCounts.vendors;
    researchCount.textContent = categoryCounts.research;
    
    // Update feed stats
    feedCount.textContent = rssFeeds.length;
    articleCount.textContent = allFeeds.length;
}

// Render feeds to the container
function renderFeeds() {
    // Clear container
    feedContainer.innerHTML = '';
    
    // Show empty state if no feeds
    if (filteredFeeds.length === 0) {
        showEmptyState(true);
        return;
    }
    
    showEmptyState(false);
    
    // Render each feed
    filteredFeeds.forEach(feed => {
        const feedItem = createFeedItem(feed);
        feedContainer.appendChild(feedItem);
    });
    
    // Update threat chart
    updateThreatChart();
}

// Create a feed item element
function createFeedItem(feed) {
    // Clone the template
    const template = feedItemTemplate.content.cloneNode(true);
    const feedItem = template.querySelector('.feed-item');
    
    // Add severity class
    feedItem.classList.add(feed.severity);
    
    // Set source info
    feedItem.querySelector('.source-name').textContent = feed.source;
    
    // Set severity
    const severityIndicator = feedItem.querySelector('.severity-indicator');
    severityIndicator.classList.add(`severity-${feed.severity}`);
    feedItem.querySelector('.severity-text').textContent = feed.severity.charAt(0).toUpperCase() + feed.severity.slice(1);
    
    // Set title and description
    feedItem.querySelector('.feed-title').textContent = feed.title;
    
    const descriptionElement = feedItem.querySelector('.feed-description');
    if (settings.showDescriptions) {
        // Clean and truncate description
        let cleanDescription = feed.description.replace(/<\/?[^>]+(>|$)/g, "");
        if (cleanDescription.length > 200) {
            cleanDescription = cleanDescription.substring(0, 200) + '...';
        }
        descriptionElement.textContent = cleanDescription;
    } else {
        descriptionElement.style.display = 'none';
    }
    
    // Set timestamp
    const timestampElement = feedItem.querySelector('.feed-timestamp');
    if (settings.showTimestamps) {
        const pubDate = new Date(feed.pubDate);
        const now = new Date();
        const diff = now - pubDate;
        
        // Format the time difference
        let timeAgo;
        if (diff < 60000) { // less than 1 minute
            timeAgo = 'Just now';
        } else if (diff < 3600000) { // less than 1 hour
            const minutes = Math.floor(diff / 60000);
            timeAgo = `${minutes}m ago`;
        } else if (diff < 86400000) { // less than 1 day
            const hours = Math.floor(diff / 3600000);
            timeAgo = `${hours}h ago`;
        } else {
            const days = Math.floor(diff / 86400000);
            timeAgo = `${days}d ago`;
        }
        
        timestampElement.querySelector('.timestamp-text').textContent = timeAgo;
    } else {
        timestampElement.style.display = 'none';
    }
    
    // Set link
    feedItem.querySelector('.read-more').href = feed.link;
    
    // Add bookmark functionality
    const bookmarkButton = feedItem.querySelector('.bookmark-button');
    if (feed.bookmarked) {
        bookmarkButton.classList.add('active');
        bookmarkButton.innerHTML = '<i class="fas fa-bookmark"></i>';
    } else {
        bookmarkButton.innerHTML = '<i class="far fa-bookmark"></i>';
    }
    
    bookmarkButton.addEventListener('click', () => {
        bookmarkButton.classList.toggle('active');
        feed.bookmarked = !feed.bookmarked;
        
        if (feed.bookmarked) {
            bookmarkButton.innerHTML = '<i class="fas fa-bookmark"></i>';
            addActivityItem(`Bookmarked: ${feed.title}`);
        } else {
            bookmarkButton.innerHTML = '<i class="far fa-bookmark"></i>';
        }
    });
    
    return feedItem;
}

// Add item to activity timeline
function addActivityItem(text) {
    const activityItem = document.createElement('div');
    activityItem.className = 'activity-item';
    
    const timestamp = document.createElement('div');
    timestamp.className = 'activity-timestamp';
    const now = new Date();
    timestamp.textContent = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    const content = document.createElement('div');
    content.className = 'activity-content';
    content.textContent = text;
    
    activityItem.appendChild(timestamp);
    activityItem.appendChild(content);
    
    // Add to timeline
    activityTimeline.insertBefore(activityItem, activityTimeline.firstChild);
    
    // Limit to 10 items
    if (activityTimeline.children.length > 10) {
        activityTimeline.removeChild(activityTimeline.lastChild);
    }
}

// Show/hide loading state
function showLoading(show) {
    if (show) {
        loadingContainer.style.display = 'flex';
        feedContainer.style.display = 'none';
        emptyState.style.display = 'none';
        refreshButton.classList.add('loading');
    } else {
        loadingContainer.style.display = 'none';
        feedContainer.style.display = 'grid';
        refreshButton.classList.remove('loading');
    }
}

// Show/hide empty state
function showEmptyState(show) {
    if (show) {
        emptyState.style.display = 'flex';
        feedContainer.style.display = 'none';
    } else {
        emptyState.style.display = 'none';
        feedContainer.style.display = 'grid';
    }
}

// Initialize the dashboard when the DOM is loaded
document.addEventListener('DOMContentLoaded', initDashboard);
