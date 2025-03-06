// DOM Elements
const editProfileButton = document.querySelector('#editProfileButton');
const shareProfileButton = document.querySelector('#shareProfileButton');
const profileTabs = document.querySelectorAll('.profile-tab');
const mediaGrid = document.querySelector('#mediaGrid');
const postsContainer = document.querySelector('#postsContainer');
const likesContainer = document.querySelector('#likesContainer');
const followersCount = document.querySelector('#followersCount');
const followingCount = document.querySelector('#followingCount');
const postsCount = document.querySelector('#postsCount');

// Profile Stats
let stats = {
    followers: 0,
    following: 0,
    posts: 0
};

// Profile Data Management
const loadProfileStats = async () => {
    try {
        const response = await fetch('/api/profile/stats');
        if (response.ok) {
            stats = await response.json();
            updateStatsDisplay();
        }
    } catch (error) {
        console.error('Failed to load profile stats:', error);
    }
};

const updateStatsDisplay = () => {
    if (followersCount) followersCount.textContent = formatNumber(stats.followers);
    if (followingCount) followingCount.textContent = formatNumber(stats.following);
    if (postsCount) postsCount.textContent = formatNumber(stats.posts);
};

// Tab Management
const switchTab = (tabId) => {
    // Remove active class from all tabs
    profileTabs.forEach(tab => {
        tab.classList.remove('text-purple-500', 'border-b-2', 'border-purple-500');
        tab.classList.add('text-gray-400');
    });

    // Add active class to selected tab
    const selectedTab = document.querySelector(`[data-tab="${tabId}"]`);
    if (selectedTab) {
        selectedTab.classList.remove('text-gray-400');
        selectedTab.classList.add('text-purple-500', 'border-b-2', 'border-purple-500');
    }

    // Hide all content sections
    [mediaGrid, postsContainer, likesContainer].forEach(container => {
        if (container) container.classList.add('hidden');
    });

    // Show selected content section
    const selectedContainer = document.querySelector(`#${tabId}Container`);
    if (selectedContainer) {
        selectedContainer.classList.remove('hidden');
    }

    // Load content based on tab
    switch (tabId) {
        case 'media':
            loadMediaContent();
            break;
        case 'posts':
            loadPosts();
            break;
        case 'likes':
            loadLikes();
            break;
    }
};

// Content Loading Functions
const loadMediaContent = async () => {
    try {
        const response = await fetch('/api/profile/media');
        if (response.ok) {
            const media = await response.json();
            renderMediaGrid(media);
        }
    } catch (error) {
        showError('Failed to load media content');
    }
};

const loadPosts = async () => {
    try {
        const response = await fetch('/api/profile/posts');
        if (response.ok) {
            const posts = await response.json();
            renderPosts(posts);
        }
    } catch (error) {
        showError('Failed to load posts');
    }
};

const loadLikes = async () => {
    try {
        const response = await fetch('/api/profile/likes');
        if (response.ok) {
            const likes = await response.json();
            renderLikes(likes);
        }
    } catch (error) {
        showError('Failed to load likes');
    }
};

// Rendering Functions
const renderMediaGrid = (mediaItems) => {
    if (!mediaGrid) return;
    
    mediaGrid.innerHTML = mediaItems.map(item => `
        <div class="glass-effect rounded-xl overflow-hidden hover-scale cursor-pointer aspect-square">
            <img src="${item.url}" alt="Media" class="w-full h-full object-cover">
        </div>
    `).join('');
};

const renderPosts = (posts) => {
    if (!postsContainer) return;

    postsContainer.innerHTML = posts.map(post => `
        <div class="glass-effect rounded-xl p-4 hover-scale mb-4">
            <div class="flex items-center mb-4">
                <img src="${post.authorAvatar}" alt="User" class="w-10 h-10 rounded-full">
                <div class="ml-3">
                    <h3 class="font-semibold">${post.authorName}</h3>
                    <p class="text-sm text-gray-400">${formatDate(post.createdAt)}</p>
                </div>
            </div>
            <p class="mb-4">${post.content}</p>
            ${post.media ? `<img src="${post.media}" alt="Post" class="rounded-lg w-full mb-4">` : ''}
            <div class="flex items-center justify-between">
                <div class="flex space-x-4">
                    <button class="flex items-center space-x-2 hover:text-purple-500 transition-colors">
                        <i class="far fa-heart"></i>
                        <span>${formatNumber(post.likes)}</span>
                    </button>
                    <button class="flex items-center space-x-2 hover:text-purple-500 transition-colors">
                        <i class="far fa-comment"></i>
                        <span>${formatNumber(post.comments)}</span>
                    </button>
                    <button class="flex items-center space-x-2 hover:text-purple-500 transition-colors">
                        <i class="far fa-share-square"></i>
                        <span>Share</span>
                    </button>
                </div>
                <button class="hover:text-purple-500 transition-colors">
                    <i class="far fa-bookmark"></i>
                </button>
            </div>
        </div>
    `).join('');
};

const renderLikes = (likes) => {
    if (!likesContainer) return;

    likesContainer.innerHTML = likes.map(like => `
        <div class="glass-effect rounded-xl p-4 hover-scale mb-4">
            <div class="flex items-center mb-4">
                <img src="${like.authorAvatar}" alt="User" class="w-10 h-10 rounded-full">
                <div class="ml-3">
                    <h3 class="font-semibold">${like.authorName}</h3>
                    <p class="text-sm text-gray-400">${formatDate(like.createdAt)}</p>
                </div>
            </div>
            <p class="mb-4">${like.content}</p>
            ${like.media ? `<img src="${like.media}" alt="Post" class="rounded-lg w-full mb-4">` : ''}
            <div class="flex items-center justify-between">
                <div class="flex space-x-4">
                    <button class="flex items-center space-x-2 text-purple-500">
                        <i class="fas fa-heart"></i>
                        <span>${formatNumber(like.likes)}</span>
                    </button>
                    <button class="flex items-center space-x-2 hover:text-purple-500 transition-colors">
                        <i class="far fa-comment"></i>
                        <span>${formatNumber(like.comments)}</span>
                    </button>
                    <button class="flex items-center space-x-2 hover:text-purple-500 transition-colors">
                        <i class="far fa-share-square"></i>
                        <span>Share</span>
                    </button>
                </div>
                <button class="hover:text-purple-500 transition-colors">
                    <i class="far fa-bookmark"></i>
                </button>
            </div>
        </div>
    `).join('');
};

// Utility Functions
const formatNumber = (num) => {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
};

const formatDate = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = (now - d) / 1000; // difference in seconds

    if (diff < 60) return 'just now';
    if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
    if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
    if (diff < 604800) return Math.floor(diff / 86400) + 'd ago';
    
    return d.toLocaleDateString();
};

const showError = (message) => {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg z-50';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    setTimeout(() => errorDiv.remove(), 3000);
};

// Share Profile
const shareProfile = async () => {
    const profileUrl = window.location.href;
    
    try {
        if (navigator.share) {
            await navigator.share({
                title: 'Check out my profile!',
                url: profileUrl
            });
        } else {
            await navigator.clipboard.writeText(profileUrl);
            showMessage('Profile link copied to clipboard!');
        }
    } catch (error) {
        showError('Failed to share profile');
    }
};

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Load initial stats
    loadProfileStats();

    // Tab switching
    profileTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            switchTab(tab.dataset.tab);
        });
    });

    // Share Profile Button
    if (shareProfileButton) {
        shareProfileButton.addEventListener('click', shareProfile);
    }

    // Edit Profile Button
    if (editProfileButton) {
        editProfileButton.addEventListener('click', () => {
            window.location.href = 'edit-profile.html';
        });
    }

    // Initialize with posts tab
    switchTab('posts');
});
