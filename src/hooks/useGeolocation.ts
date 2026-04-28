import { useState, useEffect } from 'react';
import { locationService } from '../services/locationService';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  address: string | null;
  loading: boolean;
  error: string | null;
}

export const useGeolocation = () => {
  const [location, setLocation] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    address: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    let isMounted = true;

    const fetchLocation = async () => {
      try {
        const result = await locationService.getCurrentLocation();
        
        if (isMounted) {
          setLocation({
            latitude: result.lat,
            longitude: result.lng,
            address: result.address,
            loading: false,
            error: null
          });
        }
      } catch (error) {
        if (isMounted) {
          setLocation(prev => ({
            ...prev,
            loading: false,
            error: error instanceof Error ? error.message : 'Failed to get location'
          }));
        }
      }
    };

    fetchLocation();

    return () => {
      isMounted = false;
    };
  }, []);

  return location;
};
