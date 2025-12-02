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
import { createAccommodationDetailStyles } from '../styles/AccommodationDetailStyles';

const AccommodationDetailScreen = ({ navigation, route }) => {
  const { accommodation = [], location } = route.params || {};
  const { colors, isDarkMode } = useAppTheme();

  // Create dynamic styles based on current theme
  const styles = createAccommodationDetailStyles(colors, isDarkMode);

  const renderAccommodationItem = ({ item, index }) => (
    <View style={styles.accommodationCard}>
      <View style={styles.accommodationHeader}>
        <View style={styles.accommodationInfo}>
          <Text style={styles.accommodationName}>{item.name}</Text>
          <View style={styles.typeContainer}>
            <Text style={styles.accommodationType}>{item.type || 'Hotel'}</Text>
          </View>
        </View>
        <View style={styles.accommodationMeta}>
          {item.rating && (
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color={colors.warning} />
              <Text style={styles.rating}>{item.rating}</Text>
            </View>
          )}
          <Ionicons name="bed-outline" size={20} color={colors.primary} />
        </View>
      </View>
      
      {item.address && (
        <View style={styles.addressContainer}>
          <Ionicons name="location-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.address}>{item.address}</Text>
        </View>
      )}
      
      {item.amenities && item.amenities.length > 0 && (
        <View style={styles.amenitiesContainer}>
          {item.amenities.slice(0, 3).map((amenity, amenityIndex) => (
            <View key={amenityIndex} style={styles.amenityTag}>
              <Text style={styles.amenityText}>{amenity}</Text>
            </View>
          ))}
        </View>
      )}
      
      {item.distance && (
        <View style={styles.distanceContainer}>
          <Ionicons name="walk-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.distance}>{Math.round(item.distance)}m away</Text>
        </View>
      )}
      
      {item.priceRange && (
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Price Range:</Text>
          <Text style={styles.priceRange}>{item.priceRange}</Text>
        </View>
      )}
      
      <Text style={styles.source}>Source: {item.source}</Text>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <Ionicons name="bed-outline" size={64} color={colors.textSecondary} />
      <Text style={styles.emptyStateTitle}>No Accommodation Found</Text>
      <Text style={styles.emptyStateText}>
        We couldn't find any hotels or accommodation options in this area. 
        Try searching for nearby cities or check back later.
      </Text>
      <TouchableOpacity 
        style={styles.searchButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.searchButtonText}>Search Other Locations</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.textWhite} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Accommodation</Text>
        <View style={styles.headerRight}>
          <Ionicons name="bed" size={24} color={colors.textWhite} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{accommodation.length}</Text>
            <Text style={styles.statLabel}>Hotels Found</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {accommodation.filter(item => item.rating && item.rating >= 4).length}
            </Text>
            <Text style={styles.statLabel}>Highly Rated</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {accommodation.filter(item => item.type?.toLowerCase().includes('luxury')).length}
            </Text>
            <Text style={styles.statLabel}>Luxury Options</Text>
          </View>
        </View>

        {accommodation.length > 0 ? (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Available Accommodation</Text>
              <Text style={styles.sectionSubtitle}>Hotels, resorts, and lodging options</Text>
            </View>
            
            <FlatList
              data={accommodation}
              renderItem={renderAccommodationItem}
              keyExtractor={(item, index) => `accommodation-${index}`}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          </>
        ) : (
          renderEmptyState()
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AccommodationDetailScreen;
