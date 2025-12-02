import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES } from '../constants/colors';
import { useAppTheme } from '../hooks/useAppTheme';
import { createHistoryDetailStyles } from '../styles/HistoryDetailStyles';

const HistoryDetailScreen = ({ route, navigation }) => {
  const { location } = route.params;
  const { colors, isDarkMode } = useAppTheme();
  const styles = createHistoryDetailStyles(colors, isDarkMode);

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
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
        <Text style={styles.headerTitle}>History & Culture</Text>
        <View style={styles.headerRight}>
          <Ionicons name="library" size={24} color={colors.textWhite} />
        </View>      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {location.history ? Math.floor(location.history.length / 100) : 0}
            </Text>
            <Text style={styles.statLabel}>History Facts</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {location.establishedYear || 'Ancient'}
            </Text>
            <Text style={styles.statLabel}>Founded</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {location.culturalSites || 5}
            </Text>
            <Text style={styles.statLabel}>Heritage Sites</Text>
          </View>
        </View>

        {/* Main History Content */}
        <View style={styles.historySection}>
          <View style={styles.sectionHeader}>
            <Ionicons name="time" size={SIZES.iconMedium} color={colors.primary} />
            <Text style={styles.sectionTitle}>Historical Overview</Text>
          </View>
          
          <View style={styles.contentCard}>
            {location.history ? (
              <Text style={styles.historyText}>{location.history}</Text>
            ) : (
              <Text style={styles.noHistoryText}>
                Historical information for {location.name} is being gathered. 
                This location has a rich heritage that spans many centuries, 
                with unique cultural significance and historical importance.
              </Text>
            )}
          </View>
        </View>

        {/* Cultural Significance */}
        <View style={styles.historySection}>
          <View style={styles.sectionHeader}>
            <Ionicons name="color-palette" size={SIZES.iconMedium} color={colors.accent} />
            <Text style={styles.sectionTitle}>Cultural Significance</Text>
          </View>
          
          <View style={styles.contentCard}>
            <Text style={styles.cultureText}>
              {location.name} holds deep cultural significance in the region of {location.region}, {location.country}. 
              The area has been shaped by various influences throughout history, creating a unique blend of traditions, 
              architecture, and local customs that continue to thrive today.
            </Text>
          </View>
        </View>

        {/* Key Facts */}
        <View style={styles.historySection}>
          <View style={styles.sectionHeader}>
            <Ionicons name="information-circle" size={SIZES.iconMedium} color="#45B7D1" />
            <Text style={styles.sectionTitle}>Key Historical Facts</Text>
          </View>
          
          <View style={styles.factsContainer}>
            <View style={styles.factItem}>
              <View style={styles.factIcon}>
                <Ionicons name="location" size={SIZES.iconSmall} color="#45B7D1" />
              </View>              <View style={styles.factContent}>
                <Text style={styles.factTitle}>Location</Text>                <Text style={styles.factDescription} numberOfLines={2} ellipsizeMode="tail">
                  {location.coordinates?.latitude && location.coordinates?.longitude 
                    ? `Situated at ${location.coordinates.latitude.toFixed(3)}°, ${location.coordinates.longitude.toFixed(3)}°`
                    : `Located in ${location.region || 'the region'}, ${location.country || 'the area'}`
                  }
                </Text>
              </View>
            </View>

            <View style={styles.factItem}>
              <View style={styles.factIcon}>
                <Ionicons name="flag" size={SIZES.iconSmall} color="#45B7D1" />
              </View>
              <View style={styles.factContent}>
                <Text style={styles.factTitle}>Region</Text>
                <Text style={styles.factDescription}>
                  Part of {location.region}, {location.country}
                </Text>
              </View>
            </View>

            <View style={styles.factItem}>
              <View style={styles.factIcon}>
                <Ionicons name="globe" size={SIZES.iconSmall} color="#45B7D1" />
              </View>
              <View style={styles.factContent}>
                <Text style={styles.factTitle}>Cultural Heritage</Text>
                <Text style={styles.factDescription}>
                  Rich blend of local traditions and historical influences
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Data Sources */}
        {location.hasRealData && (
          <View style={styles.sourceSection}>
            <View style={styles.sourceHeader}>
              <Ionicons name="library" size={SIZES.iconSmall} color={colors.textSecondary} />
              <Text style={styles.sourceTitle}>Content Sources</Text>
            </View>
            <Text style={styles.sourceText}>
              Historical information powered by Google Gemini AI and Wikipedia. 
              Content is generated based on available historical data and cultural research.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};



export default HistoryDetailScreen;
