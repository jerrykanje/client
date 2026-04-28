import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Clock, Navigation, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ScrollableSection } from '../components/ScrollableSection';
import { useGeolocation } from '../hooks/useGeolocation';
import { locationService, PlaceResult } from '../services/locationService';

interface Coords {
  lat: number;
  lng: number;
}

export const ScheduleYourRoute: React.FC = () => {
  const navigate = useNavigate();
  const { address: currentLocation, latitude, longitude, loading: locationLoading } = useGeolocation();
  
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [stops, setStops] = useState<string[]>([]);
  const [activeField, setActiveField] = useState<'pickup' | 'destination' | number>('destination');
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<PlaceResult[]>([]);
  
  // Track coordinates for pickup and destination
  const [pickupCoords, setPickupCoords] = useState<Coords | null>(null);
  const [destinationCoords, setDestinationCoords] = useState<Coords | null>(null);

  useEffect(() => {
    if (currentLocation && !pickup && latitude && longitude) {
      setPickup(currentLocation);
      setPickupCoords({ lat: latitude, lng: longitude });
    }
  }, [currentLocation, pickup, latitude, longitude]);

  useEffect(() => {
    // Auto-highlight destination field on component mount
    setActiveField('destination');
  }, []);

  // Load suggestions using locationService
  useEffect(() => {
    let isMounted = true;
    
    const loadSuggestions = async () => {
      const results = await locationService.searchPlaces(searchQuery);
      if (isMounted) {
        setSuggestions(results);
      }
    };
    
    loadSuggestions();
    
    return () => {
      isMounted = false;
    };
  }, [searchQuery]);

  // Function to find the next empty field
  const getNextEmptyField = (): 'pickup' | 'destination' | number | null => {
    if (!pickup) return 'pickup';
    if (!destination) return 'destination';
    
    // Check for empty stops
    for (let i = 0; i < stops.length; i++) {
      if (!stops[i] || stops[i].trim() === '') {
        return i;
      }
    }
    
    return null; // No empty fields
  };

  // Function to check if all required fields are filled
  const areAllFieldsFilled = (): boolean => {
    const hasPickup = pickup && pickup.trim() !== '';
    const hasDestination = destination && destination.trim() !== '';
    const allStopsFilled = stops.length === 0 || stops.every(stop => stop && stop.trim() !== '');
    
    return hasPickup && hasDestination && allStopsFilled;
  };

  const handleFieldFocus = (field: 'pickup' | 'destination' | number) => {
    setActiveField(field);
    if (field === 'pickup') {
      setSearchQuery(pickup);
    } else if (field === 'destination') {
      setSearchQuery(destination);
    } else {
      setSearchQuery(stops[field] || '');
    }
  };

  const handleSuggestionSelect = (place: PlaceResult) => {
    const address = place.address;
    const coords: Coords = { lat: place.lat, lng: place.lng };
    
    let newPickup = pickup;
    let newDestination = destination;
    let newStops = [...stops];
    let newPickupCoords = pickupCoords;
    let newDestinationCoords = destinationCoords;

    if (activeField === 'pickup') {
      newPickup = address;
      newPickupCoords = coords;
      setPickup(address);
      setPickupCoords(coords);
    } else if (activeField === 'destination') {
      newDestination = address;
      newDestinationCoords = coords;
      setDestination(address);
      setDestinationCoords(coords);
    } else if (typeof activeField === 'number') {
      newStops[activeField] = address;
      setStops(newStops);
    }
    
    setSearchQuery('');
    
    // Check completion using fresh values
    const checkFieldsFilled = (): boolean => {
      const hasPickup = newPickup && newPickup.trim() !== '';
      const hasDestination = newDestination && newDestination.trim() !== '';
      const allStopsFilled = newStops.length === 0 || newStops.every(stop => stop && stop.trim() !== '');
      return hasPickup && hasDestination && allStopsFilled;
    };

    const findNextEmptyField = (): 'pickup' | 'destination' | number | null => {
      if (!newPickup) return 'pickup';
      if (!newDestination) return 'destination';
      for (let i = 0; i < newStops.length; i++) {
        if (!newStops[i] || newStops[i].trim() === '') {
          return i;
        }
      }
      return null;
    };

    const nextField = findNextEmptyField();
    
    if (nextField !== null) {
      setActiveField(nextField);
      if (nextField === 'pickup') {
        setSearchQuery(newPickup);
      } else if (nextField === 'destination') {
        setSearchQuery(newDestination);
      } else {
        setSearchQuery(newStops[nextField] || '');
      }
    } else if (checkFieldsFilled()) {
      // All fields filled, navigate to schedule confirm with coordinates
      navigate('/schedule-confirm', {
        state: {
          pickup: newPickup,
          destination: newDestination,
          stops: newStops,
          pickupCoords: newPickupCoords,
          destinationCoords: newDestinationCoords
        }
      });
    }
  };

  const handleMyLocationSelect = () => {
    if (!currentLocation || !latitude || !longitude) return;
    
    const coords: Coords = { lat: latitude, lng: longitude };
    
    let newPickup = pickup;
    let newDestination = destination;
    let newStops = [...stops];
    let newPickupCoords = pickupCoords;
    let newDestinationCoords = destinationCoords;

    if (activeField === 'pickup') {
      newPickup = currentLocation;
      newPickupCoords = coords;
      setPickup(currentLocation);
      setPickupCoords(coords);
    } else if (activeField === 'destination') {
      newDestination = currentLocation;
      newDestinationCoords = coords;
      setDestination(currentLocation);
      setDestinationCoords(coords);
    } else if (typeof activeField === 'number') {
      newStops[activeField] = currentLocation;
      setStops(newStops);
    }

    setSearchQuery('');

    const checkFieldsFilled = (): boolean => {
      const hasPickup = newPickup && newPickup.trim() !== '';
      const hasDestination = newDestination && newDestination.trim() !== '';
      const allStopsFilled = newStops.length === 0 || newStops.every(stop => stop && stop.trim() !== '');
      return hasPickup && hasDestination && allStopsFilled;
    };

    const findNextEmptyField = (): 'pickup' | 'destination' | number | null => {
      if (!newPickup) return 'pickup';
      if (!newDestination) return 'destination';
      for (let i = 0; i < newStops.length; i++) {
        if (!newStops[i] || newStops[i].trim() === '') {
          return i;
        }
      }
      return null;
    };

    const nextField = findNextEmptyField();

    if (nextField !== null) {
      setActiveField(nextField);
      if (nextField === 'pickup') {
        setSearchQuery(newPickup);
      } else if (nextField === 'destination') {
        setSearchQuery(newDestination);
      } else {
        setSearchQuery(newStops[nextField] || '');
      }
    } else if (checkFieldsFilled()) {
      navigate('/schedule-confirm', {
        state: {
          pickup: newPickup,
          destination: newDestination,
          stops: newStops,
          pickupCoords: newPickupCoords,
          destinationCoords: newDestinationCoords
        }
      });
    }
  };

  const handleAddStop = () => {
    if (stops.length < 3) {
      const newStops = [...stops, ''];
      setStops(newStops);
      setActiveField(newStops.length - 1);
      setSearchQuery('');
    }
  };

  const handleRemoveStop = (index: number) => {
    const newStops = stops.filter((_, i) => i !== index);
    setStops(newStops);
    
    // If we removed the active field, move to destination or next empty field
    if (activeField === index) {
      const nextField = getNextEmptyField();
      setActiveField(nextField || 'destination');
    }
  };

  const handleInputChange = (value: string) => {
    if (activeField === 'pickup') {
      setPickup(value);
      if (pickupCoords) setPickupCoords(null);
    } else if (activeField === 'destination') {
      setDestination(value);
      if (destinationCoords) setDestinationCoords(null);
    } else if (typeof activeField === 'number') {
      const newStops = [...stops];
      newStops[activeField] = value;
      setStops(newStops);
    }
    
    setSearchQuery(value);
  };

  const getPlaceholder = (field: 'pickup' | 'destination' | number) => {
    if (field === 'pickup') return 'Search pick-up location';
    if (field === 'destination') return 'Destination';
    return 'Add stop';
  };

  // Function to determine if a field should have the green glow
  const isFieldActive = (field: 'pickup' | 'destination' | number): boolean => {
    return activeField === field;
  };

  return (
    <motion.div 
      className="min-h-screen bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <motion.div 
        className="bg-white p-4 shadow-sm"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} className="text-gray-800" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">Schedule your ride</h1>
        </div>
      </motion.div>

      {/* Route Form */}
      <motion.div 
        className="p-4 pt-8 space-y-4"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {/* Pickup Location */}
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0"></div>
          <div className="flex-1 relative">
            <input
              type="text"
              value={pickup}
              onChange={(e) => handleInputChange(e.target.value)}
              onFocus={() => handleFieldFocus('pickup')}
              placeholder={locationLoading ? 'Getting your location...' : getPlaceholder('pickup')}
              className={`w-full bg-gray-100 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none transition-all ${
                isFieldActive('pickup') 
                  ? 'ring-2 ring-green-500 bg-white shadow-lg shadow-green-500/20 border-2 border-green-500' 
                  : 'focus:ring-2 focus:ring-green-500 focus:bg-white'
              }`}
              disabled={locationLoading}
            />
            {pickup && activeField === 'pickup' && (
              <button
                onClick={() => {
                  setPickup('');
                  setPickupCoords(null);
                  setSearchQuery('');
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center"
              >
                <X size={14} className="text-gray-600" />
              </button>
            )}
          </div>
          <button
            onClick={handleAddStop}
            className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
            disabled={stops.length >= 3}
          >
            <Plus size={20} className={stops.length >= 3 ? 'text-gray-300' : 'text-gray-600'} />
          </button>
        </div>

        {/* Add Stops */}
        <AnimatePresence>
          {stops.map((stop, index) => (
            <motion.div
              key={index}
              className="flex items-center space-x-3 ml-6"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></div>
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={stop}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onFocus={() => handleFieldFocus(index)}
                  placeholder={getPlaceholder(index)}
                  className={`w-full bg-gray-100 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none transition-all ${
                    isFieldActive(index) 
                      ? 'ring-2 ring-green-500 bg-white shadow-lg shadow-green-500/20 border-2 border-green-500' 
                      : 'focus:ring-2 focus:ring-green-500 focus:bg-white'
                  }`}
                />
              </div>
              <button
                onClick={() => handleRemoveStop(index)}
                className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={16} className="text-red-500" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Destination */}
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-gray-400 rounded-full flex-shrink-0"></div>
          <div className="flex-1 relative">
            <input
              type="text"
              value={destination}
              onChange={(e) => handleInputChange(e.target.value)}
              onFocus={() => handleFieldFocus('destination')}
              placeholder={getPlaceholder('destination')}
              className={`w-full bg-gray-100 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none transition-all ${
                isFieldActive('destination') 
                  ? 'ring-2 ring-green-500 bg-white shadow-lg shadow-green-500/20 border-2 border-green-500' 
                  : 'focus:ring-2 focus:ring-green-500 focus:bg-white'
              }`}
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
          <div className="w-10 flex items-center justify-center">
            <div className="flex flex-col space-y-1">
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Address Suggestions */}
        <ScrollableSection maxHeight="max-h-96">
          <div className="space-y-2 mt-6">
            {suggestions.map((suggestion, index) => (
              <motion.button
                key={suggestion.id}
                onClick={() => handleSuggestionSelect(suggestion)}
                className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Clock className="text-gray-400 flex-shrink-0" size={20} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{suggestion.address}</p>
                  <p className="text-sm text-gray-500 truncate">{suggestion.description}</p>
                </div>
                {suggestion.distance && (
                  <span className="text-sm text-gray-400 flex-shrink-0">{suggestion.distance}</span>
                )}
              </motion.button>
            ))}
            
            {/* My Location Option */}
            <motion.button
              onClick={handleMyLocationSelect}
              className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: suggestions.length * 0.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Navigation className="text-blue-500 flex-shrink-0" size={20} />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-blue-600">My location</p>
                {currentLocation && (
                  <p className="text-sm text-gray-500 truncate">{currentLocation}</p>
                )}
              </div>
            </motion.button>
          </div>
        </ScrollableSection>
      </motion.div>
    </motion.div>
  );
};
