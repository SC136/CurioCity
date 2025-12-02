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
import { createHolyPlacesDetailStyles } from '../styles/HolyPlacesDetailStyles';

const HolyPlacesDetailScreen = ({ route, navigation }) => {
  const { location } = route.params;
  const holyPlaces = location.holyPlaces || [];
  const { colors, isDarkMode } = useAppTheme();

  // Create dynamic styles based on current theme
  const styles = createHolyPlacesDetailStyles(colors, isDarkMode);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const getReligionIcon = (religion) => {
    if (!religion) return 'flower';
    const rel = religion.toLowerCase();
    if (rel.includes('christian') || rel.includes('catholic')) return 'cross';
    if (rel.includes('islam') || rel.includes('muslim')) return 'moon';
    if (rel.includes('hindu')) return 'flame';
    if (rel.includes('buddhist')) return 'leaf';
    if (rel.includes('jewish')) return 'star';
    return 'flower';
  };

  const formatReligion = (religion) => {
    if (!religion) return 'Place of Worship';
    return religion.charAt(0).toUpperCase() + religion.slice(1);
  };

  const formatType = (type) => {
    if (!type) return '';
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const renderHolyPlaceItem = ({ item: place, index }) => (
    <View style={styles.itemCard}>
      <View style={styles.itemHeader}>
        <View style={[styles.religionIconContainer, { backgroundColor: '#96CEB420' }]}>
          <Ionicons 
            name={getReligionIcon(place.religion)} 
            size={SIZES.iconMedium} 
            color="#96CEB4" 
          />
        </View>
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{place.name}</Text>
          <Text style={styles.itemDescription}>{formatReligion(place.religion)}</Text>
          {place.type && (
            <Text style={styles.placeType}>{formatType(place.type)}</Text>
          )}
        </View>
      </View>

      <View style={styles.itemDetails}>
        {place.address && (
          <View style={styles.addressContainer}>
            <Ionicons name="location" size={SIZES.iconSmall} color={colors.textSecondary} />
            <Text style={styles.addressText} numberOfLines={2} ellipsizeMode="tail">{place.address}</Text>
          </View>
        )}

        <View style={styles.coordinatesContainer}>
          <Ionicons name="navigate" size={SIZES.iconSmall} color={colors.textSecondary} />
          <Text style={styles.coordinatesText} numberOfLines={1} ellipsizeMode="tail">
            {place.coordinates?.latitude?.toFixed(3) || '0.000'}, {place.coordinates?.longitude?.toFixed(3) || '0.000'}
          </Text>
        </View>
      </View>
    </View>
  );

  return (    <SafeAreaView style={styles.container}>
      {/* Header */}
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
        <Text style={styles.headerTitle}>Holy Places</Text>
        <View style={styles.headerRight}>
          <Ionicons name="flower" size={24} color={colors.textWhite} />
        </View>      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{holyPlaces.length}</Text>
            <Text style={styles.statLabel}>Sacred Sites</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {holyPlaces.filter(place => place.religion).length}
            </Text>
            <Text style={styles.statLabel}>Different Faiths</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {holyPlaces.filter(place => place.type).length}
            </Text>
            <Text style={styles.statLabel}>Place Types</Text>
          </View>
        </View>

        {holyPlaces.length > 0 ? (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Sacred Places</Text>
              <Text style={styles.sectionSubtitle}>Places of worship and spiritual significance in {location.name}</Text>
            </View>
            
            <FlatList
              data={holyPlaces}
              renderItem={renderHolyPlaceItem}
              keyExtractor={(item, index) => `holy-place-${index}`}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          </>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="flower-outline" size={60} color={colors.textSecondary} />
            <Text style={styles.emptyTitle}>No Holy Places Found</Text>
            <Text style={styles.emptyDescription}>
              We couldn't find any places of worship for {location.name}. This might be a remote area or the data might be loading.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HolyPlacesDetailScreen;
