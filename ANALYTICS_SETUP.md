# LinkRank.ai Analytics Dashboard Setup Guide

## Overview
A comprehensive admin dashboard that tracks tool usage, geographic data, session duration, and user engagement metrics for LinkRank.ai.

## Features
- **Tool Usage Tracking**: Monitor which tools are used, how many times, and success rates
- **Geographic Analytics**: See which countries users are accessing from
- **Session Tracking**: Track user session duration and engagement
- **Real-time Dashboard**: Interactive charts and visualizations
- **Data Export**: Export analytics data for further analysis
- **Authentication**: Secure admin access with key-based authentication

## Setup Instructions

### 1. Environment Configuration
Add the following environment variable to your `.env` file:
```
ADMIN_KEY=your_secure_admin_key_here
```

### 2. Access the Dashboard
Navigate to `/admin` in your browser:
- Local development: `http://localhost:5173/admin`
- Production: `https://yourdomain.com/admin`

### 3. Authentication
Use your admin key to access the dashboard. The default key is `admin_linkrank_2024` but you should change this in production.

## Dashboard Sections

### Overview Tab
- Daily activity charts
- Summary statistics cards
- Top tools usage pie chart
- Recent trends

### Tool Usage Tab
- Tool usage analytics bar chart
- Detailed tool usage table
- Success rates and performance metrics
- Unique users per tool

### Geography Tab
- Usage by country bar chart
- Country analytics table
- Geographic distribution insights
- Session duration by location

### User Sessions Tab
- Recent user sessions table
- Session details and duration
- Tools used per session
- User behavior patterns

## Key Metrics Tracked

### Tool Usage
- Total uses per tool
- Unique users per tool
- Success/failure rates
- Average execution time
- Geographic distribution

### User Sessions
- Session duration
- Page views per session
- Tools used per session
- Country/region data
- Device and browser info

### Geographic Data
- Sessions by country
- Tool usage by location
- Average session duration by region
- User distribution worldwide

## Data Storage
Analytics data is stored in JSON format in the `/data` directory:
- `analytics.json`: Main analytics data
- `daily_stats.json`: Daily aggregated statistics

## API Endpoints

### POST /api/analytics
Store analytics events from the frontend tracking service.

### GET /api/analytics?adminKey=YOUR_KEY
Retrieve analytics data for the admin dashboard.

Supports filtering parameters:
- `dateRange`: Filter by date range (e.g., "2024-01-01,2024-01-31")
- `toolName`: Filter by specific tool
- `country`: Filter by country

## Tracking Integration

### Automatic Tracking
The analytics service automatically tracks:
- Page views
- Session start/end
- User interactions
- Geographic location
- Device information

### Manual Tracking
Use the provided functions for custom tracking:

```javascript
import { trackToolUsage, trackPageView } from '../services/analytics';

// Track tool usage
trackToolUsage('Tool Name', {
  url: 'example.com',
  execution_time: 1500,
  success: true,
  additional_data: {}
});

// Track page views
trackPageView('Page Name');
```

### Using Analytics Wrapper
For easy integration with existing components:

```javascript
import AnalyticsWrapper from '../components/AnalyticsWrapper';

function MyTool() {
  return (
    <AnalyticsWrapper pageName="My Tool" toolName="My Tool">
      {/* Your tool content */}
    </AnalyticsWrapper>
  );
}
```

## Security Considerations

1. **Admin Key**: Change the default admin key in production
2. **Access Control**: The admin dashboard is protected by key-based authentication
3. **Data Privacy**: No personally identifiable information is stored
4. **CORS**: The API endpoints have proper CORS configuration

## Data Export
Click the "Export Data" button in the dashboard to download a JSON file containing:
- Summary statistics
- Applied filters
- Raw analytics data
- Export timestamp

## Troubleshooting

### Dashboard Not Loading
- Check if the admin key is correct
- Verify the analytics API endpoint is responding
- Check browser console for JavaScript errors

### No Data Showing
- Ensure the analytics tracking service is properly integrated
- Check if users have disabled tracking (privacy compliance)
- Verify the data directory has proper write permissions

### Performance Issues
- The system keeps only the last 10,000 events to prevent memory issues
- Consider implementing database storage for high-volume sites
- Monitor file sizes in the `/data` directory

## Privacy Compliance
The analytics system is designed with privacy in mind:
- No personal data is collected
- Users can opt-out of tracking
- Geographic data is country-level only
- No cookies or persistent identifiers beyond session

## Future Enhancements
- Database integration for larger datasets
- Real-time updates via WebSocket
- Advanced filtering and search
- Custom dashboard widgets
- Automated report generation
- Integration with Google Analytics
- A/B testing capabilities