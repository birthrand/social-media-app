// Story Data
const stories = {
    'user1': [
        {
            id: 1,
            user: 'Sarah Johnson',
            userImage: 'https://i.pravatar.cc/150?img=1',
            content: 'https://picsum.photos/seed/story1/900/1600',
            timestamp: '2 hours ago',
            type: 'image'
        },
        {
            id: 2,
            user: 'Sarah Johnson',
            userImage: 'https://i.pravatar.cc/150?img=1',
            content: 'https://picsum.photos/seed/story2/900/1600',
            timestamp: '1 hour ago',
            type: 'image'
        },
        {
            id: 3,
            user: 'Sarah Johnson',
            userImage: 'https://i.pravatar.cc/150?img=1',
            content: 'Just finished my latest design project! 🎨',
            timestamp: '30 minutes ago',
            type: 'text',
            background: 'bg-gradient-to-r from-purple-500 to-pink-500'
        }
    ],
    'user2': [
        {
            id: 4,
            user: 'Alex Turner',
            userImage: 'https://i.pravatar.cc/150?img=2',
            content: 'https://picsum.photos/seed/story3/900/1600',
            timestamp: '3 hours ago',
            type: 'image'
        },
        {
            id: 5,
            user: 'Alex Turner',
            userImage: 'https://i.pravatar.cc/150?img=2',
            content: 'Amazing sunset view from the mountain top! 🌄',
            timestamp: '2 hours ago',
            type: 'text',
            background: 'bg-gradient-to-r from-blue-500 to-purple-500'
        },
        {
            id: 6,
            user: 'Alex Turner',
            userImage: 'https://i.pravatar.cc/150?img=2',
            content: 'https://picsum.photos/seed/story4/900/1600',
            timestamp: '1 hour ago',
            type: 'image'
        }
    ],
    'user3': [
        {
            id: 7,
            user: 'Tech Insider',
            userImage: 'https://i.pravatar.cc/150?img=3',
            content: 'Breaking: Major tech announcement coming! 🚀',
            timestamp: '4 hours ago',
            type: 'text',
            background: 'bg-gradient-to-r from-green-500 to-blue-500'
        },
        {
            id: 8,
            user: 'Tech Insider',
            userImage: 'https://i.pravatar.cc/150?img=3',
            content: 'https://picsum.photos/seed/story5/900/1600',
            timestamp: '3 hours ago',
            type: 'image'
        },
        {
            id: 9,
            user: 'Tech Insider',
            userImage: 'https://i.pravatar.cc/150?img=3',
            content: 'https://picsum.photos/seed/story6/900/1600',
            timestamp: '2 hours ago',
            type: 'image'
        }
    ]
};

// Story Viewer
class StoryViewer {
    constructor() {
        this.currentStoryIndex = 0;
        this.currentUserIndex = 0;
        this.users = Object.keys(stories);
        this.progressInterval = null;
        this.storyDuration = 5000; // 5 seconds per story
    }

    createViewer() {
        const viewer = document.createElement('div');
        viewer.id = 'storyViewer';
        viewer.className = 'fixed inset-0 bg-black z-50 flex items-center justify-center';
        return viewer;
    }

    createStoryContent(story) {
        const content = document.createElement('div');
        content.className = 'relative w-full max-w-lg mx-auto h-[80vh] bg-dark-accent rounded-lg overflow-hidden';

        // Progress bars
        const progressContainer = document.createElement('div');
        progressContainer.className = 'absolute top-0 left-0 right-0 flex gap-1 p-2 z-10';
        const currentUserStories = stories[this.users[this.currentUserIndex]];
        currentUserStories.forEach((_, index) => {
            const progress = document.createElement('div');
            progress.className = 'flex-1 h-1 bg-gray-600 rounded-full overflow-hidden';
            if (index < this.currentStoryIndex) {
                progress.innerHTML = '<div class="w-full h-full bg-white"></div>';
            } else if (index === this.currentStoryIndex) {
                progress.innerHTML = '<div class="w-0 h-full bg-white" id="currentProgress"></div>';
            }
            progressContainer.appendChild(progress);
        });
        content.appendChild(progressContainer);

        // Header
        const header = document.createElement('div');
        header.className = 'absolute top-0 left-0 right-0 flex items-center justify-between p-4 z-10';
        header.innerHTML = `
            <div class="flex items-center">
                <img src="${story.userImage}" alt="${story.user}" class="w-8 h-8 rounded-full">
                <div class="ml-2">
                    <h3 class="font-semibold text-white">${story.user}</h3>
                    <p class="text-xs text-gray-300">${story.timestamp}</p>
                </div>
            </div>
            <button class="text-white text-xl" onclick="closeStory()">×</button>
        `;
        content.appendChild(header);

        // Story content
        if (story.type === 'image') {
            const img = document.createElement('img');
            img.src = story.content;
            img.className = 'w-full h-full object-cover';
            content.appendChild(img);
        } else {
            const textContainer = document.createElement('div');
            textContainer.className = `w-full h-full ${story.background} flex items-center justify-center p-8`;
            textContainer.innerHTML = `<p class="text-2xl text-white text-center font-semibold">${story.content}</p>`;
            content.appendChild(textContainer);
        }

        // Navigation buttons
        const prevButton = document.createElement('button');
        prevButton.className = 'absolute left-4 top-1/2 -translate-y-1/2 text-white opacity-75 hover:opacity-100';
        prevButton.innerHTML = '<i class="fas fa-chevron-left text-2xl"></i>';
        prevButton.onclick = () => this.previousStory();

        const nextButton = document.createElement('button');
        nextButton.className = 'absolute right-4 top-1/2 -translate-y-1/2 text-white opacity-75 hover:opacity-100';
        nextButton.innerHTML = '<i class="fas fa-chevron-right text-2xl"></i>';
        nextButton.onclick = () => this.nextStory();

        content.appendChild(prevButton);
        content.appendChild(nextButton);

        return content;
    }

    showStory(userIndex = 0, storyIndex = 0) {
        this.currentUserIndex = userIndex;
        this.currentStoryIndex = storyIndex;

        const viewer = this.createViewer();
        const currentStory = stories[this.users[this.currentUserIndex]][this.currentStoryIndex];
        viewer.appendChild(this.createStoryContent(currentStory));
        document.body.appendChild(viewer);

        this.startProgress();
    }

    startProgress() {
        const progressBar = document.getElementById('currentProgress');
        let width = 0;
        const increment = 100 / (this.storyDuration / 100); // Progress increment per 100ms

        this.progressInterval = setInterval(() => {
            if (width >= 100) {
                this.nextStory();
            } else {
                width += increment;
                progressBar.style.width = width + '%';
            }
        }, 100);
    }

    nextStory() {
        clearInterval(this.progressInterval);
        const currentUserStories = stories[this.users[this.currentUserIndex]];

        if (this.currentStoryIndex < currentUserStories.length - 1) {
            // Next story of current user
            this.currentStoryIndex++;
        } else if (this.currentUserIndex < this.users.length - 1) {
            // First story of next user
            this.currentUserIndex++;
            this.currentStoryIndex = 0;
        } else {
            // End of all stories
            this.closeViewer();
            return;
        }

        const viewer = document.getElementById('storyViewer');
        const currentStory = stories[this.users[this.currentUserIndex]][this.currentStoryIndex];
        viewer.innerHTML = '';
        viewer.appendChild(this.createStoryContent(currentStory));
        this.startProgress();
    }

    previousStory() {
        clearInterval(this.progressInterval);
        if (this.currentStoryIndex > 0) {
            // Previous story of current user
            this.currentStoryIndex--;
        } else if (this.currentUserIndex > 0) {
            // Last story of previous user
            this.currentUserIndex--;
            this.currentStoryIndex = stories[this.users[this.currentUserIndex]].length - 1;
        } else {
            // Beginning of all stories
            return;
        }

        const viewer = document.getElementById('storyViewer');
        const currentStory = stories[this.users[this.currentUserIndex]][this.currentStoryIndex];
        viewer.innerHTML = '';
        viewer.appendChild(this.createStoryContent(currentStory));
        this.startProgress();
    }

    closeViewer() {
        clearInterval(this.progressInterval);
        const viewer = document.getElementById('storyViewer');
        if (viewer) {
            viewer.remove();
        }
    }
}

// Initialize story viewer
const storyViewer = new StoryViewer();

// Global functions for story interaction
function openStory(userIndex) {
    storyViewer.showStory(userIndex);
}

function closeStory() {
    storyViewer.closeViewer();
}

// Handle keyboard navigation
document.addEventListener('keydown', (e) => {
    const viewer = document.getElementById('storyViewer');
    if (!viewer) return;

    if (e.key === 'ArrowLeft') {
        storyViewer.previousStory();
    } else if (e.key === 'ArrowRight' || e.key === ' ') {
        storyViewer.nextStory();
    } else if (e.key === 'Escape') {
        storyViewer.closeViewer();
    }
});
