
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useActivityLogger } from '@/components/ActivityLog';

interface LocationAlert {
  zone_id: string;
  zone_name: string;
  zone_type: string;
  distance_meters: number;
  alert_message: string;
}

export const useLocationAlerts = () => {
  const [currentAlerts, setCurrentAlerts] = useState<LocationAlert[]>([]);
  const [isTracking, setIsTracking] = useState(false);
  const { toast } = useToast();
  const { logActivity } = useActivityLogger();

  const checkLocationAlerts = useCallback(async (lat: number, lng: number) => {
    try {
      const { data: alerts, error } = await supabase
        .rpc('check_location_alerts', { lat, lng });

      if (error) {
        console.error('Error checking location alerts:', error);
        return;
      }

      if (alerts && alerts.length > 0) {
        const newAlerts = alerts.filter((alert: LocationAlert) => 
          !currentAlerts.some(existing => existing.zone_id === alert.zone_id)
        );

        if (newAlerts.length > 0) {
          setCurrentAlerts(prev => [...prev, ...newAlerts]);
          
          // Show toast for each new alert
          newAlerts.forEach((alert: LocationAlert) => {
            toast({
              title: alert.zone_type === 'danger' ? "⚠️ Danger Zone Alert" : "📍 Zone Alert",
              description: alert.alert_message,
              variant: alert.zone_type === 'danger' ? "destructive" : "default",
            });

            logActivity('location', `Entered ${alert.zone_type} zone: ${alert.zone_name}`, {
              zone_id: alert.zone_id,
              zone_type: alert.zone_type,
              distance_meters: alert.distance_meters,
              location: { lat, lng }
            });
          });
        }
      }

      // Record location in history
      const { data: user } = await supabase.auth.getUser();
      if (user.user) {
        await supabase.from('location_history').insert({
          user_id: user.user.id,
          lat,
          lng,
          accuracy: 10
        });
      }
    } catch (error: any) {
      console.error('Error in location alerts:', error);
    }
  }, [currentAlerts, toast, logActivity]);

  const startLocationTracking = useCallback(() => {
    if (!navigator.geolocation) {
      toast({
        title: "Location Not Supported",
        description: "Your browser doesn't support location tracking.",
        variant: "destructive",
      });
      return;
    }

    setIsTracking(true);
    
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        checkLocationAlerts(
          position.coords.latitude,
          position.coords.longitude
        );
      },
      (error) => {
        console.error('Location tracking error:', error);
        toast({
          title: "Location Error",
          description: "Unable to track your location for zone alerts.",
          variant: "destructive",
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
      setIsTracking(false);
    };
  }, [checkLocationAlerts, toast]);

  const clearAlerts = useCallback(() => {
    setCurrentAlerts([]);
  }, []);

  return {
    currentAlerts,
    isTracking,
    startLocationTracking,
    clearAlerts,
    checkLocationAlerts
  };
};
