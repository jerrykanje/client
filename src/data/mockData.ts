import { CarType, RecentSearch } from '../types';

export const carTypes: CarType[] = [
  {
    id: 'bolt',
    name: 'Bolt',
    description: 'Mid-size cars',
    eta: '1 min',
    price: 0, // Will be calculated dynamically
    originalPrice: 0, // Will be calculated dynamically
    capacity: 3,
    badge: 'FASTER',
    icon: '🚗'
  },
  {
    id: 'economy',
    name: 'Economy',
    description: 'Affordable rides',
    eta: '2 min',
    price: 0, // Will be calculated dynamically
    originalPrice: 0, // Will be calculated dynamically
    capacity: 2,
    badge: 'CHEAPER',
    icon: '🚙'
  },
  {
    id: 'comfort',
    name: 'Comfort',
    description: 'Premium cars',
    eta: '3 min',
    price: 0, // Will be calculated dynamically
    originalPrice: 0, // Will be calculated dynamically
    capacity: 4,
    badge: 'LUXURY',
    icon: '🚖'
  },
  {
    id: 'xl',
    name: 'Bolt XL',
    description: 'Extra space',
    eta: '4 min',
    price: 0, // Will be calculated dynamically
    originalPrice: 0, // Will be calculated dynamically
    capacity: 6,
    badge: 'SPACIOUS',
    icon: '🚐'
  }
];

// Recent searches with Zambia/Lusaka locations and coordinates
export const recentSearches: (RecentSearch & { lat?: number; lng?: number })[] = [
  {
    id: '1',
    address: 'East Park Mall',
    description: 'Great East Road, Lusaka',
    lat: -15.4061,
    lng: 28.3307
  },
  {
    id: '2',
    address: 'Manda Hill Mall',
    description: 'Manchichi Road, Lusaka',
    lat: -15.3982,
    lng: 28.3221
  },
  {
    id: '3',
    address: 'Kenneth Kaunda International Airport',
    description: 'Airport Road, Lusaka',
    lat: -15.3308,
    lng: 28.4526
  },
  {
    id: '4',
    address: 'Arcades Shopping Centre',
    description: 'Great East Road, Lusaka',
    lat: -15.4025,
    lng: 28.3156
  },
  {
    id: '5',
    address: 'Cairo Road',
    description: 'Central Business District, Lusaka',
    lat: -15.4195,
    lng: 28.2831
  }
];
