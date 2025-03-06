// DOM Elements
const accountSettingsForm = document.querySelector('#accountSettingsForm');
const privacySettingsForm = document.querySelector('#privacySettingsForm');
const notificationSettingsForm = document.querySelector('#notificationSettingsForm');
const changePasswordButton = document.querySelector('#changePasswordButton');
const changePasswordModal = document.querySelector('#changePasswordModal');

// Account Settings
const handleAccountSettings = async (e) => {
    e.preventDefault();
    const email = document.querySelector('#accountEmail').value;

    try {
        const response = await fetch('/api/settings/account', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        if (response.ok) {
            showMessage('Account settings updated successfully');
        } else {
            showError('Failed to update account settings');
        }
    } catch (error) {
        showError('Failed to update account settings');
    }
};

// Privacy Settings
const handlePrivacySettings = async (e) => {
    e.preventDefault();
    const privateAccount = document.querySelector('#privateAccount').checked;
    const showActivity = document.querySelector('#showActivity').checked;

    try {
        const response = await fetch('/api/settings/privacy', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                privateAccount,
                showActivity
            })
        });

        if (response.ok) {
            showMessage('Privacy settings updated successfully');
        } else {
            showError('Failed to update privacy settings');
        }
    } catch (error) {
        showError('Failed to update privacy settings');
    }
};

// Notification Settings
const handleNotificationSettings = async (e) => {
    e.preventDefault();
    const pushNotifications = document.querySelector('#pushNotifications').checked;
    const emailNotifications = document.querySelector('#emailNotifications').checked;

    try {
        const response = await fetch('/api/settings/notifications', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                pushNotifications,
                emailNotifications
            })
        });

        if (response.ok) {
            showMessage('Notification settings updated successfully');
        } else {
            showError('Failed to update notification settings');
        }
    } catch (error) {
        showError('Failed to update notification settings');
    }
};

// Password Change
const handlePasswordChange = async (e) => {
    e.preventDefault();
    const currentPassword = document.querySelector('#currentPassword').value;
    const newPassword = document.querySelector('#newPassword').value;
    const confirmPassword = document.querySelector('#confirmPassword').value;

    if (newPassword !== confirmPassword) {
        showError('New passwords do not match');
        return;
    }

    try {
        const response = await fetch('/api/settings/password', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                currentPassword,
                newPassword
            })
        });

        if (response.ok) {
            showMessage('Password updated successfully');
            closePasswordModal();
        } else {
            showError('Failed to update password');
        }
    } catch (error) {
        showError('Failed to update password');
    }
};

// Modal Functions
const openPasswordModal = () => {
    changePasswordModal.classList.remove('hidden');
};

const closePasswordModal = () => {
    changePasswordModal.classList.add('hidden');
    // Clear form
    document.querySelector('#currentPassword').value = '';
    document.querySelector('#newPassword').value = '';
    document.querySelector('#confirmPassword').value = '';
};

// Toggle Switch Functions
const handleToggleSwitch = (toggleId, label) => {
    const toggle = document.querySelector(`#${toggleId}`);
    toggle.addEventListener('change', () => {
        showMessage(`${label} ${toggle.checked ? 'enabled' : 'disabled'}`);
    });
};

// Utility Functions
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
    // Account Settings Form
    if (accountSettingsForm) {
        accountSettingsForm.addEventListener('submit', handleAccountSettings);
    }

    // Privacy Settings Form
    if (privacySettingsForm) {
        privacySettingsForm.addEventListener('submit', handlePrivacySettings);
    }

    // Notification Settings Form
    if (notificationSettingsForm) {
        notificationSettingsForm.addEventListener('submit', handleNotificationSettings);
    }

    // Change Password Button
    if (changePasswordButton) {
        changePasswordButton.addEventListener('click', openPasswordModal);
    }

    // Toggle Switches
    handleToggleSwitch('privateAccount', 'Private account');
    handleToggleSwitch('showActivity', 'Activity status');
    handleToggleSwitch('pushNotifications', 'Push notifications');
    handleToggleSwitch('emailNotifications', 'Email notifications');

    // Close Modal on Outside Click
    window.addEventListener('click', (e) => {
        if (e.target === changePasswordModal) {
            closePasswordModal();
        }
    });

    // Close Modal on Escape Key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !changePasswordModal.classList.contains('hidden')) {
            closePasswordModal();
        }
    });
});
