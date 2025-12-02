import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES } from '../constants/colors';
import { useAppTheme } from '../hooks/useAppTheme';
import { createPlacesDetailStyles } from '../styles/PlacesDetailStyles';

const PlacesDetailScreen = ({ route, navigation }) => {
  const { location } = route.params;
  const { colors, isDarkMode } = useAppTheme();
  const places = location.placesToVisit || [];

  // Create dynamic styles based on current theme
  const styles = createPlacesDetailStyles(colors, isDarkMode);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const formatDistance = (distance) => {
    if (!distance) return '';
    return distance > 1000 ? `${(distance / 1000).toFixed(1)}km` : `${Math.round(distance)}m`;
  };

  const getPlaceTypeIcon = (type) => {
    if (!type) return 'location';
    if (type.includes('museum')) return 'library';
    if (type.includes('park')) return 'leaf';
    if (type.includes('monument')) return 'trophy';
    if (type.includes('temple') || type.includes('church')) return 'flower';
    if (type.includes('beach')) return 'water';
    if (type.includes('market')) return 'storefront';
    return 'camera';
  };
  const formatPlaceType = (type) => {
    if (!type) return 'Attraction';
    return type.split(',').map(t => 
      t.trim().replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    ).slice(0, 2).join(', ');
  };

  const renderPlaceItem = ({ item: place, index }) => (
    <View style={styles.itemCard}>
      <View style={styles.itemHeader}>
        <View style={[styles.placeIconContainer, { backgroundColor: '#FF6B6B20' }]}>
          <Ionicons 
            name={getPlaceTypeIcon(place.type)} 
            size={SIZES.iconMedium} 
            color="#FF6B6B" 
          />
        </View>
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{place.name}</Text>
          <Text style={styles.itemDescription}>{formatPlaceType(place.type)}</Text>
        </View>
        {place.distance && (
          <View style={styles.distanceContainer}>
            <Ionicons name="location" size={SIZES.iconSmall} color={colors.primary} />
            <Text style={styles.distanceText}>{formatDistance(place.distance)}</Text>
          </View>
        )}
      </View>

      <View style={styles.itemDetails}>
        {place.rating > 0 && (
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={SIZES.iconSmall} color="#FFD700" />
            <Text style={styles.ratingText}>Rating: {place.rating}/10</Text>
          </View>
        )}
        
        <View style={styles.coordinatesContainer}>
          <Ionicons name="navigate" size={SIZES.iconSmall} color={colors.textSecondary} />          <Text style={styles.coordinatesText} numberOfLines={1} ellipsizeMode="tail">
            {place.coordinates?.latitude?.toFixed(3) || '0.000'}, {place.coordinates?.longitude?.toFixed(3) || '0.000'}
          </Text>
        </View>
      </View>
    </View>
  );

  return (    <SafeAreaView style={styles.container}>
      {/* Header */}
      <LinearGradient        colors={[colors.primary, colors.primaryDark]}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.textWhite} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Places to Visit</Text>
        <View style={styles.headerRight}>
          <Ionicons name="camera" size={24} color={colors.textWhite} />
        </View>      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats Section */}
        <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{places.length}</Text>
          <Text style={styles.statLabel}>Places Found</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {places.filter(place => place.rating && place.rating >= 4).length}
          </Text>
          <Text style={styles.statLabel}>Top Rated</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {places.filter(place => place.type?.toLowerCase().includes('museum')).length}
          </Text>          <Text style={styles.statLabel}>Museums</Text>
        </View>
        </View>

        {places.length > 0 ? (
          <>            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Places to Visit</Text>
              <Text style={styles.sectionSubtitle}>Tourist attractions and points of interest in {location.name}</Text>
            </View>
            
            <FlatList
              data={places}
              renderItem={renderPlaceItem}
              keyExtractor={(item, index) => `place-${index}`}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          </>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="camera-outline" size={60} color={colors.textSecondary} />
            <Text style={styles.emptyTitle}>No Places Found</Text>
            <Text style={styles.emptyDescription}>
              We couldn't find any tourist attractions for {location.name}. This might be a remote area or the data might be loading.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};



export default PlacesDetailScreen;
