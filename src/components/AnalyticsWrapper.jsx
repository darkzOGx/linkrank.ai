import React, { useEffect } from 'react';
import { trackPageView, trackToolUsage, trackUserInteraction } from '../services/analytics';

/**
 * Analytics Wrapper Component
 * Automatically tracks page views and provides easy tool usage tracking
 */
export default function AnalyticsWrapper({ 
  children, 
  pageName, 
  toolName,
  onToolUse,
  trackInteractions = false 
}) {
  // Track page view on mount
  useEffect(() => {
    if (pageName) {
      trackPageView(pageName);
    }
  }, [pageName]);

  // Enhanced tool usage tracker that includes timing
  const trackToolWithTiming = async (toolData = {}) => {
    const startTime = Date.now();
    
    try {
      // Call the original tool function if provided
      const result = onToolUse ? await onToolUse(toolData) : toolData;
      
      // Track successful tool usage
      trackToolUsage(toolName, {
        ...toolData,
        execution_time: Date.now() - startTime,
        success: true,
        result: result
      });
      
      return result;
    } catch (error) {
      // Track failed tool usage
      trackToolUsage(toolName, {
        ...toolData,
        execution_time: Date.now() - startTime,
        success: false,
        error: error.message || 'Tool execution failed'
      });
      
      throw error;
    }
  };

  // Enhanced component with interaction tracking
  const wrappedChildren = trackInteractions ? 
    React.Children.map(children, child => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, {
          ...child.props,
          onClick: (e) => {
            // Track click interactions
            trackUserInteraction('click', child.type, {
              element_id: child.props.id,
              element_class: child.props.className,
              text_content: child.props.children?.toString?.() || ''
            });
            
            // Call original onClick if exists
            if (child.props.onClick) {
              child.props.onClick(e);
            }
          }
        });
      }
      return child;
    }) : children;

  // Provide tracking functions to children via context or props
  return (
    <div data-analytics-page={pageName} data-analytics-tool={toolName}>
      {typeof children === 'function' 
        ? children({ trackTool: trackToolWithTiming })
        : wrappedChildren
      }
    </div>
  );
}

/**
 * Hook for easy analytics integration
 */
export function useAnalytics(pageName, toolName) {
  useEffect(() => {
    if (pageName) {
      trackPageView(pageName);
    }
  }, [pageName]);

  const trackTool = async (toolData = {}) => {
    const startTime = Date.now();
    
    try {
      const result = toolData.execute ? await toolData.execute() : toolData;
      
      trackToolUsage(toolName, {
        ...toolData,
        execution_time: Date.now() - startTime,
        success: true,
        result: result
      });
      
      return result;
    } catch (error) {
      trackToolUsage(toolName, {
        ...toolData,
        execution_time: Date.now() - startTime,
        success: false,
        error: error.message || 'Tool execution failed'
      });
      
      throw error;
    }
  };

  const trackInteraction = (type, element, data = {}) => {
    trackUserInteraction(type, element, data);
  };

  return {
    trackTool,
    trackInteraction,
    trackPageView: (page) => trackPageView(page || pageName)
  };
}