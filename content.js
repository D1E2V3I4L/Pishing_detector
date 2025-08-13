// Content script for Phishing Detector Pro
// Injects warning banner into web pages

// Function to be injected into the page
function injectBanner(message) {
  try {
    // Remove existing banner if present
    const existingBanner = document.getElementById('phishing-detector-banner');
    if (existingBanner) {
      existingBanner.remove();
    }
    
    // Create warning banner
    const banner = document.createElement('div');
    banner.id = 'phishing-detector-banner';
    banner.innerHTML = `
      <div class="phishing-warning">
        <span class="warning-icon">⚠️</span>
        <span class="warning-text">${message}</span>
        <button class="warning-close" onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
    `;
    
    // Insert at the top of the page
    if (document.body) {
      document.body.insertBefore(banner, document.body.firstChild);
      
      // Trigger slide-down animation
      setTimeout(() => {
        banner.classList.add('show');
      }, 100);
    }
  } catch (error) {
    console.error('Error in injectBanner function:', error);
  }
}

console.log('Phishing Detector Pro content script loaded');

