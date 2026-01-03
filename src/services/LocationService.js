import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  NEWSDATA_API_KEY, 
  OPENTRIPMAP_API_KEY, 
  FOURSQUARE_API_KEY, 
  GEMINI_API_KEY,
  GEOAPIFY_API_KEY,
  WAQI_API_TOKEN,
  EVENTBRITE_API_TOKEN
} from '@env';

// Cache configuration
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

// API Configuration
const API_CONFIG = {
  // NewsData.io API
  NEWS_API: {
    baseUrl: 'https://newsdata.io/api/1/news',
    apiKey: NEWSDATA_API_KEY
  },
  // OpenTripMap API
  OPENTRIPMAP_API: {
    baseUrl: 'https://api.opentripmap.com/0.1/en/places',
    apiKey: OPENTRIPMAP_API_KEY
  },
  
  // Foursquare API
  FOURSQUARE_API: {
    baseUrl: 'https://api.foursquare.com/v3/places/search',
    apiKey: FOURSQUARE_API_KEY
  },
  
  // Google Gemini API
  GEMINI_API: {
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
    apiKey: GEMINI_API_KEY
  },
  
  // OpenStreetMap Nominatim API
  NOMINATIM_API: {
    baseUrl: 'https://nominatim.openstreetmap.org/search'
  },
  
  // Overpass API for holy places
  OVERPASS_API: {
    baseUrl: 'https://overpass-api.de/api/interpreter'
  },
  
  // Geoapify API for places and accommodation
  GEOAPIFY_API: {
    baseUrl: 'https://api.geoapify.com/v2/places',
    apiKey: GEOAPIFY_API_KEY
  },
  
  // World Air Quality Index API
  WAQI_API: {
    baseUrl: 'https://api.waqi.info/feed',
    apiKey: WAQI_API_TOKEN
  },
  
  // Eventbrite API for events
  EVENTBRITE_API: {
    baseUrl: 'https://www.eventbriteapi.com/v3',
    apiKey: EVENTBRITE_API_TOKEN
  }
};

export const LocationService = {
  // Request location permissions
  async requestLocationPermission() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting location permission:', error);
      return false;
    }
  },
  // Get current location (optional - gracefully handles permission denial)
  async getCurrentLocation() {
    try {
      // Check if location permissions are available
      const { status } = await Location.getForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        // Try to request permission
        const { status: newStatus } = await Location.requestForegroundPermissionsAsync();
        
        if (newStatus !== 'granted') {
          throw new Error('Location permission denied');
        }
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeout: 10000, // 10 second timeout
      });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
    } catch (error) {
      console.error('Error getting current location:', error);
      throw error;
    }
  },

  // Reverse geocode (coordinates to location name)
  async reverseGeocode(latitude, longitude) {
    try {
      const result = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (result && result.length > 0) {
        const location = result[0];
        return {
          city: location.city || location.subregion || 'Unknown City',
          region: location.region || location.country || 'Unknown Region',
          country: location.country || 'Unknown Country',
          formattedAddress: this.formatAddress(location),
        };
      }

      return null;
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      return null;
    }
  },

  // Format address from location object
  formatAddress(location) {
    const parts = [];
    
    if (location.name) parts.push(location.name);
    if (location.city) parts.push(location.city);
    if (location.region) parts.push(location.region);
    if (location.country) parts.push(location.country);
    
    return parts.join(', ') || 'Unknown Location';  },

  // Search for locations using Nominatim API (no permissions required)
  async searchLocations(query) {
    try {
      const response = await fetch(
        `${API_CONFIG.NOMINATIM_API.baseUrl}?q=${encodeURIComponent(query)}&format=json&limit=5&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'CurioCity/1.0 (React Native Expo App)',
            'Accept': 'application/json',
          },
        }
      );
      
      if (!response.ok) {
        throw new Error(`Nominatim API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data && data.length > 0) {
        return data.map(location => ({
          latitude: parseFloat(location.lat),
          longitude: parseFloat(location.lon),
          name: location.display_name,
          formattedAddress: location.display_name
        }));
      }

      return [];
    } catch (error) {
      console.error('Error searching locations:', error);      return [];
    }
  },

  // Get Wikipedia content for a location
  async getWikipediaContent(locationName) {
    try {
      // First, search for the page
      const searchResponse = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(locationName)}`
      );
      
      if (!searchResponse.ok) {
        console.warn(`Wikipedia API returned ${searchResponse.status} for ${locationName}`);
        return null;
      }

      const data = await searchResponse.json();
      
      // Check if it's a disambiguation page or not found
      if (data.type === 'disambiguation' || data.type === 'no-extract') {
        console.warn(`Wikipedia disambiguation or no extract for ${locationName}`);
        return null;
      }
      
      return {
        title: data.title,
        description: data.extract || `${locationName} is a fascinating location with rich history and culture.`,
        fullDescription: data.extract || `Explore ${locationName} and discover its unique attractions, local culture, and historical significance. This destination offers visitors an authentic experience with plenty to see and do.`,
        thumbnail: data.thumbnail?.source || null,
        pageUrl: data.content_urls?.desktop?.page || null,
        coordinates: data.coordinates ? {
          latitude: data.coordinates.lat,
          longitude: data.coordinates.lon
        } : null
      };
    } catch (error) {
      console.error('Wikipedia API error:', error);
      return null;
    }
  },
  // Get location details for a specific place with comprehensive API integration
  async getLocationDetails(latitude, longitude) {
    try {
      const locationInfo = await this.reverseGeocode(latitude, longitude);
      
      if (!locationInfo) {
        return null;
      }

      // Get comprehensive data from all APIs
      const comprehensiveData = await this.getComprehensiveLocationData(
        locationInfo.city,
        latitude,
        longitude
      );
      
      // Fallback descriptions if Wikipedia fails
      const fallbackDescription = `Welcome to ${locationInfo.city}, ${locationInfo.country}! This beautiful location offers a rich blend of culture, history, and modern attractions.`;
      const fallbackFullDescription = `${locationInfo.city} is a vibrant destination located in ${locationInfo.region}, ${locationInfo.country}. Known for its unique character and local attractions, this location offers visitors an authentic experience of the region's culture and heritage.`;

      return {
        name: locationInfo.city,
        description: comprehensiveData.wikipedia?.description || fallbackDescription,
        fullDescription: comprehensiveData.wikipedia?.fullDescription || fallbackFullDescription,
        coordinates: { latitude, longitude },
        formattedAddress: locationInfo.formattedAddress,
        region: locationInfo.region,
        country: locationInfo.country,
        thumbnail: comprehensiveData.wikipedia?.thumbnail || null,
        wikipediaUrl: comprehensiveData.wikipedia?.pageUrl || null,
        hasWikipediaData: !!comprehensiveData.wikipedia,        wikipediaTitle: comprehensiveData.wikipedia?.title || null,
        
        // Real API data for all sections
        news: comprehensiveData.news,
        placesToVisit: comprehensiveData.placesToVisit,
        restaurants: comprehensiveData.restaurants,
        holyPlaces: comprehensiveData.holyPlaces,
        accommodation: comprehensiveData.accommodation,
        services: comprehensiveData.services,
        history: comprehensiveData.generatedHistory,
        
        // Metadata
        hasRealData: true,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting location details:', error);
      return null;
    }
  },  // Default location data (New York as fallback)
  getDefaultLocation() {
    return {
      name: 'New York',
      description: 'Welcome to New York, the city that never sleeps! Known as the Big Apple, New York City is a global hub for business, arts, fashion, and culture.',
      fullDescription: 'New York City, often simply called New York, is the most populous city in the United States. Located at the southern tip of the state of New York, it is composed of five boroughs: Manhattan, Brooklyn, Queens, The Bronx, and Staten Island. NYC is a global center for finance, technology, arts, fashion, and culture, home to iconic landmarks like the Statue of Liberty, Empire State Building, and Central Park.',
      coordinates: { latitude: 40.7128, longitude: -74.0060 },
      formattedAddress: 'New York, NY, USA',
      region: 'New York',
      country: 'United States',
    };
  },  // Enhanced default location with comprehensive API data
  async getDefaultLocationWithWikipedia() {
    try {
      const defaultLocation = this.getDefaultLocation();
      const comprehensiveData = await this.getComprehensiveLocationData(
        'New York',
        40.7128,
        -74.0060
      );
      
      return {
        ...defaultLocation,
        description: comprehensiveData.wikipedia?.description || defaultLocation.description,
        fullDescription: comprehensiveData.wikipedia?.fullDescription || defaultLocation.fullDescription,
        thumbnail: comprehensiveData.wikipedia?.thumbnail,
        wikipediaUrl: comprehensiveData.wikipedia?.pageUrl,
        hasWikipediaData: !!comprehensiveData.wikipedia,
        wikipediaTitle: comprehensiveData.wikipedia?.title,
          // Real API data for all sections
        news: comprehensiveData.news,
        placesToVisit: comprehensiveData.placesToVisit,
        restaurants: comprehensiveData.restaurants,
        holyPlaces: comprehensiveData.holyPlaces,
        accommodation: comprehensiveData.accommodation,
        services: comprehensiveData.services,
        history: comprehensiveData.generatedHistory,
        
        // Metadata
        hasRealData: true,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting comprehensive data for New York:', error);
      return this.getDefaultLocation();
    }
  },

  // Get local news for a location
  async getLocalNews(locationName, country = 'in') {
    try {
      const response = await fetch(
        `${API_CONFIG.NEWS_API.baseUrl}?apikey=${API_CONFIG.NEWS_API.apiKey}&q=${encodeURIComponent(locationName)}&country=${country}&language=en&size=10`
      );
      
      if (!response.ok) {
        throw new Error(`News API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      return data.results?.map(article => ({
        title: article.title,
        description: article.description,
        url: article.link,
        publishedAt: article.pubDate,
        source: article.source_id,
        imageUrl: article.image_url
      })) || [];
    } catch (error) {
      console.error('Error fetching local news:', error);
      return [];
    }
  },  // Get places of interest from multiple sources and combine results
  async getPlacesToVisit(latitude, longitude, radius = 10000) {
    try {
      // Get tourist attractions from OpenTripMap with different categories
      const touristAttractionsPromise = this.getOpenTripMapTouristAttractions(latitude, longitude, radius);
      const culturalSitesPromise = this.getOpenTripMapCulturalSites(latitude, longitude, radius);
      
      // Wait for both API calls to complete
      const [touristResults, culturalResults] = await Promise.all([
        touristAttractionsPromise,
        culturalSitesPromise
      ]);
      
      // Combine and deduplicate results
      const combinedResults = [...touristResults, ...culturalResults];
      return this.deduplicatePlaces(combinedResults);
      
    } catch (error) {
      console.error('Error fetching places to visit:', error);
      return [];
    }
  },
  // Get tourist attractions from OpenTripMap
  async getOpenTripMapTouristAttractions(latitude, longitude, radius = 10000) {
    try {
      const response = await fetch(
        `${API_CONFIG.OPENTRIPMAP_API.baseUrl}/radius?radius=${radius}&lon=${longitude}&lat=${latitude}&apikey=${API_CONFIG.OPENTRIPMAP_API.apiKey}&format=json&kinds=interesting_places,tourist_facilities,historic,museums,monuments_and_memorials&limit=15`
      );
      
      if (!response.ok) {
        console.log(`OpenTripMap tourist attractions API warning: ${response.status}`);
        return [];
      }
      
      const data = await response.json();
      
      return data?.map(place => ({
        name: place.name || 'Tourist Attraction',
        type: place.kinds,
        coordinates: {
          latitude: place.point.lat,
          longitude: place.point.lon
        },
        distance: place.dist,
        rating: place.rate || 0,
        source: 'OpenTripMap'
      })) || [];
    } catch (error) {
      console.error('Error fetching OpenTripMap tourist attractions:', error);
      return [];
    }
  },
  // Get cultural sites from OpenTripMap
  async getOpenTripMapCulturalSites(latitude, longitude, radius = 10000) {
    try {      // Validate coordinates
      if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
        console.log('Invalid coordinates for OpenTripMap cultural sites');
        return [];
      }
      
      // Ensure reasonable radius
      const validRadius = Math.min(Math.max(radius, 1000), 50000);
      
      const response = await fetch(
        `${API_CONFIG.OPENTRIPMAP_API.baseUrl}/radius?radius=${validRadius}&lon=${longitude}&lat=${latitude}&apikey=${API_CONFIG.OPENTRIPMAP_API.apiKey}&format=json&kinds=cultural,architecture,archaeological_sites,palaces,castles&limit=15`
      );
      
      if (!response.ok) {
        console.log(`OpenTripMap cultural sites API warning: ${response.status}`);
        return [];
      }
      
      const data = await response.json();
      
      return data?.map(place => ({
        name: place.name || 'Cultural Site',
        type: place.kinds,
        coordinates: {
          latitude: place.point.lat,
          longitude: place.point.lon
        },
        distance: place.dist,
        rating: place.rate || 0,
        source: 'OpenTripMap'
      })) || [];
    } catch (error) {
      console.error('Error fetching OpenTripMap cultural sites:', error);
      return [];
    }
  },

  // Deduplicate places based on name and proximity
  deduplicatePlaces(places) {
    const uniquePlaces = [];
    const seen = new Set();
    
    for (const place of places) {
      // Create a key based on name and approximate location
      const key = `${place.name?.toLowerCase()}_${Math.round(place.coordinates?.latitude * 1000)}_${Math.round(place.coordinates?.longitude * 1000)}`;
      
      if (!seen.has(key) && place.name && place.name !== 'Tourist Attraction' && place.name !== 'Cultural Site') {
        seen.add(key);
        uniquePlaces.push(place);
      }
    }
    
    return uniquePlaces;
  },

  // Get restaurants using Foursquare API
    // Get restaurants from multiple sources and combine results
  async getLocalRestaurants(locationName, latitude, longitude) {
    try {
      // Get restaurants from Foursquare
      const foursquarePromise = this.getFoursquareRestaurants(locationName);
      
      // Get restaurants from OpenTripMap
      const opentripmapPromise = this.getOpenTripMapRestaurants(latitude, longitude);
      
      // Get restaurants from Overpass API (most reliable)
      const overpassPromise = this.getOverpassRestaurants(latitude, longitude);
      
      // Wait for all APIs to complete
      const [foursquareResults, opentripmapResults, overpassResults] = await Promise.allSettled([
        foursquarePromise,
        opentripmapPromise,
        overpassPromise
      ]);
      
      // Combine results from all sources
      const combinedResults = [
        ...(foursquareResults.status === 'fulfilled' ? foursquareResults.value : []),
        ...(opentripmapResults.status === 'fulfilled' ? opentripmapResults.value : []),
        ...(overpassResults.status === 'fulfilled' ? overpassResults.value : [])
      ];
      
      return this.deduplicateRestaurants(combinedResults);
      
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      return [];
    }
  },

  // Get restaurants from Overpass API
  async getOverpassRestaurants(latitude, longitude, radius = 0.08) {
    try {
      // Validate coordinates
      if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
        console.log('Invalid coordinates for Overpass restaurants');
        return [];
      }

      const latMin = (latitude - radius).toFixed(6);
      const latMax = (latitude + radius).toFixed(6);
      const lngMin = (longitude - radius).toFixed(6);
      const lngMax = (longitude + radius).toFixed(6);
      
      const query = `[out:json][timeout:25];(
        node["amenity"="restaurant"](${latMin},${lngMin},${latMax},${lngMax});
        node["amenity"="cafe"](${latMin},${lngMin},${latMax},${lngMax});
        node["amenity"="fast_food"](${latMin},${lngMin},${latMax},${lngMax});
      );out body 30;`;
      
      console.log('Fetching restaurants from Overpass...');
      const response = await fetch(
        `${API_CONFIG.OVERPASS_API.baseUrl}?data=${encodeURIComponent(query)}`
      );
      
      if (!response.ok) {
        console.log(`Overpass restaurants API error: ${response.status}`);
        return [];
      }
      
      const data = await response.json();
      console.log('Restaurants found from Overpass:', data.elements?.length || 0);
      
      return data.elements?.map(restaurant => {
        const name = restaurant.tags?.name;
        if (!name) return null;
        return {
          name: name,
          categories: [restaurant.tags?.cuisine || restaurant.tags?.amenity || 'Restaurant'].filter(Boolean),
          coordinates: {
            latitude: restaurant.lat,
            longitude: restaurant.lon
          },
          address: restaurant.tags?.['addr:street'] || '',
          distance: this.calculateDistance(latitude, longitude, restaurant.lat, restaurant.lon),
          source: 'Overpass'
        };
      }).filter(r => r !== null) || [];
    } catch (error) {
      console.error('Error fetching Overpass restaurants:', error);
      return [];
    }
  },

  // Get restaurants from Foursquare API
  async getFoursquareRestaurants(locationName) {
    try {
      const response = await fetch(
        `${API_CONFIG.FOURSQUARE_API.baseUrl}?near=${encodeURIComponent(locationName)}&categories=13065&limit=20`,
        {
          headers: {
            'Authorization': API_CONFIG.FOURSQUARE_API.apiKey,
            'Accept': 'application/json'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`Foursquare API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      return data.results?.map(restaurant => ({
        name: restaurant.name,
        address: restaurant.location?.formatted_address,
        categories: restaurant.categories?.map(cat => cat.name),
        rating: restaurant.rating,
        coordinates: {
          latitude: restaurant.geocodes?.main?.latitude,
          longitude: restaurant.geocodes?.main?.longitude
        },
        distance: restaurant.distance,
        source: 'Foursquare'
      })) || [];
    } catch (error) {
      console.error('Error fetching Foursquare restaurants:', error);
      return [];
    }
  },
  // Get restaurants from OpenTripMap API
  async getOpenTripMapRestaurants(latitude, longitude, radius = 10000) {
    try {
      const response = await fetch(
        `${API_CONFIG.OPENTRIPMAP_API.baseUrl}/radius?radius=${radius}&lon=${longitude}&lat=${latitude}&apikey=${API_CONFIG.OPENTRIPMAP_API.apiKey}&format=json&kinds=foods&limit=20`
      );
      
      if (!response.ok) {
        console.log(`OpenTripMap restaurants API warning: ${response.status}`);
        return [];
      }
      
      const data = await response.json();
      
      return data?.map(restaurant => ({
        name: restaurant.name || 'Restaurant',
        type: restaurant.kinds,
        coordinates: {
          latitude: restaurant.point.lat,
          longitude: restaurant.point.lon
        },
        distance: restaurant.dist,
        rating: restaurant.rate || 0,
        categories: ['Restaurant'],
        source: 'OpenTripMap'
      })) || [];
    } catch (error) {
      console.error('Error fetching OpenTripMap restaurants:', error);
      return [];
    }
  },

  // Deduplicate restaurants based on name and proximity
  deduplicateRestaurants(restaurants) {
    const uniqueRestaurants = [];
    const seen = new Set();
    
    for (const restaurant of restaurants) {
      // Create a key based on name and approximate location
      const key = `${restaurant.name?.toLowerCase()}_${Math.round(restaurant.coordinates?.latitude * 1000)}_${Math.round(restaurant.coordinates?.longitude * 1000)}`;
      
      if (!seen.has(key) && restaurant.name) {
        seen.add(key);
        uniqueRestaurants.push(restaurant);
      }
    }
    
    return uniqueRestaurants;
  },

  // Get holy places using Overpass API
  async getHolyPlaces(latitude, longitude, radius = 0.08) {
    try {
      // Validate coordinates
      if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
        console.log('Invalid coordinates for holy places');
        return [];
      }

      const latMin = (latitude - radius).toFixed(6);
      const latMax = (latitude + radius).toFixed(6);
      const lngMin = (longitude - radius).toFixed(6);
      const lngMax = (longitude + radius).toFixed(6);
      
      const query = `[out:json][timeout:25];node["amenity"="place_of_worship"](${latMin},${lngMin},${latMax},${lngMax});out body 25;`;
      
      console.log('Fetching holy places from Overpass...');
      const response = await fetch(
        `${API_CONFIG.OVERPASS_API.baseUrl}?data=${encodeURIComponent(query)}`
      );
      
      if (!response.ok) {
        console.log(`Overpass holy places API error: ${response.status}`);
        return [];
      }
      
      const data = await response.json();
      console.log('Holy places found:', data.elements?.length || 0);
      
      return data.elements?.map(place => {
        const name = place.tags?.name;
        if (!name) return null;
        return {
          name: name,
          religion: place.tags?.religion || 'Unknown',
          type: place.tags?.building || place.tags?.denomination || 'place_of_worship',
          coordinates: {
            latitude: place.lat,
            longitude: place.lon
          },
          address: place.tags?.['addr:full'] || place.tags?.['addr:street']
        };
      }).filter(p => p !== null) || [];
    } catch (error) {
      console.error('Error fetching holy places:', error);
      return [];
    }
  },  // Get services and amenities from multiple sources and combine results (excluding accommodation)
  async getLocalServices(latitude, longitude, radius = 10000) {
    try {
      // Get services from OpenTripMap
      const opentripmapPromise = this.getOpenTripMapServices(latitude, longitude, radius);
      
      // Get services from Overpass API (more reliable for services)
      const overpassPromise = this.getOverpassServices(latitude, longitude);
      
      // Wait for API calls to complete
      const [opentripmapResults, overpassResults] = await Promise.allSettled([
        opentripmapPromise,
        overpassPromise
      ]);
      
      // Combine results from both sources
      const combinedResults = [
        ...(opentripmapResults.status === 'fulfilled' ? opentripmapResults.value : []),
        ...(overpassResults.status === 'fulfilled' ? overpassResults.value : [])
      ];
      
      const deduplicatedResults = this.deduplicateServices(combinedResults);
      
      return deduplicatedResults;
      
    } catch (error) {
      console.error('Error fetching local services:', error);
      return [];
    }
  },

  // Get services using Overpass API
  async getOverpassServices(latitude, longitude, radius = 0.08) {
    try {
      // Validate coordinates
      if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
        console.log('Invalid coordinates for Overpass services');
        return [];
      }

      const latMin = (latitude - radius).toFixed(6);
      const latMax = (latitude + radius).toFixed(6);
      const lngMin = (longitude - radius).toFixed(6);
      const lngMax = (longitude + radius).toFixed(6);
      
      // Query for common amenities
      const query = `[out:json][timeout:25];(
        node["amenity"="bank"](${latMin},${lngMin},${latMax},${lngMax});
        node["amenity"="pharmacy"](${latMin},${lngMin},${latMax},${lngMax});
        node["amenity"="hospital"](${latMin},${lngMin},${latMax},${lngMax});
        node["amenity"="clinic"](${latMin},${lngMin},${latMax},${lngMax});
        node["amenity"="post_office"](${latMin},${lngMin},${latMax},${lngMax});
        node["amenity"="police"](${latMin},${lngMin},${latMax},${lngMax});
        node["amenity"="library"](${latMin},${lngMin},${latMax},${lngMax});
        node["amenity"="fuel"](${latMin},${lngMin},${latMax},${lngMax});
        node["shop"="supermarket"](${latMin},${lngMin},${latMax},${lngMax});
        node["shop"="convenience"](${latMin},${lngMin},${latMax},${lngMax});
        node["leisure"="fitness_centre"](${latMin},${lngMin},${latMax},${lngMax});
      );out body 50;`;
      
      console.log('Fetching services from Overpass...');
      const response = await fetch(
        `${API_CONFIG.OVERPASS_API.baseUrl}?data=${encodeURIComponent(query)}`
      );
      
      if (!response.ok) {
        console.log(`Overpass services API error: ${response.status}`);
        return [];
      }
      
      const data = await response.json();
      console.log('Services found from Overpass:', data.elements?.length || 0);
      
      return data.elements?.map(service => {
        const type = service.tags?.amenity || service.tags?.shop || service.tags?.leisure || 'service';
        const name = service.tags?.name;
        // Only include services with actual names
        if (!name) return null;
        return {
          name: name,
          type: type,
          coordinates: {
            latitude: service.lat,
            longitude: service.lon
          },
          distance: this.calculateDistance(latitude, longitude, service.lat, service.lon),
          source: 'Overpass'
        };
      }).filter(s => s !== null) || [];
    } catch (error) {
      console.error('Error fetching Overpass services:', error);
      return [];
    }
  },

  // Get a readable name from service type
  getServiceNameFromType(type) {
    const typeMap = {
      'bank': 'Bank',
      'pharmacy': 'Pharmacy',
      'hospital': 'Hospital',
      'clinic': 'Medical Clinic',
      'post_office': 'Post Office',
      'police': 'Police Station',
      'library': 'Library',
      'fuel': 'Gas Station',
      'supermarket': 'Supermarket',
      'convenience': 'Convenience Store',
      'fitness_centre': 'Fitness Center'
    };
    return typeMap[type] || type;
  },

  // Calculate distance between two coordinates (in meters)
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371000; // Earth's radius in meters
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Math.round(R * c);
  },
  // Deduplicate services based on name and proximity
  deduplicateServices(services) {
    const uniqueServices = [];
    const seen = new Set();
    
    for (const service of services) {
      // Create a key based on name and approximate location
      const key = `${service.name?.toLowerCase()}_${Math.round(service.coordinates?.latitude * 1000)}_${Math.round(service.coordinates?.longitude * 1000)}`;
      
      if (!seen.has(key) && service.name && service.name.trim() !== '') {
        seen.add(key);
        uniqueServices.push(service);
      }
    }
    
    return uniqueServices;
  },// Get general services from OpenTripMap
  async getOpenTripMapServices(latitude, longitude, radius = 10000) {
    try {
      // Validate coordinates
      if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
        console.log('Invalid coordinates for OpenTripMap services');
        return [];
      }
      
      // Ensure reasonable radius
      const validRadius = Math.min(Math.max(radius, 1000), 50000);      // Use only valid OpenTripMap categories (based on API testing)
      // Valid categories: banks, shops, sport
      // Invalid categories removed: hospitals, pharmacy, police, post_offices, education
      const url = `${API_CONFIG.OPENTRIPMAP_API.baseUrl}/radius?radius=${validRadius}&lon=${longitude}&lat=${latitude}&apikey=${API_CONFIG.OPENTRIPMAP_API.apiKey}&format=json&kinds=banks,shops,sport&limit=50`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        console.log(`OpenTripMap services API error: ${response.status}`);
        return [];
      }
      
      const data = await response.json();
      
      const mappedData = data?.map(service => ({
        name: service.name || 'Unnamed Service',
        type: service.kinds,
        coordinates: {
          latitude: service.point.lat,
          longitude: service.point.lon
        },        distance: service.dist,
        source: 'OpenTripMap'
      })) || [];
      
      return mappedData;
    } catch (error) {
      console.error('Error fetching OpenTripMap services:', error);
      return [];
    }  },

  // Get accommodation from multiple sources and combine results
  async getAccommodation(latitude, longitude, radius = 10000) {
    try {
      // Get hotels and accommodation from OpenTripMap
      const opentripmapPromise = this.getOpenTripMapAccommodation(latitude, longitude, radius);
      
      // Get hotels from Foursquare if needed (can be added later)
      // const foursquarePromise = this.getFoursquareAccommodation(locationName);
      
      // Wait for API calls to complete
      const [opentripmapResults] = await Promise.all([
        opentripmapPromise
      ]);
      
      // Combine and deduplicate results
      const combinedResults = [...opentripmapResults];
      return this.deduplicateAccommodation(combinedResults);
      
    } catch (error) {
      console.error('Error fetching accommodation:', error);
      return [];
    }
  },

  // Get accommodation from OpenTripMap API
  async getOpenTripMapAccommodation(latitude, longitude, radius = 10000) {
    try {
      // Validate coordinates
      if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
        console.log('Invalid coordinates for OpenTripMap accommodation');
        return [];
      }
      
      // Ensure reasonable radius
      const validRadius = Math.min(Math.max(radius, 1000), 50000);
      
      const response = await fetch(
        `${API_CONFIG.OPENTRIPMAP_API.baseUrl}/radius?radius=${validRadius}&lon=${longitude}&lat=${latitude}&apikey=${API_CONFIG.OPENTRIPMAP_API.apiKey}&format=json&kinds=accomodations&limit=25`
      );
      
      if (!response.ok) {
        console.log(`OpenTripMap accommodation API warning: ${response.status}`);
        return [];
      }
      
      const data = await response.json();
      
      return data?.map(hotel => ({
        name: hotel.name || 'Hotel',
        type: this.categorizeAccommodationType(hotel.kinds),
        coordinates: {
          latitude: hotel.point.lat,
          longitude: hotel.point.lon
        },
        distance: hotel.dist,
        rating: hotel.rate || null,
        amenities: this.extractAmenities(hotel.kinds),
        priceRange: this.estimatePriceRange(hotel.kinds, hotel.rate),
        source: 'OpenTripMap'
      })) || [];
    } catch (error) {
      console.error('Error fetching OpenTripMap accommodation:', error);
      return [];
    }
  },

  // Categorize accommodation type based on OpenTripMap kinds
  categorizeAccommodationType(kinds) {
    if (!kinds) return 'Hotel';
    
    const kindsLower = kinds.toLowerCase();
    
    if (kindsLower.includes('resort')) return 'Resort';
    if (kindsLower.includes('hostel')) return 'Hostel';
    if (kindsLower.includes('guest_house') || kindsLower.includes('guesthouse')) return 'Guest House';
    if (kindsLower.includes('apartment')) return 'Apartment';
    if (kindsLower.includes('villa')) return 'Villa';
    if (kindsLower.includes('bed_and_breakfast') || kindsLower.includes('bnb')) return 'B&B';
    if (kindsLower.includes('luxury')) return 'Luxury Hotel';
    if (kindsLower.includes('budget')) return 'Budget Hotel';
    
    return 'Hotel';
  },

  // Extract amenities from accommodation kinds
  extractAmenities(kinds) {
    if (!kinds) return [];
    
    const amenities = [];
    const kindsLower = kinds.toLowerCase();
    
    if (kindsLower.includes('wifi')) amenities.push('WiFi');
    if (kindsLower.includes('pool')) amenities.push('Swimming Pool');
    if (kindsLower.includes('spa')) amenities.push('Spa');
    if (kindsLower.includes('restaurant')) amenities.push('Restaurant');
    if (kindsLower.includes('fitness')) amenities.push('Fitness Center');
    if (kindsLower.includes('parking')) amenities.push('Parking');
    if (kindsLower.includes('pet')) amenities.push('Pet Friendly');
    if (kindsLower.includes('business')) amenities.push('Business Center');
    if (kindsLower.includes('conference')) amenities.push('Conference Rooms');
    
    // Default amenities for hotels
    if (amenities.length === 0) {
      amenities.push('Standard Rooms', 'Reception', 'Housekeeping');
    }
    
    return amenities;
  },

  // Estimate price range based on type and rating
  estimatePriceRange(kinds, rating) {
    const kindsLower = kinds?.toLowerCase() || '';
    
    if (kindsLower.includes('luxury') || (rating && rating >= 4.5)) return '$$$$ (Luxury)';
    if (kindsLower.includes('resort') || (rating && rating >= 4.0)) return '$$$ (Premium)';
    if (kindsLower.includes('budget') || kindsLower.includes('hostel')) return '$ (Budget)';
    if (rating && rating >= 3.5) return '$$ (Mid-range)';
    
    return '$$ (Standard)';
  },

  // Deduplicate accommodation based on name and proximity
  deduplicateAccommodation(accommodation) {
    const uniqueAccommodation = [];
    const seen = new Set();
    
    for (const hotel of accommodation) {
      // Create a key based on name and approximate location
      const key = `${hotel.name?.toLowerCase()}_${Math.round(hotel.coordinates?.latitude * 1000)}_${Math.round(hotel.coordinates?.longitude * 1000)}`;
      
      if (!seen.has(key) && hotel.name && hotel.name !== 'Hotel') {
        seen.add(key);
        uniqueAccommodation.push(hotel);
      }
    }
    
    return uniqueAccommodation;
  },

  // Generate content using Gemini AI
  async generateContentWithGemini(prompt) {
    try {
      const response = await fetch(
        `${API_CONFIG.GEMINI_API.baseUrl}?key=${API_CONFIG.GEMINI_API.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: prompt
              }]
            }]
          })
        }
      );
      
      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    } catch (error) {
      console.error('Error generating content with Gemini:', error);
      return '';
    }
  },
  // Get comprehensive location data with all APIs
  async getComprehensiveLocationData(locationName, latitude, longitude) {
    try {      const [
        news,
        placesToVisit,
        restaurants,
        holyPlaces,
        accommodation,
        services,
        wikipediaContent,
        airQuality
      ] = await Promise.allSettled([
        this.getLocalNews(locationName),
        this.getPlacesToVisit(latitude, longitude),
        this.getLocalRestaurants(locationName, latitude, longitude),
        this.getHolyPlaces(latitude, longitude),
        this.getAccommodationFromGeoapify(latitude, longitude),
        this.getLocalServices(latitude, longitude),
        this.getWikipediaContent(locationName),
        this.getAirQuality(latitude, longitude)
      ]);

      // Generate historical content using Gemini AI
      const historyPrompt = `Write a brief historical overview of ${locationName}. Include key historical events, cultural significance, and important landmarks. Keep it informative but concise, around 200 words.`;
      const generatedHistory = await this.generateContentWithGemini(historyPrompt);

      return {
        news: news.status === 'fulfilled' ? news.value : [],
        placesToVisit: placesToVisit.status === 'fulfilled' ? placesToVisit.value : [],
        restaurants: restaurants.status === 'fulfilled' ? restaurants.value : [],
        holyPlaces: holyPlaces.status === 'fulfilled' ? holyPlaces.value : [],
        accommodation: accommodation.status === 'fulfilled' ? accommodation.value : [],
        services: services.status === 'fulfilled' ? services.value : [],
        wikipedia: wikipediaContent.status === 'fulfilled' ? wikipediaContent.value : null,
        airQuality: airQuality.status === 'fulfilled' ? airQuality.value : null,
        generatedHistory: generatedHistory || `${locationName} has a rich history and cultural heritage that spans many centuries.`
      };
    } catch (error) {
      console.error('Error getting comprehensive location data:', error);
      return {
        news: [],
        placesToVisit: [],
        restaurants: [],
        holyPlaces: [],
        accommodation: [],
        services: [],
        wikipedia: null,
        airQuality: null,
        generatedHistory: ''
      };
    }
  },

  // Get accommodation from Geoapify API (better results than OpenTripMap)
  async getAccommodationFromGeoapify(latitude, longitude, radius = 5000) {
    try {
      // Try Geoapify first
      let results = [];
      
      if (API_CONFIG.GEOAPIFY_API.apiKey) {
        const response = await fetch(
          `${API_CONFIG.GEOAPIFY_API.baseUrl}?categories=accommodation&filter=circle:${longitude},${latitude},${radius}&limit=20&apiKey=${API_CONFIG.GEOAPIFY_API.apiKey}`
        );
        
        if (response.ok) {
          const data = await response.json();
          
          results = (data.features || [])?.map(feature => ({
            name: feature.properties.name || 'Accommodation',
            type: this.categorizeGeoapifyAccommodation(feature.properties.categories),
            address: feature.properties.formatted || feature.properties.street,
            coordinates: {
              latitude: feature.geometry.coordinates[1],
              longitude: feature.geometry.coordinates[0]
            },
            distance: feature.properties.distance || null,
            rating: feature.properties.rating || null,
            amenities: this.extractGeoapifyAmenities(feature.properties),
            priceRange: this.estimatePriceRange(feature.properties.categories?.join(','), feature.properties.rating),
            website: feature.properties.website || null,
            phone: feature.properties.phone || null,
            source: 'Geoapify'
          })).filter(item => item.name && item.name !== 'Accommodation') || [];
        }
      }
      
      // If no results from Geoapify, try Overpass
      if (results.length === 0) {
        results = await this.getOverpassAccommodation(latitude, longitude);
      }
      
      // If still no results, try OpenTripMap
      if (results.length === 0) {
        results = await this.getAccommodation(latitude, longitude);
      }
      return results;
    } catch (error) {
      console.error('Error fetching Geoapify accommodation:', error);
      return this.getAccommodation(latitude, longitude);
    }
  },

  // Get accommodation from Overpass API
  async getOverpassAccommodation(latitude, longitude, radius = 0.08) {
    try {
      // Validate coordinates
      if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
        console.log('Invalid coordinates for Overpass accommodation');
        return [];
      }

      const latMin = (latitude - radius).toFixed(6);
      const latMax = (latitude + radius).toFixed(6);
      const lngMin = (longitude - radius).toFixed(6);
      const lngMax = (longitude + radius).toFixed(6);
      
      const query = `[out:json][timeout:25];(
        node["tourism"="hotel"](${latMin},${lngMin},${latMax},${lngMax});
        node["tourism"="guest_house"](${latMin},${lngMin},${latMax},${lngMax});
        node["tourism"="hostel"](${latMin},${lngMin},${latMax},${lngMax});
        node["tourism"="motel"](${latMin},${lngMin},${latMax},${lngMax});
        way["tourism"="hotel"](${latMin},${lngMin},${latMax},${lngMax});
      );out body center 25;`;
      
      console.log('Fetching accommodation from Overpass...');
      const response = await fetch(
        `${API_CONFIG.OVERPASS_API.baseUrl}?data=${encodeURIComponent(query)}`
      );
      
      if (!response.ok) {
        console.log(`Overpass accommodation API error: ${response.status}`);
        return [];
      }
      
      const data = await response.json();
      console.log('Accommodation found from Overpass:', data.elements?.length || 0);
      
      return data.elements?.map(hotel => {
        const name = hotel.tags?.name;
        if (!name) return null;
        const lat = hotel.lat || hotel.center?.lat;
        const lon = hotel.lon || hotel.center?.lon;
        if (!lat || !lon) return null;
        
        return {
          name: name,
          type: this.categorizeAccommodationType(hotel.tags?.tourism),
          coordinates: {
            latitude: lat,
            longitude: lon
          },
          distance: this.calculateDistance(latitude, longitude, lat, lon),
          rating: hotel.tags?.stars ? parseFloat(hotel.tags.stars) : null,
          amenities: this.extractOverpassAmenities(hotel.tags),
          priceRange: this.estimatePriceRange(hotel.tags?.tourism, hotel.tags?.stars),
          source: 'Overpass'
        };
      }).filter(h => h !== null) || [];
    } catch (error) {
      console.error('Error fetching Overpass accommodation:', error);
      return [];
    }
  },

  // Extract amenities from Overpass tags
  extractOverpassAmenities(tags) {
    if (!tags) return ['Standard Rooms'];
    
    const amenities = [];
    if (tags.internet_access === 'yes' || tags.wifi === 'yes') amenities.push('WiFi');
    if (tags.parking === 'yes') amenities.push('Parking');
    if (tags.swimming_pool === 'yes') amenities.push('Pool');
    if (tags.restaurant === 'yes') amenities.push('Restaurant');
    if (tags.breakfast === 'yes') amenities.push('Breakfast');
    
    return amenities.length > 0 ? amenities : ['Standard Rooms'];
  },

  // Categorize Geoapify accommodation type
  categorizeGeoapifyAccommodation(categories) {
    if (!categories || !Array.isArray(categories)) return 'Hotel';
    
    const categoriesStr = categories.join(' ').toLowerCase();
    
    if (categoriesStr.includes('resort')) return 'Resort';
    if (categoriesStr.includes('hostel')) return 'Hostel';
    if (categoriesStr.includes('guest_house') || categoriesStr.includes('guesthouse')) return 'Guest House';
    if (categoriesStr.includes('apartment') || categoriesStr.includes('aparthotel')) return 'Apartment';
    if (categoriesStr.includes('villa')) return 'Villa';
    if (categoriesStr.includes('motel')) return 'Motel';
    if (categoriesStr.includes('bed_and_breakfast')) return 'B&B';
    if (categoriesStr.includes('camping')) return 'Camping';
    
    return 'Hotel';
  },

  // Extract amenities from Geoapify properties
  extractGeoapifyAmenities(properties) {
    const amenities = [];
    
    if (properties.wifi) amenities.push('WiFi');
    if (properties.internet_access) amenities.push('Internet');
    if (properties.parking) amenities.push('Parking');
    if (properties.wheelchair) amenities.push('Wheelchair Accessible');
    if (properties.air_conditioning) amenities.push('Air Conditioning');
    
    // Default amenities
    if (amenities.length === 0) {
      amenities.push('Standard Rooms', 'Reception');
    }
    
    return amenities;
  },

  // Get air quality from WAQI API
  async getAirQuality(latitude, longitude) {
    try {
      if (!API_CONFIG.WAQI_API.apiKey) {
        console.log('WAQI API key not configured');
        return null;
      }

      const response = await fetch(
        `${API_CONFIG.WAQI_API.baseUrl}/geo:${latitude};${longitude}/?token=${API_CONFIG.WAQI_API.apiKey}`
      );
      
      if (!response.ok) {
        throw new Error(`WAQI API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.status !== 'ok') {
        console.log('WAQI API returned non-ok status:', data.status);
        return null;
      }
      
      const aqi = data.data.aqi;
      const aqiLevel = this.getAQILevel(aqi);
      
      return {
        aqi: aqi,
        level: aqiLevel.level,
        color: aqiLevel.color,
        description: aqiLevel.description,
        station: data.data.city?.name || 'Nearby Station',
        dominantPollutant: data.data.dominentpol || 'pm25',
        lastUpdated: data.data.time?.s || new Date().toISOString(),
        forecast: data.data.forecast?.daily || null
      };
    } catch (error) {
      console.error('Error fetching air quality:', error);
      return null;
    }
  },

  // Get AQI level description
  getAQILevel(aqi) {
    if (aqi <= 50) return { level: 'Good', color: '#00E400', description: 'Air quality is satisfactory' };
    if (aqi <= 100) return { level: 'Moderate', color: '#FFFF00', description: 'Acceptable air quality' };
    if (aqi <= 150) return { level: 'Unhealthy for Sensitive', color: '#FF7E00', description: 'Sensitive groups may experience effects' };
    if (aqi <= 200) return { level: 'Unhealthy', color: '#FF0000', description: 'Everyone may experience health effects' };
    if (aqi <= 300) return { level: 'Very Unhealthy', color: '#8F3F97', description: 'Health alert for everyone' };
    return { level: 'Hazardous', color: '#7E0023', description: 'Emergency conditions' };
  },

  // Cache helper functions
  async getCachedData(key) {
    try {
      const cached = await AsyncStorage.getItem(`cache_${key}`);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
          return data;
        }
      }
      return null;
    } catch (error) {
      console.error('Cache read error:', error);
      return null;
    }
  },

  async setCachedData(key, data) {
    try {
      await AsyncStorage.setItem(`cache_${key}`, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.error('Cache write error:', error);
    }
  },

  async clearCache() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => key.startsWith('cache_'));
      await AsyncStorage.multiRemove(cacheKeys);
    } catch (error) {
      console.error('Cache clear error:', error);
    }
  },
};
