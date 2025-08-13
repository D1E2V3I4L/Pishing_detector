// Popup script for Phishing Detector Pro
// Handles UI interactions and communicates with background script

// DOM elements
const statusIcon = document.getElementById('statusIcon');
const statusText = document.getElementById('statusText');
const siteUrl = document.getElementById('siteUrl');
const siteDomain = document.getElementById('siteDomain');
const safetyCard = document.getElementById('safetyCard');
const safetyIcon = document.getElementById('safetyIcon');
const safetyText = document.getElementById('safetyText');
const safetyDetails = document.getElementById('safetyDetails');
const toggleConfig = document.getElementById('toggleConfig');
const configContent = document.getElementById('configContent');
const apiKeyInput = document.getElementById('apiKeyInput');
const saveApiKey = document.getElementById('saveApiKey');
const loadingOverlay = document.getElementById('loadingOverlay');

// Initialize popup
document.addEventListener('DOMContentLoaded', async () => {
    await initializePopup();
    setupEventListeners();
});

// Initialize popup data
async function initializePopup() {
    try {
        // Get current active tab
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        if (!tab) {
            showError('No active tab found');
            return;
        }
        
        // Update site information (show only website name)
        updateSiteInfo(tab.url);
        
        // Get safety status from background script
        await getSafetyStatus(tab.id);
        
        // Load API key
        await loadApiKey();
        
    } catch (error) {
        console.error('Error initializing popup:', error);
        showError('Failed to initialize popup');
    }
}

// Update site information display - show only website name
function updateSiteInfo(url) {
    try {
        const urlObj = new URL(url);
        
        // Show only the website name (domain) instead of full URL
        const websiteName = urlObj.hostname.replace('www.', '');
        siteUrl.textContent = websiteName;
        siteDomain.textContent = urlObj.hostname;
        
    } catch (error) {
        siteUrl.textContent = 'Invalid URL';
        siteDomain.textContent = 'Unknown';
    }
}



// Get safety status from background script
async function getSafetyStatus(tabId) {
    try {
        showLoading(true);
        
        console.log('Triggering safety check for tab:', tabId);
        
        // First, trigger a safety check for the current tab
        const checkResponse = await chrome.runtime.sendMessage({
            action: 'checkUrlSafety',
            tabId: tabId
        });
        
        console.log('Safety check response:', checkResponse);
        
        // Wait a bit for the check to complete
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Then get the safety status
        const response = await chrome.runtime.sendMessage({
            action: 'getSafetyStatus',
            tabId: tabId
        });
        
        console.log('Safety status response:', response);
        updateSafetyDisplay(response);
        
    } catch (error) {
        console.error('Error getting safety status:', error);
        showError('Failed to check safety status');
    } finally {
        showLoading(false);
    }
}



// Update safety display
function updateSafetyDisplay(status) {
    // Update status indicator
    if (status.safetyStatus === 'safe') {
        statusIcon.textContent = '✅';
        statusText.textContent = 'Safe';
    } else if (status.safetyStatus === 'unsafe') {
        statusIcon.textContent = '⚠️';
        statusText.textContent = 'Unsafe';
    } else {
        statusIcon.textContent = '❓';
        statusText.textContent = 'Unknown';
    }
    
    // Update safety card
    safetyCard.className = `safety-card ${status.safetyStatus}`;
    
    if (status.safetyStatus === 'safe') {
        safetyIcon.textContent = '✅';
        safetyText.textContent = 'Site is Safe';
        safetyDetails.textContent = 'This website appears to be safe and legitimate.';
    } else if (status.safetyStatus === 'unsafe') {
        safetyIcon.textContent = '⚠️';
        safetyText.textContent = 'Site May Be Unsafe';
        safetyDetails.textContent = status.warningMessage || 'This website may contain threats.';
    } else {
        safetyIcon.textContent = '❓';
        safetyText.textContent = 'Status Unknown';
        safetyDetails.textContent = 'Unable to determine site safety. Please check your API key configuration.';
    }
}

// Load API key from storage
async function loadApiKey() {
    try {
        const response = await chrome.runtime.sendMessage({ action: 'getApiKey' });
        apiKeyInput.value = response.apiKey || '';
    } catch (error) {
        console.error('Error loading API key:', error);
    }
}



// Setup event listeners
function setupEventListeners() {
    // Toggle API configuration
    toggleConfig.addEventListener('click', () => {
        const isVisible = configContent.style.display !== 'none';
        configContent.style.display = isVisible ? 'none' : 'block';
        toggleConfig.textContent = isVisible ? 'Show' : 'Hide';
    });
    
    // Save API key
    saveApiKey.addEventListener('click', async () => {
        const apiKey = apiKeyInput.value.trim();
        
        if (!apiKey) {
            showError('Please enter a valid API key');
            return;
        }
        
        try {
            showLoading(true);
            
            const response = await chrome.runtime.sendMessage({
                action: 'setApiKey',
                apiKey: apiKey
            });
            
            if (response.success) {
                showSuccess('API key saved successfully');
                
                // Re-check current tab safety
                const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
                if (tab) {
                    await getSafetyStatus(tab.id);
                }
            } else {
                showError('Failed to save API key');
            }
            
        } catch (error) {
            console.error('Error saving API key:', error);
            showError('Failed to save API key');
        } finally {
            showLoading(false);
        }
    });
    
    // Enter key to save API key
    apiKeyInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            saveApiKey.click();
        }
    });
}

// Show loading overlay
function showLoading(show) {
    if (show) {
        loadingOverlay.classList.add('show');
    } else {
        loadingOverlay.classList.remove('show');
    }
}

// Show error message
function showError(message) {
    safetyCard.className = 'safety-card unknown';
    safetyIcon.textContent = '❌';
    safetyText.textContent = 'Error';
    safetyDetails.textContent = message;
    
    statusIcon.textContent = '❌';
    statusText.textContent = 'Error';
}

// Show success message
function showSuccess(message) {
    // Create temporary success notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
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

// Refresh popup when tab changes
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.active) {
        // Small delay to ensure background script has processed the URL
        setTimeout(() => {
            initializePopup();
        }, 500);
    }
});

// Handle popup focus to refresh data
window.addEventListener('focus', () => {
    initializePopup();
});
