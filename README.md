# Phishing Detector Pro - Chrome Extension

A powerful Chrome extension that detects phishing and malware websites in real-time using Google Safe Browsing API.

## Features

- 🔍 **Real-time Detection**: Checks every website you visit against Google's Safe Browsing database
- 🛡️ **Dual Protection**: Analyzes both full URLs and base domains for comprehensive security
- ⚠️ **Visual Warnings**: Displays animated warning banners on unsafe sites
- 🔔 **Chrome Notifications**: Sends desktop notifications for detected threats
- 🎨 **Modern UI**: Beautiful dark-themed popup interface with gradient backgrounds and smooth animations
- ⚙️ **Easy Configuration**: Simple API key setup through the popup interface
- 📱 **Responsive Design**: Works perfectly on both desktop and mobile browsers
- 🎯 **Smart Detection**: Different warning messages for site vs link threats

## Installation

### 1. Get Google Safe Browsing API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the "Safe Browsing API" for your project
4. Create credentials (API Key) for the Safe Browsing API
5. Copy your API key

### 2. Load Extension in Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked" and select this folder
4. The extension will appear in your extensions list

### 3. Configure API Key

1. Click the extension icon in your Chrome toolbar
2. Click "Show" in the API Configuration section
3. Enter your Google Safe Browsing API key
4. Click "Save"

## How It Works

### URL Analysis
The extension checks two levels of security:
- **Full URL**: The complete URL you're visiting (e.g., `https://example.com/login`)
- **Base Domain**: The main domain (e.g., `https://example.com`)

### Threat Detection
The extension detects:
- **Malware**: Sites hosting malicious software
- **Social Engineering**: Phishing sites designed to steal information
- **Unwanted Software**: Sites distributing potentially harmful applications
- **Potentially Harmful Applications**: Sites with suspicious behavior

### Warning System
When a threat is detected:
1. **Chrome Notification**: Desktop notification appears immediately
2. **Warning Banner**: Animated red banner slides down from the top of the page
3. **Popup Status**: Extension popup shows detailed safety information

### Smart Warning Messages
- **Site + Link Threat**: "⚠️ Warning: This site or link may be unsafe."
- **Link Only Threat**: "⚠️ Warning: This link may be unsafe."
- **Site Only Threat**: "⚠️ Warning: This site may be unsafe."

## File Structure

```
phishing_detect/
├── manifest.json          # Extension configuration (Manifest V3)
├── background.js          # Service worker for API calls and notifications
├── content.js             # Content script for banner injection
├── content.css            # Warning banner styles with animations
├── popup.html             # Modern popup interface
├── popup.css              # Dark-themed popup styles with gradients
├── popup.js               # Popup functionality and API communication
├── create_icons.html      # Icon generator tool
├── icons/                 # Extension icons (generated via create_icons.html)
└── README.md              # This file
```

## Configuration

### API Key Setup
The extension requires a Google Safe Browsing API key to function. You can:
- Set it directly in `background.js` (line 5)
- Configure it through the popup interface (recommended)

### Permissions
The extension requests these permissions:
- `tabs`: To access current tab information
- `activeTab`: To interact with the current tab
- `scripting`: To inject warning banners
- `notifications`: To show desktop alerts
- `webNavigation`: To detect page loads
- `storage`: To save API key
- `<all_urls>`: To check all websites

## Usage

1. **Automatic Protection**: The extension works automatically once configured
2. **Check Current Site**: Click the extension icon to see current site safety status
3. **Real-time Updates**: Popup automatically refreshes safety status when opened
4. **Configure Settings**: Manage your API key through the popup interface

## Customization

### Warning Banner
- Modify `content.css` to change banner appearance and animations
- Edit `content.js` to change banner behavior and injection logic
- Customize warning messages in `background.js`

### Popup Interface
- Update `popup.css` for different styling and themes
- Modify `popup.html` for layout changes
- Edit `popup.js` for functionality changes and API communication

### API Configuration
- Change threat types in `background.js` (lines 95-100)
- Modify client information in API requests
- Adjust checking frequency and behavior

### Icons
- Use `create_icons.html` to generate custom extension icons
- Replace icons in the `icons/` directory with your own designs
- Required sizes: 16x16, 32x32, 48x48, 128x128 pixels

## Troubleshooting

### Extension Not Working
1. Check that your API key is valid and has Safe Browsing API enabled
2. Verify the extension has all required permissions
3. Check Chrome's developer console for error messages
4. Ensure the API key is properly saved in the popup configuration

### False Positives/Negatives
- The extension uses Google's Safe Browsing database
- Report issues to Google Safe Browsing team
- Consider the extension as an additional layer of protection

### Performance Issues
- The extension makes API calls on each page load
- Consider implementing caching for frequently visited sites
- Monitor API usage limits in Google Cloud Console

### Popup Issues
- If popup content is cut off, check browser zoom settings
- Ensure the popup has enough space to display fully
- The popup is designed to be compact and fit without scrolling

## Security Notes

- Your API key is stored locally in Chrome's storage
- The extension only sends URLs to Google's Safe Browsing API
- No personal data is collected or transmitted
- All communication uses HTTPS
- Warning banners are injected with high z-index to prevent removal

## Development

### Building Icons
1. Open `create_icons.html` in your browser
2. Click "Generate All Icons" to create the icon set
3. Download and place the icons in the `icons/` directory
4. Icons will be automatically used by the extension

### Testing
1. Load the extension in Chrome
2. Visit known safe sites to test normal operation
3. Test with known phishing sites (use test URLs from Google)
4. Verify notifications and banner functionality
5. Test popup interface and API key configuration

### Debugging
- Check Chrome's developer console for error messages
- Use Chrome's extension debugging tools
- Monitor network requests in the background script
- Test API responses with known safe/unsafe URLs

## License

This project is open source and available under the MIT License.

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Chrome's developer console for errors
3. Verify your API key configuration
4. Test with different websites
5. Check that all files are present and properly configured

## Changelog

### v1.1.0
- Improved error handling and API response validation
- Enhanced popup design with dark theme
- Better URL validation and error page handling
- Compact popup layout without scrolling
- Improved banner injection reliability

### v1.0.0
- Initial release
- Real-time phishing detection
- Warning banner system
- Modern popup interface
- API key configuration
- Chrome notifications

