# Threat Intelligence Dashboard Documentation

## Overview
This documentation provides information about the Threat Intelligence Dashboard, a modern cybersecurity-themed web application that aggregates RSS feeds from various security sources to provide real-time threat intelligence information.

## Features
- **Real-time RSS Feed Aggregation**: Collects and displays security news and alerts from 120+ cybersecurity sources
- **Cybersecurity Theme**: Modern dark-mode interface with particle animations and cyber-themed visual elements
- **Interactive Dashboard**: Categorized feeds with filtering, sorting, and search capabilities
- **Threat Visualization**: Visual representation of threat severity levels and statistics
- **Responsive Design**: Fully responsive layout that works on all screen sizes
- **Customizable Settings**: User preferences for theme, refresh intervals, and display options
- **Cross-browser Compatibility**: Optimized for Firefox and Chrome

## File Structure
- `index.html` - Main HTML file containing the dashboard structure
- `css/styles.css` - CSS styling with cybersecurity theme
- `js/main.js` - JavaScript functionality for RSS feed integration and interactivity
- `images/` - Folder for any custom images (currently empty, ready for your additions)

## How to Use
1. **Local Setup**: Simply extract the zip file to a local folder and open `index.html` in Firefox or Chrome
2. **Feed Loading**: The dashboard automatically loads feeds on startup and refreshes every 10 minutes
3. **Navigation**: Use the sidebar to filter feeds by category (Government, News, Blogs, Vendors, Research)
4. **Search & Filter**: Use the search bar to find specific threats or use quick filters for critical alerts
5. **View Options**: Toggle between card and list views using the view buttons
6. **Settings**: Customize the dashboard via the settings button (gear icon) in the header

## Customization Options
- **Theme**: Choose between dark mode (default) and light mode
- **Animations**: Toggle animations on/off for performance optimization
- **Refresh Interval**: Set how often feeds are refreshed (5 min, 10 min, 30 min, 1 hour, or manual)
- **Items per Feed**: Control how many items are shown from each feed source (1, 3, 5, or 10)
- **Display Options**: Toggle visibility of descriptions and timestamps

## Technical Details
- **RSS Processing**: Uses the api.rss2json.com proxy service to handle CORS issues with RSS feeds
- **Severity Detection**: Automatically categorizes threats based on keyword analysis
- **Data Visualization**: Uses Chart.js for the threat statistics visualization
- **Particle Effects**: Uses particles.js for the interactive background
- **No External Dependencies**: All required libraries are loaded via CDN

## Extending the Dashboard
- Add custom RSS feeds by editing the `rssFeeds` array in `main.js`
- Customize feed categorization by modifying the `feedCategories` object
- Adjust severity detection by editing the `severityKeywords` object
- Add custom styling by modifying the CSS variables in `:root` in `styles.css`

## Browser Compatibility
- Optimized for Firefox and Chrome as requested
- No specific support for other browsers, but may work in modern browsers that support ES6+

## Performance Considerations
- The dashboard processes a large number of RSS feeds, which may cause initial loading delay
- Consider reducing the number of feeds or items per feed for better performance
- The animations can be disabled in settings for improved performance on lower-end devices
