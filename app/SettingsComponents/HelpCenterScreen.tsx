/**
 * HelpCenterScreen.tsx
 * ─────────────────────────────────────────────────────────────────
 * InternLink — Help Center (SUPPORT section in SettingsScreen)
 *
 * Content:
 *  - Search bar at top ("Search help articles...")
 *  - FAQ-style accordion list of 5 common questions that expand/collapse
 *    on tap to reveal an answer
 *  - "Contact Support" card with email icon and "support@internlink.com"
 *
 * HOW TO USE:
 *  1. Drop inside your screens/ or app/ folder
 *  2. Add to App.tsx:
 *     import HelpCenterScreen from './app/HelpCenterScreen';
 *     <Stack.Screen name="HelpCenter" component={HelpCenterScreen} />
 * ─────────────────────────────────────────────────────────────────
 */

// ─── IMPORTS ─────────────────────────────────────────────────────
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';


// ─── COLOR PALETTE ───────────────────────────────────────────────
const COLORS = {
  background:    '#F5FBFA',
  card:          '#FFFFFF',
  cardBorder:    '#C5E8E3',
  title:         '#0D3B47',
  subtitle:      '#4A7C75',
  label:         '#0D3B47',
  inputBg:       '#FFFFFF',
  inputBorder:   'transparent',
  inputFocus:    '#2CACAD',
  placeholder:   '#94A3B8',
  accent:        '#2CACAD',
  accentText:    '#FFFFFF',
  danger:        '#E0524C',
  chevron:       '#C7DAD7',
  rowBorder:     '#F0F6F5',
  faqQuestion:   '#0D3B47',
  faqAnswer:     '#4A7C75',
  searchIcon:    '#94A3B8',
  supportEmail:  '#2CACAD',
};


// ─── DATA ─────────────────────────────────────────────────────────
// FAQ items with questions and answers
const FAQ_ITEMS = [
  {
    id: 'apply',
    question: 'How do I apply to an internship?',
    answer: 'Browse available internships on the Students tab, tap on any listing to view details, and click the "Apply" button. Make sure your profile is complete before applying.',
  },
  {
    id: 'editProfile',
    question: 'How do I edit my profile?',
    answer: 'Go to Settings and tap on your profile card at the top (avatar + name). From there, you can update your name, role, bio, and profile photo.',
  },
  {
    id: 'notifications',
    question: 'How do I manage notifications?',
    answer: 'Navigate to Settings > Notifications. You can toggle push notifications and email notifications on or off for different types of updates.',
  },
  {
    id: 'password',
    question: 'How do I change my password?',
    answer: 'Go to Settings > Email & Password. Under the "Change Password" section, enter your current password, then your new password twice to confirm.',
  },
  {
    id: 'deleteAccount',
    question: 'How do I delete my account?',
    answer: 'Account deletion is permanent. Please contact support@internlink.com to request account deletion. Our team will guide you through the process.',
  },
];


// ─── MAIN SCREEN COMPONENT ───────────────────────────────────────
export default function HelpCenterScreen({ navigation }: any) {

  // Search query state
  const [searchQuery, setSearchQuery] = useState('');

  // Track which FAQ items are expanded
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const handleBackPress = () => {
    navigation.goBack();
  };

  const toggleFAQ = (itemId: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    console.log('Searching for:', query);
    // TODO: implement search filtering
  };

  const handleContactSupport = () => {
    console.log('Contact support tapped');
    // TODO: open email client or support chat
  };

  // Filter FAQ items based on search query
  const filteredFAQs = FAQ_ITEMS.filter((item) =>
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >

        {/* ── HEADER ROW: back arrow + title ──────────────────────── */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={handleBackPress}
            activeOpacity={0.7}
          >
            <Ionicons
              name="arrow-back-outline"
              size={22}
              color={COLORS.title}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Help Center</Text>
        </View>
        {/* ── END HEADER ──────────────────────────────────────────── */}


        {/* ── SEARCH BAR ───────────────────────────────────────────── */}
        <View style={styles.searchBar}>
          <Ionicons
            name="search-outline"
            size={18}
            color={COLORS.searchIcon}
            style={{ marginRight: 10 }}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search help articles..."
            placeholderTextColor={COLORS.placeholder}
            value={searchQuery}
            onChangeText={handleSearch}
            autoCapitalize="none"
          />
        </View>
        {/* ── END SEARCH BAR ───────────────────────────────────────── */}


        {/* ── FAQ LIST ─────────────────────────────────────────────── */}
        <View style={styles.faqCard}>
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((item) => {
              const isExpanded = expandedItems.has(item.id);

              return (
                <View
                  key={item.id}
                  style={[
                    styles.faqRow,
                    FAQ_ITEMS.indexOf(item) < FAQ_ITEMS.length - 1 && styles.faqRowNotLast,
                  ]}
                >
                  {/* Question row (tappable) */}
                  <TouchableOpacity
                    style={styles.questionRow}
                    onPress={() => toggleFAQ(item.id)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.faqQuestion}>{item.question}</Text>
                    <Ionicons
                      name={isExpanded ? 'chevron-up-outline' : 'chevron-down-outline'}
                      size={20}
                      color={COLORS.chevron}
                    />
                  </TouchableOpacity>

                  {/* Answer (shown when expanded) */}
                  {isExpanded && (
                    <View style={styles.answerContainer}>
                      <Text style={styles.faqAnswer}>{item.answer}</Text>
                    </View>
                  )}
                </View>
              );
            })
          ) : (
            <View style={styles.noResults}>
              <Text style={styles.noResultsText}>No results found</Text>
            </View>
          )}
        </View>
        {/* ── END FAQ LIST ───────────────────────────────────────── */}


        {/* ── CONTACT SUPPORT CARD ─────────────────────────────────── */}
        <TouchableOpacity
          style={styles.supportCard}
          onPress={handleContactSupport}
          activeOpacity={0.85}
        >
          <View style={styles.iconCircle}>
            <Ionicons
              name="mail-outline"
              size={24}
              color={COLORS.supportEmail}
            />
          </View>
          <View style={styles.supportTextBlock}>
            <Text style={styles.supportTitle}>Contact Support</Text>
            <Text style={styles.supportEmail}>support@internlink.com</Text>
          </View>
          <Ionicons
            name="arrow-forward-outline"
            size={18}
            color={COLORS.chevron}
          />
        </TouchableOpacity>
        {/* ── END CONTACT SUPPORT CARD ───────────────────────────── */}

      </ScrollView>
    </SafeAreaView>
  );
}


// ─── STYLES ──────────────────────────────────────────────────────
const styles = StyleSheet.create({

  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 24,
  },

  // ── Header ────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.title,
  },

  // ── Search Bar ───────────────────────────────────────────────
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.title,
  },

  // ── FAQ Card ─────────────────────────────────────────────────
  faqCard: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    padding: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },

  // ── FAQ Row ─────────────────────────────────────────────────
  faqRow: {
    paddingVertical: 8,
  },
  faqRowNotLast: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.rowBorder,
  },
  questionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  faqQuestion: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.faqQuestion,
    marginRight: 12,
  },
  answerContainer: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  faqAnswer: {
    fontSize: 13,
    lineHeight: 18,
    color: COLORS.faqAnswer,
  },

  // ── No Results ───────────────────────────────────────────────
  noResults: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 14,
    color: COLORS.subtitle,
  },

  // ── Contact Support Card ─────────────────────────────────────
  supportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E8F8F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  supportTextBlock: {
    flex: 1,
  },
  supportTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.title,
    marginBottom: 2,
  },
  supportEmail: {
    fontSize: 13,
    color: COLORS.supportEmail,
  },

});
