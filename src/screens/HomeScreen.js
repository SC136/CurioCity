import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES } from '../constants/colors';
import { useAppTheme } from '../hooks/useAppTheme';
import { LocationService } from '../services/LocationService';
import LocationSearchModal from '../components/LocationSearchModal';
import { createHomeScreenStyles } from '../styles/HomeScreenStyles';

const HomeScreen = ({ navigation }) => {
  const { colors, isDarkMode, toggleTheme } = useAppTheme();
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSearchModal, setShowSearchModal] = useState(false);

  // Create dynamic styles based on current theme
  const styles = createHomeScreenStyles(colors, isDarkMode);

  useEffect(() => {
    initializeLocation();
  }, []);  const initializeLocation = async () => {
    setIsLoading(true);
    try {
      // Try to get current location (gracefully handles permission denial)
      const coords = await LocationService.getCurrentLocation();
      const locationDetails = await LocationService.getLocationDetails(
        coords.latitude,
        coords.longitude
      );
      
      if (locationDetails) {      setCurrentLocation(locationDetails);
      } else {
        // Fallback to default location (New York) if location details failed
        const defaultLocation = await LocationService.getDefaultLocationWithWikipedia();
        setCurrentLocation(defaultLocation);
      }
    } catch (error) {
      console.log('Location not available (permission denied or GPS off), using default location');
      // Use default location (New York) with Wikipedia data if location unavailable
      try {
        const defaultLocation = await LocationService.getDefaultLocationWithWikipedia();
        setCurrentLocation(defaultLocation);
      } catch (fallbackError) {
        console.error('Error loading default location:', fallbackError);
        // Last resort - basic New York data
        setCurrentLocation({
          name: 'New York',
          region: 'New York',
          country: 'United States',
          formattedAddress: 'New York, NY, USA',
          coordinates: { latitude: 40.7128, longitude: -74.0060 },
          description: 'Welcome to New York, the city that never sleeps!'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };const getFirstSentence = (text) => {
    if (!text) return '';
    // Split by period, exclamation, or question mark and take the first sentence
    const sentences = text.split(/[.!?]+/);
    return sentences[0] + (sentences[0] ? '.' : '');
  };

  const handleLocationSelect = (location) => {
    setCurrentLocation(location);
  };  const handleReadMore = () => {
    if (currentLocation) {
      navigation.navigate('LocationDetail', { location: currentLocation });
    }
  };

  const handleReadHistory = () => {
    if (currentLocation) {
      navigation.navigate('HistoryDetail', { location: currentLocation });
    }
  };const renderContentSection = (title, icon, data, dataType, color = COLORS.primary) => {
    const hasData = data && data.length > 0;
    const isLoading = !currentLocation?.hasRealData;
    
    const handleSectionPress = () => {
      if (!currentLocation) return;
        switch (dataType) {
        case 'news':
          navigation.navigate('NewsDetail', { location: currentLocation });
          break;
        case 'restaurants':
          navigation.navigate('RestaurantsDetail', { location: currentLocation });
          break;
        case 'places':
          navigation.navigate('PlacesDetail', { location: currentLocation });
          break;
        case 'holy':
          navigation.navigate('HolyPlacesDetail', { location: currentLocation });
          break;
        case 'accommodation':
          navigation.navigate('AccommodationDetail', { 
            location: currentLocation,
            accommodation: currentLocation?.accommodation || []
          });
          break;
        case 'services':
          navigation.navigate('ServicesDetail', { location: currentLocation });
          break;
        default:
          navigation.navigate('LocationDetail', { location: currentLocation });
      }
    };
    
    return (
      <View style={styles.contentSection}>
        <View style={styles.sectionHeader}>
          <View style={[styles.sectionIcon, { backgroundColor: color + '20' }]}>
            <Ionicons name={icon} size={SIZES.iconMedium} color={color} />
          </View>
          <Text style={styles.sectionTitle}>{title}</Text>
          {hasData && (
            <Text style={styles.dataCount}>{data.length} items</Text>
          )}
        </View>
        
        <View style={styles.contentCard}>
          {isLoading ? (
            <View style={styles.loadingSection}>
              <ActivityIndicator size="small" color={color} />
              <Text style={styles.loadingText}>Loading {title.toLowerCase()}...</Text>
            </View>
          ) : hasData ? (
            <View style={styles.dataSection}>
              {data.slice(0, 3).map((item, index) => (
                <View key={index} style={styles.dataItem}>
                  <Text style={styles.dataItemTitle} numberOfLines={1}>
                    {item.name || item.title || 'Unknown'}
                  </Text>
                  <Text style={styles.dataItemSubtitle} numberOfLines={1}>
                    {getItemSubtitle(item, dataType)}
                  </Text>
                </View>
              ))}
              {data.length > 3 && (
                <TouchableOpacity style={styles.viewAllButton} onPress={handleSectionPress}>
                  <Text style={styles.viewAllText}>View all {data.length} items</Text>
                  <Ionicons name="chevron-forward" size={SIZES.iconSmall} color={color} />
                </TouchableOpacity>
              )}
              {data.length <= 3 && data.length > 0 && (
                <TouchableOpacity style={styles.viewAllButton} onPress={handleSectionPress}>
                  <Text style={styles.viewAllText}>View details</Text>
                  <Ionicons name="chevron-forward" size={SIZES.iconSmall} color={color} />
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <View style={styles.noDataSection}>
              <Text style={styles.noDataText}>No {title.toLowerCase()} available</Text>
            </View>
          )}
        </View>
      </View>
    );
  };  const formatText = (text) => {
    if (!text) return '';
    return text
      .replace(/_/g, ' ')           // Replace underscores with spaces
      .replace(/\b\w/g, l => l.toUpperCase()); // Capitalize first letter of each word
  };

  const formatServiceType = (type) => {
    if (!type) return 'Service';
    return type.split(',').map(t => 
      t.trim().replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    ).slice(0, 2).join(', ');
  };

  const getItemSubtitle = (item, dataType) => {
    switch (dataType) {
      case 'news':
        return item.source || 'News source';
      case 'restaurants':
        return item.categories?.join(', ') || item.address || 'Restaurant';
      case 'places':
        return `${item.distance ? Math.round(item.distance) + 'm away' : 'Tourist spot'}`;
      case 'holy':
        return formatText(item.religion) || formatText(item.type) || 'Place of worship';
      case 'accommodation':
        return `${formatText(item.type) || 'Hotel'} • ${item.priceRange || 'Standard rates'}`;
      case 'services':
        return formatServiceType(item.type) || 'Service';
      default:
        return item.description || '';
    }
  };

  if (isLoading) {
    return (      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Getting your location...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Welcome Header */}        <LinearGradient
          colors={[colors.gradientStart, colors.gradientEnd]}
          style={styles.welcomeSection}
        >
          <View style={styles.welcomeContent}>            <View style={styles.welcomeHeader}>
              <View style={styles.welcomeTextContainer}>
                <Text style={styles.welcomeText}>
                  Welcome to {currentLocation?.name || 'Your Location'}!
                </Text>
              </View>
              <View style={styles.headerButtons}>
                <TouchableOpacity
                  style={styles.themeButton}
                  onPress={toggleTheme}
                >
                  <Ionicons 
                    name={isDarkMode ? "sunny" : "moon"} 
                    size={SIZES.iconMedium} 
                    color={colors.textWhite} 
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.locationButton}
                  onPress={() => setShowSearchModal(true)}
                >
                  <Ionicons name="location" size={SIZES.iconLarge} color={colors.textWhite} />
                </TouchableOpacity>
              </View>
            </View>
              <Text style={styles.locationDescription}>
              {getFirstSentence(currentLocation?.description) || 'Discover amazing places around you'}
            </Text>            <TouchableOpacity style={styles.readMoreButton} onPress={handleReadMore}>
              <Text style={styles.readMoreText}>Read More</Text>
              <Ionicons name="arrow-forward" size={SIZES.iconSmall} color={colors.textWhite} />
            </TouchableOpacity>
          </View>
        </LinearGradient>        {/* Content Sections */}
        <View style={styles.contentContainer}>
          <Text style={styles.sectionHeading}>Discover {currentLocation?.name || 'This Location'}</Text>
          
          {currentLocation?.history && (
            <View style={styles.historySection}>
              <View style={styles.sectionHeader}>              <View style={[styles.sectionIcon, { backgroundColor: colors.primary + '20' }]}>
                <Ionicons name="library" size={SIZES.iconMedium} color={colors.primary} />
              </View>
                <Text style={styles.sectionTitle}>History & Culture</Text>
              </View>
              <View style={styles.contentCard}>
                <Text style={styles.historyText} numberOfLines={3}>
                  {currentLocation.history}
                </Text>                <TouchableOpacity style={styles.readHistoryButton} onPress={handleReadHistory}>
                  <Text style={styles.readHistoryText}>Read full history</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          
          {renderContentSection(
            'Places to Visit', 
            'camera', 
            currentLocation?.placesToVisit || [],
            'places',
            '#FF6B6B'
          )}
            {renderContentSection(
            'Local Restaurants', 
            'restaurant', 
            currentLocation?.restaurants || [],
            'restaurants',
            '#4ECDC4'
          )}
          
          {renderContentSection(
            'Holy Places', 
            'flower', 
            currentLocation?.holyPlaces || [],
            'holy',
            '#96CEB4'
          )}
          
          {renderContentSection(
            'Accommodation', 
            'bed', 
            currentLocation?.accommodation || [],
            'accommodation',
            '#DDA0DD'
          )}
          
          {renderContentSection(
            'Services & Amenities', 
            'business', 
            currentLocation?.services || [],
            'services',
            '#45B7D1'
          )}
          
          {renderContentSection(
            'Latest News', 
            'newspaper', 
            currentLocation?.news || [],
            'news',
            '#FFEAA7'
          )}
        </View>
      </ScrollView>

      {/* Location Search Modal */}
      <LocationSearchModal
        visible={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        onLocationSelect={handleLocationSelect}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;
