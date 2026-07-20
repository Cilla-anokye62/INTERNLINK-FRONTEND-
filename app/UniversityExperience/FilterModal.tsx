/**
 * FilterModal.tsx
 * ─────────────────────────────────────────────────────────────────
 * InternLink — Filter Modal (used in StudentMonitoringScreen and
 * PlacementOverviewScreen to filter by status, department, etc.)
 *
 * Content:
 *  - Semi-transparent backdrop overlay
 *  - Bottom sheet with "Filter by" title + close button
 *  - Status filter chips: Placed, Interviewing, Applied, Seeking
 *  - "Apply" button and "Clear all" link
 *
 * Props:
 *  - visible: boolean — controls modal visibility
 *  - onClose: () => void — called when backdrop/X is tapped
 *  - onApply: (filters: string[]) => void — called with selected filters
 *  - activeFilters: string[] — pre-selected filters
 * ─────────────────────────────────────────────────────────────────
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';


// ─── COLOR PALETTE ───────────────────────────────────────────────
const COLORS = {
  backdrop:          'rgba(0,0,0,0.4)',
  sheetBg:           '#FFFFFF',
  handleBar:         '#E0E0E0',
  title:             '#0D3B47',
  closeIcon:         '#0D3B47',

  // Chips
  chipBg:            '#FFFFFF',
  chipBorder:        '#D8E8E5',
  chipText:          '#0D3B47',
  chipActiveBg:      '#D6EEF2',
  chipActiveBorder:  '#2EC4B6',
  chipActiveText:    '#1B7E94',

  // Buttons
  applyBtnBg:        '#2CACAD',
  applyBtnText:      '#FFFFFF',
  clearText:         '#9BB8B4',
};

const STATUS_OPTIONS = [
  { id: 'Placed', label: 'Placed' },
  { id: 'Interviewing', label: 'Interviewing' },
  { id: 'Applied', label: 'Applied' },
  { id: 'Seeking', label: 'Seeking' },
];


interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: string[]) => void;
  activeFilters: string[];
}

export default function FilterModal({ visible, onClose, onApply, activeFilters }: FilterModalProps) {
  const [selected, setSelected] = useState<string[]>(activeFilters);

  // Sync local state when modal opens with new props
  useEffect(() => {
    if (visible) {
      setSelected(activeFilters);
    }
  }, [visible, activeFilters]);

  const toggleChip = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleClearAll = () => {
    setSelected([]);
  };

  const handleApply = () => {
    onApply(selected);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* Backdrop */}
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={onClose}
      >
        {/* Bottom sheet */}
        <TouchableOpacity
          activeOpacity={1}
          style={styles.sheet}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Handle bar */}
          <View style={styles.handleBar} />

          {/* Header row */}
          <View style={styles.header}>
            <Text style={styles.title}>Filter by status</Text>
            <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
              <Ionicons name="close" size={22} color={COLORS.closeIcon} />
            </TouchableOpacity>
          </View>

          {/* Status chips */}
          <View style={styles.chipsContainer}>
            {STATUS_OPTIONS.map((option) => {
              const isActive = selected.includes(option.id);
              return (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.chip,
                    isActive && styles.chipActive,
                  ]}
                  onPress={() => toggleChip(option.id)}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.chipText,
                    isActive && styles.chipTextActive,
                  ]}>
                    {option.label}
                  </Text>
                  {isActive && (
                    <Ionicons
                      name="checkmark-circle"
                      size={16}
                      color={COLORS.chipActiveText}
                      style={{ marginLeft: 6 }}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Bottom actions */}
          <View style={styles.bottomRow}>
            <TouchableOpacity onPress={handleClearAll} activeOpacity={0.7}>
              <Text style={styles.clearText}>Clear all</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.applyBtn}
              onPress={handleApply}
              activeOpacity={0.85}
            >
              <Text style={styles.applyBtnText}>Apply</Text>
            </TouchableOpacity>
          </View>

        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}


// ─── STYLES ──────────────────────────────────────────────────────
const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: COLORS.backdrop,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: COLORS.sheetBg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 34,
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.handleBar,
    alignSelf: 'center',
    marginBottom: 16,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.title,
  },

  // Chips
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.chipBg,
    borderRadius: 50,
    borderWidth: 1.5,
    borderColor: COLORS.chipBorder,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  chipActive: {
    backgroundColor: COLORS.chipActiveBg,
    borderColor: COLORS.chipActiveBorder,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.chipText,
  },
  chipTextActive: {
    color: COLORS.chipActiveText,
  },

  // Bottom actions
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  clearText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.clearText,
  },
  applyBtn: {
    backgroundColor: COLORS.applyBtnBg,
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 32,
    shadowColor: COLORS.applyBtnBg,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  applyBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.applyBtnText,
  },
});
