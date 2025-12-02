import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Linking,
  Image,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES } from '../constants/colors';
import { useAppTheme } from '../hooks/useAppTheme';
import { createNewsDetailStyles } from '../styles/NewsDetailStyles';

const NewsDetailScreen = ({ route, navigation }) => {
  const { location } = route.params;
  const { colors, isDarkMode } = useAppTheme();
  const news = location.news || [];

  // Create dynamic styles based on current theme
  const styles = createNewsDetailStyles(colors, isDarkMode);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleNewsLink = async (url) => {
    if (url) {
      try {
        const supported = await Linking.canOpenURL(url);
        if (supported) {
          await Linking.openURL(url);
        }
      } catch (error) {
        console.error('Error opening news link:', error);
      }
    }
  };
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return 'Recent';
    }
  };

  const renderNewsItem = ({ item: article, index }) => (
    <TouchableOpacity
      style={styles.newsCard}
      onPress={() => handleNewsLink(article.url)}
      activeOpacity={0.7}
    >
      {article.imageUrl ? (
        <Image
          source={{ uri: article.imageUrl }}
          style={styles.newsImage}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.newsImage, styles.placeholderImage]}>
          <Ionicons 
            name="newspaper-outline" 
            size={24} 
            color={colors.textSecondary} 
          />
        </View>
      )}
      <View style={styles.newsContent}>
        <Text style={styles.newsTitle} numberOfLines={2}>
          {article.title}
        </Text>
        <Text style={styles.newsDescription} numberOfLines={3}>
          {article.description}
        </Text>
        <View style={styles.newsFooter}>
          <Text style={styles.newsSource}>{article.source}</Text>
          <Text style={styles.newsDate}>{formatDate(article.publishedAt)}</Text>
        </View>
      </View>
      <Ionicons name="open-outline" size={SIZES.iconSmall} color={colors.primary} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
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
        <Text style={styles.headerTitle}>Latest News</Text>
        <View style={styles.headerRight}>
          <Ionicons name="newspaper" size={24} color={colors.textWhite} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{news.length}</Text>
            <Text style={styles.statLabel}>Articles Found</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {news.filter(article => article.publishedAt && new Date(article.publishedAt) > new Date(Date.now() - 24*60*60*1000)).length}
            </Text>
            <Text style={styles.statLabel}>Today's News</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {news.filter(article => article.source).length}
            </Text>
            <Text style={styles.statLabel}>Sources</Text>
          </View>
        </View>

        {news.length > 0 ? (
          <>            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Latest News</Text>
              <Text style={styles.sectionSubtitle}>Recent articles and updates from {location.name}</Text>
            </View>
              <FlatList
              data={news}
              renderItem={renderNewsItem}
              keyExtractor={(item, index) => `news-${index}`}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          </>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="newspaper-outline" size={60} color={colors.textSecondary} />
            <Text style={styles.emptyTitle}>No News Available</Text>
            <Text style={styles.emptyDescription}>
              We couldn't find any recent news for {location.name}. Try checking back later.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default NewsDetailScreen;
