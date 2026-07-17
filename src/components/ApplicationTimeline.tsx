import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '../hooks/useAppTheme';
import { ApplicationStatus, STATUS_CONFIG, TIMELINE_STEPS } from '../types/application';

interface TimelineProps {
  currentStatus: ApplicationStatus;
  timeline: { status: ApplicationStatus; label: string; description: string; timestamp: string; isActive: boolean }[];
}

export default function ApplicationTimeline({ currentStatus, timeline }: TimelineProps) {
  const { colors } = useAppTheme();

  const currentIdx = TIMELINE_STEPS.indexOf(currentStatus);
  const isRejected = currentStatus === 'rejected';

  return (
    <View style={styles.container}>
      {TIMELINE_STEPS.map((step, index) => {
        const config = STATUS_CONFIG[step];
        const isCompleted = index <= currentIdx && !isRejected;
        const isCurrent = index === currentIdx;
        const isFuture = index > currentIdx;
        const timelineEvent = timeline.find((e) => e.status === step);

        return (
          <View key={step} style={styles.stepRow}>
            <View style={styles.indicatorColumn}>
              <View
                style={[
                  styles.dot,
                  {
                    backgroundColor: isCompleted ? config.color : isFuture ? colors.inputBorder : colors.inputBorder,
                    borderColor: isCurrent ? config.color : 'transparent',
                    borderWidth: isCurrent ? 3 : 0,
                  },
                ]}
              />
              {index < TIMELINE_STEPS.length - 1 && (
                <View
                  style={[
                    styles.line,
                    {
                      backgroundColor: isCompleted && index < currentIdx ? colors.accent : colors.inputBorder,
                    },
                  ]}
                />
              )}
            </View>
            <View style={styles.contentColumn}>
              <Text
                style={[
                  styles.label,
                  {
                    color: isCompleted ? colors.title : colors.placeholder,
                    fontWeight: isCurrent ? '700' : '500',
                  },
                ]}
              >
                {config.label}
              </Text>
              {timelineEvent && (
                <Text style={[styles.description, { color: colors.subtitle }]}>
                  {timelineEvent.description}
                </Text>
              )}
              {timelineEvent && (
                <Text style={[styles.timestamp, { color: colors.placeholder }]}>
                  {new Date(timelineEvent.timestamp).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              )}
            </View>
          </View>
        );
      })}
      {isRejected && (
        <View style={styles.stepRow}>
          <View style={styles.indicatorColumn}>
            <View style={[styles.dot, { backgroundColor: STATUS_CONFIG.rejected.color }]} />
          </View>
          <View style={styles.contentColumn}>
            <Text style={[styles.label, { color: STATUS_CONFIG.rejected.color, fontWeight: '700' }]}>
              Not Selected
            </Text>
            <Text style={[styles.description, { color: colors.subtitle }]}>
              Unfortunately, you were not selected for this position
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 4,
  },
  stepRow: {
    flexDirection: 'row',
    minHeight: 56,
  },
  indicatorColumn: {
    alignItems: 'center',
    width: 24,
    marginRight: 12,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
  },
  line: {
    width: 2,
    flex: 1,
    minHeight: 20,
    marginTop: 4,
  },
  contentColumn: {
    flex: 1,
    paddingBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 2,
  },
  description: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 2,
  },
  timestamp: {
    fontSize: 11,
  },
});
