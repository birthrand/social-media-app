// DOM Elements
const gossipFeed = document.querySelector('#gossipFeed');
const createGossipButton = document.querySelector('#createGossipButton');
const createGossipModal = document.querySelector('#createGossipModal');
const searchInput = document.querySelector('#searchInput');
const categoryLinks = document.querySelectorAll('.category-link');
const trendingGossips = document.querySelectorAll('.trending-gossip');

// Gossip Data Management
let currentCategory = 'all';
let currentSort = 'recent';

// Load Gossips
const loadGossips = async (category = 'all', sort = 'recent') => {
    try {
        const response = await fetch(`/api/gossips?category=${category}&sort=${sort}`);
        if (response.ok) {
            const gossips = await response.json();
            renderGossips(gossips);
        }
    } catch (error) {
        showError('Failed to load gossips');
    }
};

// Render Gossips
const renderGossips = (gossips) => {
    if (!gossipFeed) return;

    gossipFeed.innerHTML = gossips.map(gossip => `
        <div class="glass-effect rounded-xl p-4 hover-scale mb-6" data-gossip-id="${gossip.id}">
            <div class="flex items-center mb-4">
                <img src="${gossip.authorAvatar}" alt="User" class="w-10 h-10 rounded-full">
                <div class="ml-3">
                    <h3 class="font-semibold">${gossip.authorName}</h3>
                    <p class="text-sm text-gray-400">${gossip.category} • ${formatTimeAgo(gossip.createdAt)}</p>
                </div>
            </div>
            <p class="mb-4">${gossip.content}</p>
            ${gossip.media ? `
                <div class="mb-4">
                    <img src="${gossip.media}" alt="Gossip media" class="rounded-lg w-full">
                </div>
            ` : ''}
            <div class="flex items-center justify-between">
                <div class="flex space-x-4">
                    <button class="flex items-center space-x-2 hover:text-purple-500 transition-colors" onclick="handleLike('${gossip.id}')">
                        <i class="far fa-heart"></i>
                        <span>${formatNumber(gossip.likes)}</span>
                    </button>
                    <button class="flex items-center space-x-2 hover:text-purple-500 transition-colors" onclick="handleComment('${gossip.id}')">
                        <i class="far fa-comment"></i>
                        <span>${formatNumber(gossip.comments)}</span>
                    </button>
                    <button class="flex items-center space-x-2 hover:text-purple-500 transition-colors" onclick="handleShare('${gossip.id}')">
                        <i class="far fa-share-square"></i>
                        <span>Share</span>
                    </button>
                </div>
                <button class="hover:text-purple-500 transition-colors" onclick="handleBookmark('${gossip.id}')">
                    <i class="far fa-bookmark"></i>
                </button>
            </div>
            
            <!-- Comments Section -->
            <div id="comments-${gossip.id}" class="mt-4 hidden">
                <div class="space-y-4">
                    ${renderComments(gossip.comments)}
                </div>
                <div class="mt-4">
                    <div class="flex space-x-2">
                        <input type="text" placeholder="Add a comment..." class="flex-1 bg-dark-lighter rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500">
                        <button class="px-4 py-2 bg-purple-500 rounded-lg hover:bg-purple-600 transition-colors">
                            Post
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
};

// Create New Gossip
const createGossip = async (content, category, media = null) => {
    try {
        const formData = new FormData();
        formData.append('content', content);
        formData.append('category', category);
        if (media) {
            formData.append('media', media);
        }

        const response = await fetch('/api/gossips', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            showMessage('Gossip posted successfully!');
            loadGossips(currentCategory, currentSort);
        } else {
            showError('Failed to post gossip');
        }
    } catch (error) {
        showError('Failed to post gossip');
    }
};

// Handle Category Selection
const handleCategorySelect = (category) => {
    currentCategory = category;
    loadGossips(category, currentSort);
    
    // Update UI
    categoryLinks.forEach(link => {
        link.classList.toggle('text-purple-500', link.dataset.category === category);
    });
};

// Search Functionality
const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    // Implement search logic here
    console.log('Searching gossips:', searchTerm);
};

// Utility Functions
const formatTimeAgo = (date) => {
    const now = new Date();
    const diff = (now - new Date(date)) / 1000; // difference in seconds

    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    
    return new Date(date).toLocaleDateString();
};

const formatNumber = (num) => {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
};

const showMessage = (message) => {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg z-50';
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);
    setTimeout(() => messageDiv.remove(), 3000);
};

const showError = (message) => {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg z-50';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    setTimeout(() => errorDiv.remove(), 3000);
};

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Load initial gossips
    loadGossips();

    // Search Input
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }

    // Category Links
    categoryLinks.forEach(link => {
        link.addEventListener('click', () => {
            handleCategorySelect(link.dataset.category);
        });
    });

    // Trending Gossips
    trendingGossips.forEach(gossip => {
        gossip.addEventListener('click', () => {
            const category = gossip.dataset.category;
            handleCategorySelect(category);
        });
    });

    // Create Gossip Button
    if (createGossipButton) {
        createGossipButton.addEventListener('click', () => {
            // Show create gossip modal or form
            console.log('Open create gossip modal');
        });
    }
});
