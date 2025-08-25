/**
 * Analytics Service for LinkRank.ai
 * Tracks tool usage, user sessions, and geographic data
 */

class AnalyticsService {
  constructor() {
    this.sessionStart = Date.now();
    this.sessionId = this.generateSessionId();
    this.userId = this.getUserId();
    this.events = [];
    this.isTracking = true;
    
    // Initialize session tracking
    this.initializeSession();
    
    // Track page visibility changes
    this.setupVisibilityTracking();
    
    // Track before unload for session duration
    this.setupUnloadTracking();
  }

  generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  getUserId() {
    let userId = localStorage.getItem('linkrank_user_id');
    if (!userId) {
      userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('linkrank_user_id', userId);
    }
    return userId;
  }

  async initializeSession() {
    try {
      // Get user's country/location
      const locationData = await this.getLocationData();
      
      // Track session start
      this.trackEvent('session_start', {
        session_id: this.sessionId,
        user_id: this.userId,
        timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent,
        screen_resolution: `${screen.width}x${screen.height}`,
        viewport_size: `${window.innerWidth}x${window.innerHeight}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language,
        referrer: document.referrer || 'direct',
        url: window.location.href,
        ...locationData
      });
    } catch (error) {
      console.error('Analytics initialization error:', error);
    }
  }

  async getLocationData() {
    try {
      // Use a free IP geolocation service
      const response = await fetch('https://ipapi.co/json/', {
        timeout: 5000
      });
      
      if (response.ok) {
        const data = await response.json();
        return {
          country: data.country_name || 'Unknown',
          country_code: data.country_code || 'XX',
          region: data.region || 'Unknown',
          city: data.city || 'Unknown',
          ip: data.ip || 'Unknown',
          timezone: data.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone
        };
      }
    } catch (error) {
      console.warn('Could not fetch location data:', error);
    }
    
    // Fallback location data
    return {
      country: 'Unknown',
      country_code: 'XX',
      region: 'Unknown',
      city: 'Unknown',
      ip: 'Unknown',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
  }

  setupVisibilityTracking() {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.trackEvent('page_hidden', {
          session_duration: Date.now() - this.sessionStart
        });
      } else {
        this.trackEvent('page_visible', {
          session_duration: Date.now() - this.sessionStart
        });
      }
    });
  }

  setupUnloadTracking() {
    window.addEventListener('beforeunload', () => {
      this.trackEvent('session_end', {
        session_duration: Date.now() - this.sessionStart,
        total_events: this.events.length
      });
      
      // Send any pending events
      this.flushEvents(true);
    });
  }

  trackEvent(eventType, eventData = {}) {
    if (!this.isTracking) return;

    const event = {
      event_type: eventType,
      session_id: this.sessionId,
      user_id: this.userId,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      pathname: window.location.pathname,
      session_duration: Date.now() - this.sessionStart,
      ...eventData
    };

    this.events.push(event);
    
    // Send events in batches or immediately for critical events
    if (this.shouldFlushEvents(eventType)) {
      this.flushEvents();
    }
  }

  shouldFlushEvents(eventType) {
    const criticalEvents = ['tool_used', 'session_start', 'session_end'];
    return criticalEvents.includes(eventType) || this.events.length >= 10;
  }

  async flushEvents(isUnloading = false) {
    if (this.events.length === 0) return;

    const eventsToSend = [...this.events];
    this.events = [];

    try {
      const method = isUnloading ? 'sendBeacon' : 'fetch';
      
      if (method === 'sendBeacon' && navigator.sendBeacon) {
        const blob = new Blob([JSON.stringify({ events: eventsToSend })], {
          type: 'application/json'
        });
        navigator.sendBeacon('/api/analytics', blob);
      } else {
        await fetch('/api/analytics', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ events: eventsToSend }),
          keepalive: isUnloading
        });
      }
    } catch (error) {
      console.error('Failed to send analytics events:', error);
      // Re-add events to queue if sending failed (unless unloading)
      if (!isUnloading) {
        this.events.unshift(...eventsToSend);
      }
    }
  }

  // Public methods for tracking specific tool usage
  trackToolUsage(toolName, toolData = {}) {
    this.trackEvent('tool_used', {
      tool_name: toolName,
      tool_data: toolData,
      execution_time: toolData.execution_time || null,
      success: toolData.success !== false,
      error: toolData.error || null
    });
  }

  trackPageView(pageName = null) {
    this.trackEvent('page_view', {
      page_name: pageName || window.location.pathname,
      title: document.title
    });
  }

  trackError(error, context = {}) {
    this.trackEvent('error', {
      error_message: error.message || error.toString(),
      error_stack: error.stack || null,
      context: context
    });
  }

  trackUserInteraction(interaction, element, data = {}) {
    this.trackEvent('user_interaction', {
      interaction_type: interaction, // 'click', 'scroll', 'form_submit', etc.
      element_type: element,
      ...data
    });
  }

  // Method to disable tracking (for privacy compliance)
  disableTracking() {
    this.isTracking = false;
    localStorage.setItem('linkrank_tracking_disabled', 'true');
  }

  enableTracking() {
    this.isTracking = true;
    localStorage.removeItem('linkrank_tracking_disabled');
  }

  isTrackingEnabled() {
    return !localStorage.getItem('linkrank_tracking_disabled');
  }
}

// Create global instance
const analytics = new AnalyticsService();

// Auto-track page views
window.addEventListener('load', () => {
  analytics.trackPageView();
});

// Export for use in components
export default analytics;

// Named exports for specific functions
export const trackToolUsage = (toolName, toolData) => analytics.trackToolUsage(toolName, toolData);
export const trackPageView = (pageName) => analytics.trackPageView(pageName);
export const trackError = (error, context) => analytics.trackError(error, context);
export const trackUserInteraction = (interaction, element, data) => analytics.trackUserInteraction(interaction, element, data);