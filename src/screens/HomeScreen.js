import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  RefreshControl,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '../hooks/useAppTheme';
import { LocationService } from '../services/LocationService';
import LocationSearchModal from '../components/LocationSearchModal';
import { spacing } from '../utils/responsiveDesign';
import { throttle } from '../utils/performance';

// Import new components
import Header from '../components/home/Header';
import CityInfoCard from '../components/home/CityInfoCard';
import CategoryFilter from '../components/home/CategoryFilter';
import PlacesToVisit from '../components/home/PlacesToVisit';
import LocalRestaurants from '../components/home/LocalRestaurants';
import NearbyAccommodation from '../components/home/NearbyAccommodation';
import HolyPlaces from '../components/home/HolyPlaces';
import ServicesList from '../components/home/ServicesList';
import LatestNews from '../components/home/LatestNews';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const { colors } = useAppTheme();
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [error, setError] = useState(null);

  // API Data States
  const [placesToVisit, setPlacesToVisit] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [accommodation, setAccommodation] = useState([]);
  const [holyPlaces, setHolyPlaces] = useState([]);
  const [services, setServices] = useState([]);
  const [news, setNews] = useState([]);
  const [airQuality, setAirQuality] = useState(null);

  // Loading states for individual sections
  const [loadingStates, setLoadingStates] = useState({
    places: true,
    restaurants: true,
    accommodation: true,
    holyPlaces: true,
    services: true,
    news: true,
  });

  // Helper to sort by rating (highest first) and center the best item
  const sortByRating = (data) => {
    if (!data || data.length === 0) return [];
    const sorted = [...data].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    if (sorted.length >= 3) {
      const middle = Math.floor(sorted.length / 2);
      const highestRated = sorted.shift();
      sorted.splice(middle, 0, highestRated);
    }
    return sorted;
  };

  useEffect(() => {
    initializeLocation();
  }, []);

  // Fetch all data when location changes
  useEffect(() => {
    if (currentLocation?.coordinates) {
      fetchAllData();
    }
  }, [currentLocation?.coordinates?.latitude, currentLocation?.coordinates?.longitude]);

  const fetchAllData = async () => {
    if (!currentLocation?.coordinates) {
      console.log('No coordinates available, returning');
      return;
    }

    const { latitude, longitude } = currentLocation.coordinates;
    const locationName = currentLocation.name || 'Local Area';

    setLoadingStates({
      places: true,
      restaurants: true,
      accommodation: true,
      holyPlaces: true,
      services: true,
      news: true,
    });

    // Fetch all data in parallel
    try {
      const [
        placesResult,
        restaurantsResult,
        accommodationResult,
        holyPlacesResult,
        servicesResult,
        newsResult,
        airQualityResult,
      ] = await Promise.allSettled([
        LocationService.getPlacesToVisit(latitude, longitude),
        LocationService.getLocalRestaurants(locationName, latitude, longitude),
        LocationService.getAccommodationFromGeoapify(latitude, longitude).catch(err => {
          return LocationService.getAccommodation(latitude, longitude);
        }),
        LocationService.getHolyPlaces(latitude, longitude),
        LocationService.getLocalServices(latitude, longitude),
        LocationService.getLocalNews(locationName),
        LocationService.getAirQuality ? LocationService.getAirQuality(latitude, longitude) : Promise.resolve(null),
      ]);

      // Update data states
      if (placesResult.status === 'fulfilled') {
        setPlacesToVisit(sortByRating(placesResult.value || []));
      }
      setLoadingStates(prev => ({ ...prev, places: false }));

      if (restaurantsResult.status === 'fulfilled') {
        setRestaurants(sortByRating(restaurantsResult.value || []));
      }
      setLoadingStates(prev => ({ ...prev, restaurants: false }));

      if (accommodationResult.status === 'fulfilled') {
        const accommodationData = accommodationResult.value || [];
        const sortedAccommodation = sortByRating(accommodationData);
        setAccommodation(sortedAccommodation);
      } else {
        console.error('Accommodation fetch failed:', accommodationResult.reason);
        setAccommodation([]);
      }
      setLoadingStates(prev => ({ ...prev, accommodation: false }));

      console.log('Holy places result:', holyPlacesResult.status, holyPlacesResult.status === 'fulfilled' ? holyPlacesResult.value?.length : holyPlacesResult.reason);
      if (holyPlacesResult.status === 'fulfilled') {
        setHolyPlaces(holyPlacesResult.value || []);
      }
      setLoadingStates(prev => ({ ...prev, holyPlaces: false }));

      console.log('Services result:', servicesResult.status, servicesResult.status === 'fulfilled' ? servicesResult.value?.length : servicesResult.reason);
      if (servicesResult.status === 'fulfilled') {
        setServices(servicesResult.value || []);
      }
      setLoadingStates(prev => ({ ...prev, services: false }));

      console.log('News result:', newsResult.status, newsResult.status === 'fulfilled' ? newsResult.value?.length : newsResult.reason);
      if (newsResult.status === 'fulfilled') {
        setNews(newsResult.value || []);
      }
      setLoadingStates(prev => ({ ...prev, news: false }));

      if (airQualityResult.status === 'fulfilled') {
        setAirQuality(airQualityResult.value);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load some data. Pull to refresh.');
    }
  };

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    setError(null);
    await fetchAllData();
    setIsRefreshing(false);
  }, [currentLocation]);

  const initializeLocation = async () => {
    setIsLoading(true);
    try {
      const coords = await LocationService.getCurrentLocation();
      const locationDetails = await LocationService.getLocationDetails(
        coords.latitude,
        coords.longitude
      );
      
      if (locationDetails) {
        setCurrentLocation(locationDetails);
      } else {
        const defaultLocation = await LocationService.getDefaultLocationWithWikipedia();
        setCurrentLocation(defaultLocation);
      }
    } catch (error) {
      console.log('Location not available, using default location');
      try {
        const defaultLocation = await LocationService.getDefaultLocationWithWikipedia();
        setCurrentLocation(defaultLocation);
      } catch (fallbackError) {
        console.error('Error loading default location:', fallbackError);
        setCurrentLocation({
          name: 'New York',
          region: 'New York',
          country: 'United States',
          formattedAddress: 'New York, NY, USA',
          coordinates: { latitude: 40.7128, longitude: -74.0060 },
          description: 'New York City is the most populous city in the United States, known for its iconic skyline, diverse culture, and world-famous landmarks.',
          history: 'New York City has a rich history spanning over 400 years, from its origins as a Dutch trading post to becoming one of the world\'s most influential cities.',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationSelect = (location) => {
    setCurrentLocation(location);
    // Data will be fetched automatically via useEffect
  };

  const navigateTo = (screen, params = {}) => {
    navigation.navigate(screen, { location: currentLocation, ...params });
  };

  const handleCategorySelect = (category) => {
    switch(category) {
        case 'Hotels':
            navigateTo('AccommodationDetail');
            break;
        case 'Restaurants':
            navigateTo('RestaurantsDetail');
            break;
        case 'Services':
            navigateTo('ServicesDetail');
            break;
        case 'News':
            navigateTo('NewsDetail');
            break;
        case 'Holy Places':
            navigateTo('HolyPlacesDetail');
            break;
        default:
            break;
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={colors.primary} />
          <Text className="mt-4 text-base" style={{ color: colors.textSecondary }}>
            Getting your location...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <SafeAreaView style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Header 
          cityName={currentLocation?.name || 'Select City'}
          airQuality={airQuality}
        />

        <ScrollView 
          showsVerticalScrollIndicator={true} 
          style={{ flex: 1, minHeight: 0 }}
          contentContainerStyle={{ paddingBottom: 60, flexGrow: 1 }}
          bounces={true}
          scrollEnabled={true}
          refreshControl={Platform.OS !== 'web' ? (
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          ) : null}
        >
          <CityInfoCard 
              description={currentLocation?.description}
              onReadMore={() => navigateTo('LocationDetail')}
              onSearch={() => setShowSearchModal(true)}
        />

        <CategoryFilter onCategorySelect={handleCategorySelect} />

        {error && (
          <View className="mx-4 mb-4 p-3 rounded-lg" style={{ backgroundColor: colors.error + '20' }}>
            <Text style={{ color: colors.error }} className="text-center">
              {error}
            </Text>
            <TouchableOpacity onPress={onRefresh} className="mt-2">
              <Text style={{ color: colors.primary }} className="text-center font-semibold">
                Tap to retry
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <PlacesToVisit 
            data={placesToVisit} 
            loading={loadingStates.places}
            onItemPress={(item) => navigateTo('PlacesDetail', { item })}
        />

        <LocalRestaurants 
            data={restaurants} 
            loading={loadingStates.restaurants}
            onItemPress={(item) => navigateTo('RestaurantsDetail', { item })}
        />

        <NearbyAccommodation 
            data={accommodation} 
            loading={loadingStates.accommodation}
            onItemPress={(item) => navigateTo('AccommodationDetail', { item })}
            onViewMore={() => navigateTo('AccommodationDetail')}
        />

        <HolyPlaces 
            data={holyPlaces} 
            loading={loadingStates.holyPlaces}
            onItemPress={(item) => navigateTo('HolyPlacesDetail', { item })}
        />

        <ServicesList 
            data={services} 
            loading={loadingStates.services}
            onItemPress={(item) => navigateTo('ServicesDetail', { item })}
        />

        <LatestNews 
            data={news} 
            loading={loadingStates.news}
            onItemPress={(item) => navigateTo('NewsDetail', { item })}
        />
        </ScrollView>

        <LocationSearchModal
          visible={showSearchModal}
          onClose={() => setShowSearchModal(false)}
          onLocationSelect={handleLocationSelect}
        />
      </SafeAreaView>
    </View>
  );
};

export default HomeScreen;
