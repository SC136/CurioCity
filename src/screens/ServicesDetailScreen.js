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
import { createServicesDetailStyles } from '../styles/ServicesDetailStyles';

const ServicesDetailScreen = ({ route, navigation }) => {
  const { location } = route.params;
  const services = location.services || [];
  const { colors, isDarkMode } = useAppTheme();

  // Create dynamic styles based on current theme
  const styles = createServicesDetailStyles(colors, isDarkMode);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const formatDistance = (distance) => {
    if (!distance) return '';
    return distance > 1000 ? `${(distance / 1000).toFixed(1)}km` : `${Math.round(distance)}m`;
  };

  const getServiceIcon = (type) => {
    if (!type) return 'business';
    const serviceType = type.toLowerCase();
    if (serviceType.includes('hospital') || serviceType.includes('medical')) return 'medical';
    if (serviceType.includes('bank') || serviceType.includes('atm')) return 'card';
    if (serviceType.includes('hotel') || serviceType.includes('accommodation')) return 'bed';
    if (serviceType.includes('shop') || serviceType.includes('store')) return 'storefront';
    if (serviceType.includes('transport') || serviceType.includes('station')) return 'train';
    if (serviceType.includes('fuel') || serviceType.includes('gas')) return 'car';
    if (serviceType.includes('pharmacy')) return 'medical';
    if (serviceType.includes('post')) return 'mail';
    return 'business';
  };

  const formatServiceType = (type) => {
    if (!type) return 'Service';
    return type.split(',').map(t => 
      t.trim().replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    ).slice(0, 2).join(', ');
  };

  const getServiceColor = (type) => {
    if (!type) return '#45B7D1';
    const serviceType = type.toLowerCase();
    if (serviceType.includes('hospital') || serviceType.includes('medical')) return '#e74c3c';
    if (serviceType.includes('bank')) return '#f39c12';
    if (serviceType.includes('hotel')) return '#9b59b6';
    if (serviceType.includes('shop')) return '#2ecc71';
    return '#45B7D1';
  };

  const renderServiceItem = ({ item: service, index }) => (
    <View style={styles.itemCard}>
      <View style={styles.itemHeader}>
        <View style={[styles.serviceIconContainer, { backgroundColor: getServiceColor(service.type) + '20' }]}>
          <Ionicons 
            name={getServiceIcon(service.type)} 
            size={SIZES.iconMedium} 
            color={getServiceColor(service.type)} 
          />
        </View>
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{service.name}</Text>
          <Text style={styles.itemDescription}>{formatServiceType(service.type)}</Text>
        </View>
        {service.distance && (
          <View style={styles.distanceContainer}>
            <Ionicons name="location" size={SIZES.iconSmall} color={colors.primary} />
            <Text style={styles.distanceText}>{formatDistance(service.distance)}</Text>
          </View>
        )}
      </View>

      <View style={styles.itemDetails}>
        <View style={styles.coordinatesContainer}>
          <Ionicons name="navigate" size={SIZES.iconSmall} color={colors.textSecondary} />
          <Text style={styles.coordinatesText} numberOfLines={1} ellipsizeMode="tail">
            {service.coordinates?.latitude?.toFixed(3) || '0.000'}, {service.coordinates?.longitude?.toFixed(3) || '0.000'}
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
        <Text style={styles.headerTitle}>Services & Amenities</Text>
        <View style={styles.headerRight}>
          <Ionicons name="business" size={24} color={colors.textWhite} />
        </View>      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{services.length}</Text>
            <Text style={styles.statLabel}>Total Services</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {new Set(services.map(s => s.type?.split(',')[0]?.trim())).size}
            </Text>
            <Text style={styles.statLabel}>Service Types</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {services.filter(s => s.distance && s.distance <= 1000).length}
            </Text>
            <Text style={styles.statLabel}>Within 1km</Text>
          </View>
        </View>

        {services.length > 0 ? (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Available Services</Text>
              <Text style={styles.sectionSubtitle}>Services and amenities in {location.name}</Text>
            </View>
            
            <FlatList
              data={services}
              renderItem={renderServiceItem}
              keyExtractor={(item, index) => `service-${index}`}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          </>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="business-outline" size={60} color={colors.textSecondary} />
            <Text style={styles.emptyTitle}>No Services Found</Text>
            <Text style={styles.emptyDescription}>
              We couldn't find any services and amenities for {location.name}. This might be a remote area or the data might be loading.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};



export default ServicesDetailScreen;
