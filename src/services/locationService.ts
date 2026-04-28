/**
 * Location Service - Single source of truth for all address lookups
 * 
 * Currently uses local Zambia/Lusaka data.
 * TODO: Replace with Google Places / Mapbox / OpenStreetMap for production
 */

export interface PlaceResult {
  id: string;
  address: string;
  description?: string;
  lat: number;
  lng: number;
  distance?: string;
}

// Realistic Zambia/Lusaka sample data with real coordinates
const ZAMBIA_PLACES: PlaceResult[] = [
  {
    id: '1',
    address: 'East Park Mall',
    description: 'Great East Road, Lusaka',
    lat: -15.4061,
    lng: 28.3307,
    distance: '2.5 km'
  },
  {
    id: '2',
    address: 'Manda Hill Mall',
    description: 'Manchichi Road, Lusaka',
    lat: -15.3982,
    lng: 28.3221,
    distance: '3.2 km'
  },
  {
    id: '3',
    address: 'Levy Junction',
    description: 'Church Road, Lusaka',
    lat: -15.4123,
    lng: 28.2876,
    distance: '4.1 km'
  },
  {
    id: '4',
    address: 'Arcades Shopping Centre',
    description: 'Great East Road, Lusaka',
    lat: -15.4025,
    lng: 28.3156,
    distance: '2.8 km'
  },
  {
    id: '5',
    address: 'Cairo Road',
    description: 'Central Business District, Lusaka',
    lat: -15.4195,
    lng: 28.2831,
    distance: '1.5 km'
  },
  {
    id: '6',
    address: 'University of Zambia (UNZA)',
    description: 'Great East Road, Lusaka',
    lat: -15.3926,
    lng: 28.3302,
    distance: '5.0 km'
  },
  {
    id: '7',
    address: 'Kenneth Kaunda International Airport',
    description: 'Airport Road, Lusaka',
    lat: -15.3308,
    lng: 28.4526,
    distance: '18.5 km'
  },
  {
    id: '8',
    address: 'Garden City Mall',
    description: 'Corner of Kafue & Church Road, Lusaka',
    lat: -15.4389,
    lng: 28.2789,
    distance: '6.2 km'
  },
  {
    id: '9',
    address: 'Kabulonga Shopping Centre',
    description: 'Kabulonga Road, Lusaka',
    lat: -15.4234,
    lng: 28.3145,
    distance: '3.5 km'
  },
  {
    id: '10',
    address: 'Woodlands Stadium',
    description: 'Woodlands, Lusaka',
    lat: -15.4456,
    lng: 28.3078,
    distance: '5.8 km'
  },
  {
    id: '11',
    address: 'Longacres',
    description: 'Independence Avenue, Lusaka',
    lat: -15.4078,
    lng: 28.2923,
    distance: '2.1 km'
  },
  {
    id: '12',
    address: 'Chilanga',
    description: 'Kafue Road, Lusaka',
    lat: -15.5456,
    lng: 28.2645,
    distance: '15.0 km'
  },
  {
    id: '13',
    address: 'Roma',
    description: 'Twin Palm Road, Lusaka',
    lat: -15.4167,
    lng: 28.3012,
    distance: '2.9 km'
  },
  {
    id: '14',
    address: 'Showgrounds',
    description: 'Showgrounds Road, Lusaka',
    lat: -15.3945,
    lng: 28.3098,
    distance: '3.8 km'
  },
  {
    id: '15',
    address: 'Makeni Mall',
    description: 'Kafue Road, Lusaka',
    lat: -15.4623,
    lng: 28.2534,
    distance: '8.5 km'
  }
];

/**
 * Search local places by query
 * TODO: Replace with Google Places / Mapbox API for production
 * 
 * @param query - Search query string
 * @returns Promise<PlaceResult[]> - Array of matching places
 */
export async function searchPlaces(query: string): Promise<PlaceResult[]> {
  // Simulate network delay for realistic UX
  await new Promise(resolve => setTimeout(resolve, 100));

  if (!query.trim()) {
    return ZAMBIA_PLACES;
  }

  const lowerQuery = query.toLowerCase();
  return ZAMBIA_PLACES.filter(place =>
    place.address.toLowerCase().includes(lowerQuery) ||
    (place.description && place.description.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Get current location using browser geolocation API
 * Returns coordinates with "Current Location" as address
 * 
 * TODO: Replace mock reverse geocoding with real API (Google Geocoding / Mapbox)
 * 
 * @returns Promise<{ address: string; lat: number; lng: number }>
 * @throws Error if geolocation is not supported or permission denied
 */
export async function getCurrentLocation(): Promise<{
  address: string;
  lat: number;
  lng: number;
}> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        // TODO: Replace with real reverse geocoding API
        // For now, return "Current Location" with actual GPS coordinates
        resolve({
          address: 'Current Location',
          lat: latitude,
          lng: longitude
        });
      },
      (error) => {
        reject(new Error(error.message || 'Failed to get location'));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  });
}

/**
 * Get place by ID
 * 
 * @param placeId - The place ID to lookup
 * @returns PlaceResult | undefined
 */
export function getPlaceById(placeId: string): PlaceResult | undefined {
  return ZAMBIA_PLACES.find(place => place.id === placeId);
}

/**
 * Get all available places
 * 
 * @returns PlaceResult[] - All places
 */
export function getAllPlaces(): PlaceResult[] {
  return ZAMBIA_PLACES;
}

// Export the location service as a namespace-like object for easier imports
export const locationService = {
  searchPlaces,
  getCurrentLocation,
  getPlaceById,
  getAllPlaces
};
