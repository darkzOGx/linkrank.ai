/**
 * Analytics API Endpoint
 * Handles analytics data collection and storage
 */

// In-memory storage for serverless environment
// Note: Data will reset on each deployment - consider using a database for persistence
let analyticsData = { events: [], sessions: {}, tools: {}, countries: {}, daily_stats: {} };

// Read existing analytics data
function readAnalyticsData() {
  return analyticsData;
}

// Save analytics data
function saveAnalyticsData(data) {
  try {
    analyticsData = data;
    return true;
  } catch (error) {
    console.error('Error saving analytics data:', error);
    return false;
  }
}

// Process and aggregate events
function processEvents(events, existingData) {
  const processed = {
    events: [...existingData.events],
    sessions: { ...existingData.sessions },
    tools: { ...existingData.tools },
    countries: { ...existingData.countries },
    daily_stats: { ...existingData.daily_stats }
  };

  events.forEach(event => {
    // Add event to main events array (keep last 10000 events)
    processed.events.push(event);
    if (processed.events.length > 10000) {
      processed.events = processed.events.slice(-10000);
    }

    // Track sessions
    if (event.session_id) {
      if (!processed.sessions[event.session_id]) {
        processed.sessions[event.session_id] = {
          session_id: event.session_id,
          user_id: event.user_id,
          start_time: event.timestamp,
          end_time: event.timestamp,
          duration: 0,
          page_views: 0,
          tools_used: [],
          country: event.country || 'Unknown',
          country_code: event.country_code || 'XX',
          city: event.city || 'Unknown',
          user_agent: event.user_agent || '',
          referrer: event.referrer || 'direct'
        };
      }

      const session = processed.sessions[event.session_id];
      session.end_time = event.timestamp;
      session.duration = event.session_duration || 0;

      if (event.event_type === 'page_view') {
        session.page_views++;
      }

      if (event.event_type === 'tool_used' && event.tool_name) {
        if (!session.tools_used.includes(event.tool_name)) {
          session.tools_used.push(event.tool_name);
        }
      }
    }

    // Track tool usage
    if (event.event_type === 'tool_used' && event.tool_name) {
      if (!processed.tools[event.tool_name]) {
        processed.tools[event.tool_name] = {
          name: event.tool_name,
          total_uses: 0,
          unique_users: new Set(),
          countries: {},
          daily_usage: {},
          avg_execution_time: 0,
          total_execution_time: 0,
          success_rate: 0,
          successful_uses: 0,
          failed_uses: 0
        };
      }

      const tool = processed.tools[event.tool_name];
      tool.total_uses++;
      tool.unique_users.add(event.user_id);

      // Track by country
      const country = event.country || 'Unknown';
      tool.countries[country] = (tool.countries[country] || 0) + 1;

      // Track daily usage
      const date = event.timestamp.split('T')[0];
      tool.daily_usage[date] = (tool.daily_usage[date] || 0) + 1;

      // Track execution time
      if (event.tool_data && event.tool_data.execution_time) {
        tool.total_execution_time += event.tool_data.execution_time;
        tool.avg_execution_time = tool.total_execution_time / tool.total_uses;
      }

      // Track success rate
      if (event.success !== false) {
        tool.successful_uses++;
      } else {
        tool.failed_uses++;
      }
      tool.success_rate = (tool.successful_uses / tool.total_uses) * 100;
    }

    // Track countries
    if (event.country && event.country !== 'Unknown') {
      if (!processed.countries[event.country]) {
        processed.countries[event.country] = {
          name: event.country,
          code: event.country_code || 'XX',
          total_sessions: 0,
          total_users: new Set(),
          total_tool_uses: 0,
          popular_tools: {},
          avg_session_duration: 0,
          total_session_duration: 0
        };
      }

      const country = processed.countries[event.country];
      
      if (event.event_type === 'session_start') {
        country.total_sessions++;
        country.total_users.add(event.user_id);
      }

      if (event.event_type === 'tool_used' && event.tool_name) {
        country.total_tool_uses++;
        country.popular_tools[event.tool_name] = (country.popular_tools[event.tool_name] || 0) + 1;
      }

      if (event.event_type === 'session_end' && event.session_duration) {
        country.total_session_duration += event.session_duration;
        country.avg_session_duration = country.total_session_duration / country.total_sessions;
      }
    }

    // Track daily stats
    const date = event.timestamp.split('T')[0];
    if (!processed.daily_stats[date]) {
      processed.daily_stats[date] = {
        date: date,
        total_sessions: 0,
        unique_users: new Set(),
        total_events: 0,
        tool_uses: 0,
        page_views: 0,
        avg_session_duration: 0,
        total_session_duration: 0,
        top_tools: {},
        top_countries: {}
      };
    }

    const dailyStat = processed.daily_stats[date];
    dailyStat.total_events++;
    dailyStat.unique_users.add(event.user_id);

    if (event.event_type === 'session_start') {
      dailyStat.total_sessions++;
    }

    if (event.event_type === 'tool_used' && event.tool_name) {
      dailyStat.tool_uses++;
      dailyStat.top_tools[event.tool_name] = (dailyStat.top_tools[event.tool_name] || 0) + 1;
    }

    if (event.event_type === 'page_view') {
      dailyStat.page_views++;
    }

    if (event.event_type === 'session_end' && event.session_duration) {
      dailyStat.total_session_duration += event.session_duration;
      dailyStat.avg_session_duration = dailyStat.total_session_duration / dailyStat.total_sessions;
    }

    if (event.country && event.country !== 'Unknown') {
      dailyStat.top_countries[event.country] = (dailyStat.top_countries[event.country] || 0) + 1;
    }
  });

  // Convert Sets to arrays/numbers for JSON serialization
  Object.values(processed.tools).forEach(tool => {
    tool.unique_users = tool.unique_users.size;
  });

  Object.values(processed.countries).forEach(country => {
    country.total_users = country.total_users.size;
  });

  Object.values(processed.daily_stats).forEach(stat => {
    stat.unique_users = stat.unique_users.size;
  });

  return processed;
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'POST') {
      // Store analytics events
      const { events } = req.body;
      
      if (!events || !Array.isArray(events)) {
        return res.status(400).json({ error: 'Invalid events data' });
      }

      // Read existing data
      const existingData = readAnalyticsData();
      
      // Process and aggregate new events
      const updatedData = processEvents(events, existingData);
      
      // Save updated data
      const saved = saveAnalyticsData(updatedData);
      
      if (saved) {
        return res.status(200).json({ 
          success: true, 
          processed: events.length,
          message: 'Analytics events processed successfully'
        });
      } else {
        return res.status(500).json({ error: 'Failed to save analytics data' });
      }

    } else if (req.method === 'GET') {
      // Retrieve analytics data (admin only)
      const { authorization } = req.headers;
      const { adminKey, dateRange, toolName, country } = req.query;
      
      // Simple admin authentication (in production, use proper JWT/auth)
      const validAdminKey = process.env.ADMIN_KEY || 'admin_linkrank_2024';
      if (adminKey !== validAdminKey && authorization !== `Bearer ${validAdminKey}`) {
        return res.status(401).json({ error: 'Unauthorized access' });
      }

      const data = readAnalyticsData();
      
      // Apply filters if provided
      let filteredData = { ...data };
      
      if (dateRange) {
        const [startDate, endDate] = dateRange.split(',');
        filteredData.events = data.events.filter(event => {
          const eventDate = event.timestamp.split('T')[0];
          return eventDate >= startDate && eventDate <= endDate;
        });
      }

      if (toolName) {
        filteredData.events = filteredData.events.filter(event => 
          event.event_type !== 'tool_used' || event.tool_name === toolName
        );
      }

      if (country) {
        filteredData.events = filteredData.events.filter(event => 
          event.country === country
        );
      }

      // Generate summary statistics
      const summary = {
        total_events: data.events.length,
        total_sessions: Object.keys(data.sessions).length,
        total_tools: Object.keys(data.tools).length,
        total_countries: Object.keys(data.countries).length,
        date_range: {
          first_event: data.events.length > 0 ? data.events[0].timestamp : null,
          last_event: data.events.length > 0 ? data.events[data.events.length - 1].timestamp : null
        }
      };

      return res.status(200).json({
        success: true,
        summary,
        data: filteredData
      });

    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }

  } catch (error) {
    console.error('Analytics API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}