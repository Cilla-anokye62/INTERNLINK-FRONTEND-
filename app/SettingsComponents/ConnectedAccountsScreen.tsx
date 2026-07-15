/**
 * ConnectedAccountsScreen.tsx
 * ─────────────────────────────────────────────────────────────────
 * InternLink — Connected Accounts (ACCOUNT section in SettingsScreen)
 *
 * Content:
 *  - List of connectable services (Google, LinkedIn, GitHub)
 *  - Each row: logo-colored icon circle, name, and Connect/Disconnect pill
 *  - Uses local state to track connection status (2 connected, 1 not)
 *
 * HOW TO USE:
 *  1. Drop inside your screens/ or app/ folder
 *  2. Add to App.tsx:
 *     import ConnectedAccountsScreen from './app/ConnectedAccountsScreen';
 *     <Stack.Screen name="ConnectedAccounts" component={ConnectedAccountsScreen} />
 * ─────────────────────────────────────────────────────────────────
 */

// ─── IMPORTS ─────────────────────────────────────────────────────
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from "../../src/hooks/useAppTheme";


// ─── DATA ─────────────────────────────────────────────────────────
// Connectable services with their brand colors
const ACCOUNTS = [
  {
    id: 'google',
    name: 'Google',
    icon: 'logo-google',
    color: '#4285F4',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: 'logo-linkedin',
    color: '#0077B5',
  },
  {
    id: 'github',
    name: 'GitHub',
    icon: 'logo-github',
    color: '#333333',
  },
];


// ─── MAIN SCREEN COMPONENT ───────────────────────────────────────
export default function ConnectedAccountsScreen({ navigation }: any) {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);


  // Track which accounts are connected (2 connected, 1 not)
  const [connectedAccounts, setConnectedAccounts] = useState<Set<string>>(
    new Set(['google', 'linkedin'])
  );

  const handleBackPress = () => {
    navigation.goBack();
  };

  const toggleConnection = (accountId: string) => {
    setConnectedAccounts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(accountId)) {
        newSet.delete(accountId);
        console.log('Disconnected:', accountId);
      } else {
        newSet.add(accountId);
        console.log('Connected:', accountId);
      }
      // TODO: sync with backend
      return newSet;
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
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
              color={colors.title}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Connected Accounts</Text>
        </View>
        {/* ── END HEADER ──────────────────────────────────────────── */}


        {/* ── ACCOUNTS LIST ───────────────────────────────────────── */}
        <View style={styles.accountsCard}>
          {ACCOUNTS.map((account) => {
            const isConnected = connectedAccounts.has(account.id);

            return (
              <View
                key={account.id}
                style={[
                  styles.accountRow,
                  ACCOUNTS.indexOf(account) < ACCOUNTS.length - 1 && styles.accountRowNotLast,
                ]}
              >
                {/* Icon Circle */}
                <View style={[styles.iconCircle, { backgroundColor: account.color }]}>
                  <Ionicons
                    name={account.icon as any}
                    size={22}
                    color={colors.accentText}
                  />
                </View>

                {/* Service Name */}
                <Text style={styles.serviceName}>{account.name}</Text>

                {/* Connect/Disconnect Button */}
                <TouchableOpacity
                  style={[
                    styles.connectBtn,
                    isConnected ? styles.connectBtnConnected : styles.connectBtnDisconnected,
                  ]}
                  onPress={() => toggleConnection(account.id)}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.connectBtnText,
                    isConnected ? styles.connectBtnTextConnected : styles.connectBtnTextDisconnected,
                  ]}>
                    {isConnected ? 'Disconnect' : 'Connect'}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
        {/* ── END ACCOUNTS LIST ───────────────────────────────────── */}

      </ScrollView>
    </SafeAreaView>
  );
}


// ─── STYLES ──────────────────────────────────────────────────────
const createStyles = (colors: any) => StyleSheet.create({

  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
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
    marginBottom: 24,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.card,
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
    color: colors.title,
  },

  // ── Accounts Card ─────────────────────────────────────────────
  accountsCard: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },

  // ── Account Row ───────────────────────────────────────────────
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  accountRowNotLast: {
    borderBottomWidth: 1,
    borderBottomColor: colors.rowBorder,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  serviceName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: colors.serviceName,
  },

  // ── Connect/Disconnect Button ─────────────────────────────────
  connectBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  connectBtnConnected: {
    backgroundColor: colors.disconnectPillBg,
  },
  connectBtnDisconnected: {
    backgroundColor: colors.connectPillBg,
  },
  connectBtnText: {
    fontSize: 13,
    fontWeight: '600',
  },
  connectBtnTextConnected: {
    color: colors.disconnectPillText,
  },
  connectBtnTextDisconnected: {
    color: colors.connectPillText,
  },

});
