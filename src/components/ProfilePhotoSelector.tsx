import React from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import type { UploadableImage } from '../api';
import { useAppTheme } from '../hooks/useAppTheme';

interface ProfilePhotoSelectorProps {
  imageUri: string | null;
  fallbackText: string;
  disabled?: boolean;
  selecting?: boolean;
  onSelect: (file: UploadableImage, previewUri: string) => void;
}

export default function ProfilePhotoSelector({
  imageUri,
  fallbackText,
  disabled = false,
  selecting = false,
  onSelect,
}: ProfilePhotoSelectorProps) {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  const pickImage = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          'Photo access needed',
          'Allow photo-library access to choose a profile picture.',
        );
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (result.canceled || !result.assets[0]) return;
      const asset = result.assets[0];
      onSelect({
        uri: asset.uri,
        name: asset.fileName || `profile-${Date.now()}.jpg`,
        mimeType: asset.mimeType,
      }, asset.uri);
    } catch (error) {
      Alert.alert(
        'Could not select photo',
        error instanceof Error ? error.message : 'Please try again.',
      );
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => void pickImage()}
      disabled={disabled || selecting}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={imageUri ? 'Change profile photo' : 'Add profile photo'}
    >
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.image} />
      ) : (
        <View style={styles.fallback}>
          <Text style={styles.fallbackText}>
            {fallbackText.trim().charAt(0).toUpperCase() || '?'}
          </Text>
        </View>
      )}
      <View style={styles.badge}>
        {selecting ? (
          <ActivityIndicator size="small" color={colors.onPrimary} />
        ) : (
          <Ionicons name="camera-outline" size={16} color={colors.onPrimary} />
        )}
      </View>
      <Text style={styles.label}>{imageUri ? 'Change photo' : 'Add photo'}</Text>
    </TouchableOpacity>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    alignSelf: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  image: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: colors.iconCircle,
  },
  fallback: {
    width: 82,
    height: 82,
    borderRadius: 41,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
  },
  fallbackText: {
    color: colors.onPrimary,
    fontSize: 28,
    fontWeight: '800',
  },
  badge: {
    position: 'absolute',
    right: 2,
    top: 55,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
    borderWidth: 2,
    borderColor: colors.card,
  },
  label: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 8,
  },
});
