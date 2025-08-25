/**
 * Analytics API Endpoint
 * Handles analytics data collection and storage
 */

// In-memory storage for serverless environment
let analyticsData = { events: [], sessions: {}, tools: {}, countries: {}, daily_stats: {} };

// Helper function to safely process events
function processEvents(events, existingData) {
  try {
    const processed = {
      events: [...(existingData.events || [])],
      sessions: { ...(existingData.sessions || {}) },
      tools: { ...(existingData.tools || {}) },
      countries: { ...(existingData.countries || {}) },
      daily_stats: { ...(existingData.daily_stats || {}) }
    };

    events.forEach(event => {
      try {
        // Add event to main events array (keep last 1000 events for serverless)
        processed.events.push(event);
        if (processed.events.length > 1000) {
          processed.events = processed.events.slice(-1000);
        }

        // Track sessions
        if (event.session_id) {
          if (!processed.sessions[event.session_id]) {
            processed.sessions[event.session_id] = {
              session_id: event.session_id,
              user_id: event.user_id || 'anonymous',
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
              unique_users: [],
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
          
          if (event.user_id && !tool.unique_users.includes(event.user_id)) {
            tool.unique_users.push(event.user_id);
          }

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
              total_users: [],
              total_tool_uses: 0,
              popular_tools: {},
              avg_session_duration: 0,
              total_session_duration: 0
            };
          }

          const country = processed.countries[event.country];
          
          if (event.event_type === 'session_start') {
            country.total_sessions++;
            if (event.user_id && !country.total_users.includes(event.user_id)) {
              country.total_users.push(event.user_id);
            }
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
            unique_users: [],
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
        if (event.user_id && !dailyStat.unique_users.includes(event.user_id)) {
          dailyStat.unique_users.push(event.user_id);
        }

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

      } catch (eventError) {
        console.error('Error processing individual event:', eventError);
      }
    });

    return processed;
  } catch (error) {
    console.error('Error in processEvents:', error);
    return existingData || { events: [], sessions: {}, tools: {}, countries: {}, daily_stats: {} };
  }
}

export default async function handler(req, res) {
  try {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    if (req.method === 'POST') {
      // Store analytics events
      const { events } = req.body;
      
      if (!events || !Array.isArray(events)) {
        return res.status(400).json({ error: 'Invalid events data' });
      }

      console.log(`Processing ${events.length} analytics events`);

      // Process and aggregate new events
      const updatedData = processEvents(events, analyticsData);
      analyticsData = updatedData;
      
      return res.status(200).json({ 
        success: true, 
        processed: events.length,
        message: 'Analytics events processed successfully'
      });

    } else if (req.method === 'GET') {
      // Retrieve analytics data (admin only)
      const { authorization } = req.headers;
      const { adminKey } = req.query;
      
      // Get admin key from environment or use default
      const validAdminKey = process.env.ADMIN_KEY || 'admin_linkrank_2024';
      
      console.log('Admin auth attempt:', { 
        receivedKey: adminKey,
        validKey: validAdminKey,
        keysMatch: adminKey === validAdminKey,
        hasAdminKey: !!adminKey, 
        hasAuth: !!authorization,
        envKey: !!process.env.ADMIN_KEY,
        envKeyLength: process.env.ADMIN_KEY ? process.env.ADMIN_KEY.length : 0,
        receivedKeyLength: adminKey ? adminKey.length : 0
      });
      
      if (adminKey !== validAdminKey && authorization !== `Bearer ${validAdminKey}`) {
        console.log('Authentication failed - key mismatch');
        return res.status(401).json({ 
          error: 'Unauthorized access',
          message: 'Invalid admin key',
          debug: {
            receivedLength: adminKey ? adminKey.length : 0,
            expectedLength: validAdminKey ? validAdminKey.length : 0,
            hasEnvKey: !!process.env.ADMIN_KEY
          }
        });
      }

      // Convert arrays to counts for response
      const responseData = {
        events: analyticsData.events || [],
        sessions: analyticsData.sessions || {},
        tools: {},
        countries: {},
        daily_stats: {}
      };

      // Process tools data
      Object.entries(analyticsData.tools || {}).forEach(([key, tool]) => {
        responseData.tools[key] = {
          ...tool,
          unique_users: Array.isArray(tool.unique_users) ? tool.unique_users.length : tool.unique_users
        };
      });

      // Process countries data
      Object.entries(analyticsData.countries || {}).forEach(([key, country]) => {
        responseData.countries[key] = {
          ...country,
          total_users: Array.isArray(country.total_users) ? country.total_users.length : country.total_users
        };
      });

      // Process daily stats
      Object.entries(analyticsData.daily_stats || {}).forEach(([key, stat]) => {
        responseData.daily_stats[key] = {
          ...stat,
          unique_users: Array.isArray(stat.unique_users) ? stat.unique_users.length : stat.unique_users
        };
      });

      // Generate summary statistics
      const summary = {
        total_events: (analyticsData.events || []).length,
        total_sessions: Object.keys(analyticsData.sessions || {}).length,
        total_tools: Object.keys(analyticsData.tools || {}).length,
        total_countries: Object.keys(analyticsData.countries || {}).length,
        date_range: {
          first_event: (analyticsData.events || []).length > 0 ? analyticsData.events[0].timestamp : null,
          last_event: (analyticsData.events || []).length > 0 ? analyticsData.events[analyticsData.events.length - 1].timestamp : null
        }
      };

      return res.status(200).json({
        success: true,
        summary,
        data: responseData
      });

    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }

  } catch (error) {
    console.error('Analytics API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}