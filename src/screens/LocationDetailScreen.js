import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Linking,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES } from '../constants/colors';
import { useAppTheme } from '../hooks/useAppTheme';
import { createLocationDetailStyles } from '../styles/LocationDetailStyles';

const LocationDetailScreen = ({ route, navigation }) => {
  const { location } = route.params;
  const { colors, isDarkMode } = useAppTheme();
  
  // Create dynamic styles based on current theme
  const styles = createLocationDetailStyles(colors, isDarkMode);
  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleWikipediaLink = async () => {
    if (location.wikipediaUrl) {
      try {
        const supported = await Linking.canOpenURL(location.wikipediaUrl);
        if (supported) {
          await Linking.openURL(location.wikipediaUrl);
        }
      } catch (error) {
        console.error('Error opening Wikipedia link:', error);
      }
    }
  };

  return (    <SafeAreaView style={styles.container}>
      {/* Header */}      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.textWhite} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {location.name}
        </Text>
        <View style={styles.headerRight}>
          <Ionicons name="information-circle" size={24} color={colors.textWhite} />
        </View></LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Location Image - Only show if available */}
        {location.thumbnail && (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: location.thumbnail }}
              style={styles.locationImage}
              resizeMode="cover"
            />
          </View>
        )}

        {/* Content Sections */}
        <View style={styles.contentContainer}>{/* About Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>About {location.name}</Text>
              {location.wikipediaUrl && (
                <TouchableOpacity 
                  style={styles.wikipediaButton}
                  onPress={handleWikipediaLink}
                >
                  <Ionicons name="open-outline" size={SIZES.iconSmall} color={COLORS.primary} />
                  <Text style={styles.wikipediaButtonText}>Wikipedia</Text>
                </TouchableOpacity>
              )}
            </View>            <Text style={styles.sectionContent}>
              {location.fullDescription || location.description}
            </Text>
          </View>

          {/* Quick Facts Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Facts</Text>
            <View style={styles.factsList}>
              <View style={styles.factItem}>
                <Ionicons name="flag" size={SIZES.iconMedium} color={COLORS.primary} />
                <View style={styles.factContent}>
                  <Text style={styles.factLabel}>Country</Text>
                  <Text style={styles.factValue}>{location.country}</Text>
                </View>
              </View>
              
              <View style={styles.factItem}>
                <Ionicons name="map" size={SIZES.iconMedium} color={COLORS.primary} />
                <View style={styles.factContent}>
                  <Text style={styles.factLabel}>Region</Text>
                  <Text style={styles.factValue}>{location.region}</Text>
                </View>
              </View>
              
              <View style={styles.factItem}>
                <Ionicons name="navigate" size={SIZES.iconMedium} color={COLORS.primary} />
                <View style={styles.factContent}>
                  <Text style={styles.factLabel}>Coordinates</Text>                  <Text style={styles.factValue} numberOfLines={1} ellipsizeMode="tail">
                    {location.coordinates.latitude.toFixed(3)}, {location.coordinates.longitude.toFixed(3)}
                  </Text>
                </View>
              </View>
              
              {location.hasRealData && (
                <View style={styles.factItem}>
                  <Ionicons name="time" size={SIZES.iconMedium} color={COLORS.primary} />
                  <View style={styles.factContent}>
                    <Text style={styles.factLabel}>Data Updated</Text>
                    <Text style={styles.factValue}>
                      {new Date(location.lastUpdated).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
              )}
            </View>          </View>
          
          {/* Real Data Summary */}
          {location.hasRealData && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Live Data Summary</Text>
              <View style={styles.summaryGrid}>
                {location.news && location.news.length > 0 && (
                  <View style={styles.summaryItem}>
                    <Ionicons name="newspaper" size={SIZES.iconMedium} color="#FFEAA7" />
                    <Text style={styles.summaryCount}>{location.news.length}</Text>
                    <Text style={styles.summaryLabel}>News Articles</Text>
                  </View>
                )}
                
                {location.restaurants && location.restaurants.length > 0 && (
                  <View style={styles.summaryItem}>
                    <Ionicons name="restaurant" size={SIZES.iconMedium} color="#4ECDC4" />
                    <Text style={styles.summaryCount}>{location.restaurants.length}</Text>
                    <Text style={styles.summaryLabel}>Restaurants</Text>
                  </View>
                )}
                
                {location.placesToVisit && location.placesToVisit.length > 0 && (
                  <View style={styles.summaryItem}>
                    <Ionicons name="camera" size={SIZES.iconMedium} color="#FF6B6B" />
                    <Text style={styles.summaryCount}>{location.placesToVisit.length}</Text>
                    <Text style={styles.summaryLabel}>Places to Visit</Text>
                  </View>
                )}
                
                {location.holyPlaces && location.holyPlaces.length > 0 && (
                  <View style={styles.summaryItem}>
                    <Ionicons name="flower" size={SIZES.iconMedium} color="#96CEB4" />
                    <Text style={styles.summaryCount}>{location.holyPlaces.length}</Text>
                    <Text style={styles.summaryLabel}>Holy Places</Text>
                  </View>
                )}
                  {location.services && location.services.length > 0 && (
                  <View style={styles.summaryItem}>
                    <Ionicons name="business" size={SIZES.iconMedium} color="#45B7D1" />
                    <Text style={styles.summaryCount}>{location.services.length}</Text>
                    <Text style={styles.summaryLabel}>Services</Text>
                  </View>
                )}              </View>
                <View style={styles.dataSourceNote}>
                <Ionicons name="information-circle" size={SIZES.iconSmall} color={colors.primary} />
                <Text style={styles.dataSourceText}>
                  Data powered by multiple live APIs including NewsData.io, OpenTripMap, Foursquare, and more
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LocationDetailScreen;
