import { useAuth } from '@/hooks/use-auth';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useEffect, useCallback } from 'react';
import { useLocation } from 'wouter';

// Types for analytics events
type EventType = 'page_view' | 'click' | 'purchase' | 'download' | 'login' | 'register' | 'custom' | 'share' | 'comment' | 'search';

interface TrackEventProps {
  event: EventType;
  page?: string; // optional - if not provided, will use current page path
  metadata?: Record<string, any>; // Any additional data to track
}

/**
 * Hook for tracking user analytics
 */
export function useAnalytics() {
  const { user } = useAuth();
  const [location] = useLocation();

  // Define the mutation for tracking events
  const trackEventMutation = useMutation({
    mutationFn: async (data: { event: string; page: string; metadata?: string }) => {
      if (!user) return null; // Don't track if user is not logged in
      
      const res = await apiRequest("POST", "/api/analytics/track", data);
      return await res.json();
    }
  });

  // Track page views automatically
  useEffect(() => {
    if (user) {
      trackEvent({
        event: 'page_view',
        page: location
      });
    }
  }, [location, user]);

  // Function to track custom events
  const trackEvent = useCallback(({ event, page, metadata }: TrackEventProps) => {
    if (!user) return; // Don't track if user is not logged in

    trackEventMutation.mutate({
      event,
      page: page || location,
      metadata: metadata ? JSON.stringify(metadata) : undefined
    });
  }, [trackEventMutation, location, user]);

  // Track click events on specific elements
  const trackClick = useCallback((elementId: string, metadata?: Record<string, any>) => {
    trackEvent({
      event: 'click',
      metadata: {
        elementId,
        ...metadata
      }
    });
  }, [trackEvent]);

  // Track purchase events
  const trackPurchase = useCallback((orderId: number, amount: number, projectId: number) => {
    trackEvent({
      event: 'purchase',
      metadata: {
        orderId,
        amount,
        projectId
      }
    });
  }, [trackEvent]);

  // Track download events
  const trackDownload = useCallback((projectId: number, projectName: string) => {
    trackEvent({
      event: 'download',
      metadata: {
        projectId,
        projectName
      }
    });
  }, [trackEvent]);

  return {
    trackEvent,
    trackClick,
    trackPurchase,
    trackDownload,
    isTracking: trackEventMutation.isPending
  };
}