import React, { memo, useMemo } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useAppTheme } from '../../hooks/useAppTheme';
import { Ionicons } from '@expo/vector-icons';
import { ListItemSkeleton } from '../common/LoadingSkeleton';

const LatestNews = memo(({ data, onItemPress, loading = false }) => {
  const { colors } = useAppTheme();

  // Only show first 5 news items
  const displayData = useMemo(() => data.slice(0, 5), [data]);

  return (
    <View className="mb-10 px-6">
      <View className="flex-row items-center justify-center mb-8">
        <View className="h-[2px] flex-1 bg-gray-300 dark:bg-gray-600" />
        <Text className="text-2xl font-bold mx-6 tracking-wide" style={{ color: colors.textPrimary }}>
          Latest News
        </Text>
        <View className="h-[2px] flex-1 bg-gray-300 dark:bg-gray-600" />
      </View>
      
      {loading ? (
        <View className="py-4">
          <ListItemSkeleton />
          <ListItemSkeleton />
          <ListItemSkeleton />
        </View>
      ) : data.length === 0 ? (
        <View className="items-center justify-center py-8">
          <Ionicons name="newspaper-outline" size={48} color={colors.textSecondary} style={{ opacity: 0.5 }} />
          <Text className="text-base font-semibold mt-4" style={{ color: colors.textPrimary }}>
            No news available
          </Text>
          <Text className="text-sm text-center mt-2" style={{ color: colors.textSecondary }}>
            Check back later for updates
          </Text>
        </View>
      ) : (
        <View>
          {displayData.map((item, index) => (
            <TouchableOpacity 
              key={index}
              className="p-4 mb-4 rounded-xl"
              style={{ backgroundColor: colors.cardBackground }}
              onPress={() => onItemPress(item)}
              activeOpacity={0.7}
            >
              <View className="flex-row">
                {item.imageUrl ? (
                  <Image 
                    source={{ uri: item.imageUrl }}
                    className="h-24 w-24 rounded-xl mr-4"
                    resizeMode="cover"
                  />
                ) : (
                  <View className="h-24 w-24 rounded-xl mr-4 items-center justify-center" style={{ backgroundColor: colors.primary + '20' }}>
                    <Ionicons name="newspaper-outline" size={28} color={colors.primary} />
                  </View>
                )}
                <View className="flex-1 justify-center">
                    <Text className="font-bold text-base mb-2" numberOfLines={2} style={{ color: colors.textPrimary }}>
                        {item.title}
                    </Text>
                    <Text className="text-sm" numberOfLines={2} style={{ color: colors.textSecondary }}>
                        {item.description}
                    </Text>
                    {item.source && (
                      <Text className="text-xs mt-2" style={{ color: colors.textSecondary }}>
                        {item.source} • {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : ''}
                      </Text>
                    )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
});

LatestNews.displayName = 'LatestNews';

export default LatestNews;
