// DOM Elements
const communityPosts = document.querySelector('#communityPosts');
const createPostButton = document.querySelector('#createPostButton');
const createPostModal = document.querySelector('#createPostModal');
const joinCommunityButton = document.querySelector('#joinCommunityButton');
const memberCount = document.querySelector('#memberCount');
const postCount = document.querySelector('#postCount');
const sortSelect = document.querySelector('#sortSelect');
const filterSelect = document.querySelector('#filterSelect');

// Community Data
let communityData = {
    members: 0,
    posts: 0,
    isMember: false
};

// Post Management
const loadPosts = async (sort = 'recent', filter = 'all') => {
    try {
        const response = await fetch(`/api/community/posts?sort=${sort}&filter=${filter}`);
        if (response.ok) {
            const posts = await response.json();
            renderPosts(posts);
        }
    } catch (error) {
        showError('Failed to load posts');
    }
};

const renderPosts = (posts) => {
    if (!communityPosts) return;

    communityPosts.innerHTML = posts.map(post => `
        <div class="glass-effect rounded-xl p-4 hover-scale mb-4" data-post-id="${post.id}">
            <div class="flex items-center mb-4">
                <img src="${post.authorAvatar}" alt="User" class="w-10 h-10 rounded-full">
                <div class="ml-3 flex-1">
                    <div class="flex items-center justify-between">
                        <h3 class="font-semibold">${post.authorName}</h3>
                        <span class="text-sm text-gray-400">${formatDate(post.createdAt)}</span>
                    </div>
                    <p class="text-sm text-gray-400">${post.authorRole || 'Member'}</p>
                </div>
            </div>
            <div class="mb-4">
                <h4 class="text-lg font-semibold mb-2">${post.title}</h4>
                <p class="text-gray-300">${post.content}</p>
                ${post.media ? `
                    <div class="mt-4">
                        ${post.mediaType === 'image' 
                            ? `<img src="${post.media}" alt="Post media" class="rounded-lg w-full">` 
                            : `<video src="${post.media}" controls class="rounded-lg w-full"></video>`
                        }
                    </div>
                ` : ''}
            </div>
            <div class="flex items-center justify-between">
                <div class="flex space-x-4">
                    <button class="flex items-center space-x-2 hover:text-purple-500 transition-colors" onclick="handleLike('${post.id}')">
                        <i class="far fa-heart"></i>
                        <span>${formatNumber(post.likes)}</span>
                    </button>
                    <button class="flex items-center space-x-2 hover:text-purple-500 transition-colors" onclick="handleComment('${post.id}')">
                        <i class="far fa-comment"></i>
                        <span>${formatNumber(post.comments)}</span>
                    </button>
                    <button class="flex items-center space-x-2 hover:text-purple-500 transition-colors" onclick="handleShare('${post.id}')">
                        <i class="far fa-share-square"></i>
                        <span>Share</span>
                    </button>
                </div>
                <button class="hover:text-purple-500 transition-colors" onclick="handleBookmark('${post.id}')">
                    <i class="far fa-bookmark"></i>
                </button>
            </div>
            
            <!-- Comments Section -->
            <div id="comments-${post.id}" class="mt-4 hidden">
                <div class="space-y-4">
                    ${renderComments(post.comments)}
                </div>
                <div class="mt-4">
                    <div class="flex space-x-2">
                        <input type="text" placeholder="Write a comment..." class="flex-1 bg-dark-lighter rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500">
                        <button class="px-4 py-2 bg-purple-500 rounded-lg hover:bg-purple-600 transition-colors">
                            Post
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
};

const renderComments = (comments) => {
    return comments.map(comment => `
        <div class="flex space-x-3">
            <img src="${comment.authorAvatar}" alt="User" class="w-8 h-8 rounded-full">
            <div class="flex-1 glass-effect rounded-lg p-3">
                <div class="flex items-center justify-between mb-1">
                    <h4 class="font-medium">${comment.authorName}</h4>
                    <span class="text-sm text-gray-400">${formatDate(comment.createdAt)}</span>
                </div>
                <p class="text-gray-300">${comment.content}</p>
            </div>
        </div>
    `).join('');
};

// Post Creation
const handleCreatePost = async (e) => {
    e.preventDefault();
    const form = e.target;
    const title = form.querySelector('#postTitle').value;
    const content = form.querySelector('#postContent').value;
    const media = form.querySelector('#postMedia').files[0];

    try {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        if (media) {
            formData.append('media', media);
        }

        const response = await fetch('/api/community/posts', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            closeCreatePostModal();
            showMessage('Post created successfully!');
            loadPosts(sortSelect.value, filterSelect.value);
        } else {
            showError('Failed to create post');
        }
    } catch (error) {
        showError('Failed to create post');
    }
};

// Community Membership
const handleJoinCommunity = async () => {
    try {
        const action = communityData.isMember ? 'leave' : 'join';
        const response = await fetch(`/api/community/${action}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            communityData.isMember = !communityData.isMember;
            updateJoinButton();
            showMessage(`Successfully ${action}ed the community!`);
        }
    } catch (error) {
        showError(`Failed to ${communityData.isMember ? 'leave' : 'join'} community`);
    }
};

const updateJoinButton = () => {
    if (!joinCommunityButton) return;

    joinCommunityButton.textContent = communityData.isMember ? 'Leave Community' : 'Join Community';
    joinCommunityButton.classList.toggle('bg-red-500', communityData.isMember);
    joinCommunityButton.classList.toggle('bg-purple-500', !communityData.isMember);
};

// Modal Management
const openCreatePostModal = () => {
    if (!createPostModal) return;
    createPostModal.classList.remove('hidden');
};

const closeCreatePostModal = () => {
    if (!createPostModal) return;
    createPostModal.classList.add('hidden');
    // Reset form
    document.querySelector('#createPostForm').reset();
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
    // Load initial posts
    loadPosts();

    // Create Post Button
    if (createPostButton) {
        createPostButton.addEventListener('click', openCreatePostModal);
    }

    // Join Community Button
    if (joinCommunityButton) {
        joinCommunityButton.addEventListener('click', handleJoinCommunity);
    }

    // Sort Select
    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            loadPosts(sortSelect.value, filterSelect.value);
        });
    }

    // Filter Select
    if (filterSelect) {
        filterSelect.addEventListener('change', () => {
            loadPosts(sortSelect.value, filterSelect.value);
        });
    }

    // Close Modal on Outside Click
    window.addEventListener('click', (e) => {
        if (e.target === createPostModal) {
            closeCreatePostModal();
        }
    });

    // Close Modal on Escape Key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !createPostModal.classList.contains('hidden')) {
            closeCreatePostModal();
        }
    });
});
