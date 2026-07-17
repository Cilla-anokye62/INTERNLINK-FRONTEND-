import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useAppTheme } from '../hooks/useAppTheme';

interface SkeletonCardProps {
  lines?: number;
  hasAvatar?: boolean;
}

export default function SkeletonCard({ lines = 3, hasAvatar = true }: SkeletonCardProps) {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.skeletonCardBg }]}>
      {hasAvatar && (
        <View style={styles.topRow}>
          <View style={[styles.avatar, { backgroundColor: colors.skeletonAvatarBg }]} />
          <View style={styles.linesContainer}>
            <View style={[styles.bar, { backgroundColor: colors.skeletonBarBg, width: '70%' }]} />
            <View style={[styles.bar, { backgroundColor: colors.skeletonBarBg, width: '40%', height: 10 }]} />
          </View>
        </View>
      )}
      {Array.from({ length: lines }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.bar,
            {
              backgroundColor: colors.skeletonBarBg,
              width: i === lines - 1 ? '50%' : '100%',
              marginTop: 12,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  linesContainer: {
    flex: 1,
  },
  bar: {
    height: 14,
    borderRadius: 7,
  },
});
