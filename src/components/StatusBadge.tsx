import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { STATUS_CONFIG, ApplicationStatus } from '../types/application';

interface StatusBadgeProps {
  status: ApplicationStatus;
  size?: 'small' | 'medium' | 'large';
}

export default function StatusBadge({ status, size = 'medium' }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  const sizeStyles = {
    small: { paddingVertical: 2, paddingHorizontal: 8, fontSize: 10 },
    medium: { paddingVertical: 4, paddingHorizontal: 12, fontSize: 12 },
    large: { paddingVertical: 6, paddingHorizontal: 16, fontSize: 14 },
  };
  const s = sizeStyles[size];

  return (
    <View style={[styles.badge, { backgroundColor: config.bgColor, paddingVertical: s.paddingVertical, paddingHorizontal: s.paddingHorizontal }]}>
      <Text style={[styles.text, { color: config.color, fontSize: s.fontSize }]}>
        {config.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: '700',
  },
});
