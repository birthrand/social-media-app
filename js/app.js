// DOM Elements
const loginForm = document.querySelector('#loginForm');
const registerForm = document.querySelector('#registerForm');
const searchInput = document.querySelector('#searchInput');
const createPostForm = document.querySelector('#createPostForm');
const likeButtons = document.querySelectorAll('.like-button');
const commentButtons = document.querySelectorAll('.comment-button');
const shareButtons = document.querySelectorAll('.share-button');
const bookmarkButtons = document.querySelectorAll('.bookmark-button');
const followButtons = document.querySelectorAll('.follow-button');
const notificationButton = document.querySelector('#notificationButton');
const messageButton = document.querySelector('#messageButton');

// Authentication Functions
const handleLogin = async (e) => {
    e.preventDefault();
    const email = document.querySelector('#loginEmail').value;
    const password = document.querySelector('#loginPassword').value;
    const rememberMe = document.querySelector('#rememberMe').checked;

    try {
        // Simulate API call
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, rememberMe })
        });

        if (response.ok) {
            window.location.href = 'index.html';
        } else {
            showError('Invalid credentials');
        }
    } catch (error) {
        showError('Login failed. Please try again.');
    }
};

const handleRegister = async (e) => {
    e.preventDefault();
    const firstName = document.querySelector('#firstName').value;
    const lastName = document.querySelector('#lastName').value;
    const username = document.querySelector('#username').value;
    const email = document.querySelector('#registerEmail').value;
    const password = document.querySelector('#registerPassword').value;
    const confirmPassword = document.querySelector('#confirmPassword').value;
    const termsAccepted = document.querySelector('#termsAccepted').checked;

    if (password !== confirmPassword) {
        showError('Passwords do not match');
        return;
    }

    if (!termsAccepted) {
        showError('Please accept the Terms of Service');
        return;
    }

    try {
        // Simulate API call
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                firstName,
                lastName,
                username,
                email,
                password
            })
        });

        if (response.ok) {
            window.location.href = 'login.html';
        } else {
            showError('Registration failed');
        }
    } catch (error) {
        showError('Registration failed. Please try again.');
    }
};

// Post Interaction Functions
const handleLike = async (postId) => {
    try {
        const response = await fetch(`/api/posts/${postId}/like`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            const likeButton = document.querySelector(`#like-${postId}`);
            const likeCount = likeButton.querySelector('.like-count');
            const currentCount = parseInt(likeCount.textContent);
            likeCount.textContent = currentCount + 1;
            likeButton.classList.add('text-purple-500');
        }
    } catch (error) {
        showError('Failed to like post');
    }
};

const handleComment = (postId) => {
    const commentSection = document.querySelector(`#comments-${postId}`);
    commentSection.classList.toggle('hidden');
};

const handleShare = (postId) => {
    if (navigator.share) {
        navigator.share({
            title: 'Check out this post!',
            url: `${window.location.origin}/post/${postId}`
        });
    } else {
        // Fallback for browsers that don't support Web Share API
        const shareUrl = `${window.location.origin}/post/${postId}`;
        navigator.clipboard.writeText(shareUrl);
        showMessage('Link copied to clipboard!');
    }
};

const handleBookmark = async (postId) => {
    try {
        const response = await fetch(`/api/posts/${postId}/bookmark`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            const bookmarkButton = document.querySelector(`#bookmark-${postId}`);
            bookmarkButton.classList.toggle('text-purple-500');
        }
    } catch (error) {
        showError('Failed to bookmark post');
    }
};

// Profile Functions
const handleFollow = async (userId) => {
    try {
        const response = await fetch(`/api/users/${userId}/follow`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            const followButton = document.querySelector(`#follow-${userId}`);
            followButton.textContent = followButton.textContent === 'Follow' ? 'Following' : 'Follow';
            followButton.classList.toggle('bg-purple-500');
        }
    } catch (error) {
        showError('Failed to follow user');
    }
};

// Search Functionality
const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    // Implement search logic here
    console.log('Searching for:', searchTerm);
};

// Story Functions
const createStory = async (file) => {
    try {
        const formData = new FormData();
        formData.append('story', file);

        const response = await fetch('/api/stories', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            showMessage('Story created successfully!');
            // Refresh stories section
            location.reload();
        }
    } catch (error) {
        showError('Failed to create story');
    }
};

// Post Creation
const createPost = async (e) => {
    e.preventDefault();
    const content = document.querySelector('#postContent').value;
    const media = document.querySelector('#postMedia').files[0];

    try {
        const formData = new FormData();
        formData.append('content', content);
        if (media) {
            formData.append('media', media);
        }

        const response = await fetch('/api/posts', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            showMessage('Post created successfully!');
            // Refresh feed
            location.reload();
        }
    } catch (error) {
        showError('Failed to create post');
    }
};

// Utility Functions
const showError = (message) => {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    setTimeout(() => errorDiv.remove(), 3000);
};

const showMessage = (message) => {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg';
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);
    setTimeout(() => messageDiv.remove(), 3000);
};

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Login Form
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Register Form
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    // Search
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }

    // Create Post Form
    if (createPostForm) {
        createPostForm.addEventListener('submit', createPost);
    }

    // Post Interaction Buttons
    likeButtons.forEach(button => {
        button.addEventListener('click', () => handleLike(button.dataset.postId));
    });

    commentButtons.forEach(button => {
        button.addEventListener('click', () => handleComment(button.dataset.postId));
    });

    shareButtons.forEach(button => {
        button.addEventListener('click', () => handleShare(button.dataset.postId));
    });

    bookmarkButtons.forEach(button => {
        button.addEventListener('click', () => handleBookmark(button.dataset.postId));
    });

    // Follow Buttons
    followButtons.forEach(button => {
        button.addEventListener('click', () => handleFollow(button.dataset.userId));
    });

    // Notification Button
    if (notificationButton) {
        notificationButton.addEventListener('click', () => {
            // Toggle notifications panel
            document.querySelector('#notificationsPanel').classList.toggle('hidden');
        });
    }

    // Message Button
    if (messageButton) {
        messageButton.addEventListener('click', () => {
            // Toggle messages panel
            document.querySelector('#messagesPanel').classList.toggle('hidden');
        });
    }
});
