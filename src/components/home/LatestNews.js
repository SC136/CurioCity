import React, { memo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '../../hooks/useAppTheme';
import { Ionicons } from '@expo/vector-icons';

const LatestNews = memo(({ data = [], loading = false, onItemPress }) => {
  const { colors } = useAppTheme();

  const getBackgroundColor = () => {
    // Get the actual background color from the theme
    return colors.background || '#FFFFFF';
  };

  return (
    <View className="mb-10 px-6">
      <View className="flex-row items-center justify-center mb-8">
        <View className="h-[2px] flex-1 bg-gray-300 dark:bg-gray-600" />
        <Text className="text-2xl font-bold mx-6 tracking-wide" style={{ color: colors.textPrimary }}>
          Latest News
        </Text>
        <View className="h-[2px] flex-1 bg-gray-300 dark:bg-gray-600" />
      </View>
      
      <View 
        className="overflow-hidden h-[500px] relative"
      >
        {loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : !data || data.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <Ionicons name="newspaper-outline" size={48} color={colors.textSecondary} />
            <Text className="text-base mt-3" style={{ color: colors.textSecondary }}>No news available</Text>
          </View>
        ) : (
        <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 24, paddingBottom: 24 }}>
          {data.map((item, index) => (
            <TouchableOpacity 
              key={item.id || index}
              className="p-6"
              onPress={() => onItemPress(item)}
              activeOpacity={0.7}
            >
              <View className="flex-row">
                {item.imageUrl ? (
                  <Image
                    source={{ uri: item.imageUrl }}
                    className="h-28 w-28 rounded-2xl mr-5"
                    resizeMode="cover"
                  />
                ) : (
                  <View className="h-28 w-28 rounded-2xl mr-5 items-center justify-center" style={{ backgroundColor: colors.primary + '20' }}>
                    <Ionicons name="newspaper-outline" size={32} color={colors.primary} />
                  </View>
                )}
                <View className="flex-1 justify-center">
                    <Text className="font-bold text-lg mb-2 leading-6" numberOfLines={2} style={{ color: colors.textPrimary }}>
                        {item.title}
                    </Text>
                    <Text className="text-base leading-6" numberOfLines={2} style={{ color: colors.textSecondary }}>
                        {item.description}
                    </Text>
                    {item.source && (
                      <Text className="text-xs mt-2" style={{ color: colors.textSecondary }}>
                        {item.source} {item.publishedAt ? `• ${new Date(item.publishedAt).toLocaleDateString()}` : ''}
                      </Text>
                    )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
        )}
        {!loading && data && data.length > 0 && (
        <>
        <LinearGradient
          colors={[getBackgroundColor(), 'transparent']}
          className="absolute top-0 left-0 right-0 h-16 pointer-events-none"
        />
        <LinearGradient
          colors={['transparent', getBackgroundColor()]}
          className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
        />
        </>
        )}
      </View>
    </View>
  );
});

LatestNews.displayName = 'LatestNews';

export default LatestNews;
