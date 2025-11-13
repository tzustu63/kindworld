import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  RefreshControl,
} from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../theme';
import { CSRMetrics, DateRange } from '../types';
import { ParticipationChart } from '../components/ParticipationChart';
import { CategoryPieChart } from '../components/CategoryPieChart';
import { GeographicDistribution } from '../components/GeographicDistribution';
import { MissionPerformanceTable } from '../components/MissionPerformanceTable';
import { ExportButton } from '../components/ExportButton';
import { exportData, ExportFormat } from '../utils/dataExport';
import { useMonitoring } from '../hooks/useMonitoring';
import { AnalyticsEvent } from '../services/monitoringService';

interface CSRDashboardScreenProps {
  companyId: string;
  companyName: string;
  companyLogo: string;
  metrics: CSRMetrics;
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  onRefresh?: () => Promise<void>;
  isRefreshing?: boolean;
}

const DATE_RANGE_OPTIONS = [
  { label: 'Last 7 Days', days: 7 },
  { label: 'Last 30 Days', days: 30 },
  { label: 'Last 90 Days', days: 90 },
  { label: 'This Year', days: 365 },
];

const CSRDashboardScreen: React.FC<CSRDashboardScreenProps> = ({
  companyName,
  companyLogo,
  metrics,
  dateRange,
  onDateRangeChange,
  onRefresh,
  isRefreshing = false,
}) => {
  // Add monitoring
  const { logEvent } = useMonitoring({
    screenName: 'CSRDashboard',
    trackScreenView: true,
    measureLoadTime: true,
  });
  
  const [selectedRangeIndex, setSelectedRangeIndex] = useState(1); // Default to 30 days

  const handleDateRangeSelect = (index: number) => {
    setSelectedRangeIndex(index);
    const days = DATE_RANGE_OPTIONS[index].days;
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    onDateRangeChange({ startDate, endDate });
  };

  const handleExport = async (format: ExportFormat) => {
    await exportData(metrics, format, companyName);
    
    // Log export event
    await logEvent(AnalyticsEvent.CSR_EXPORT_DATA, {
      format,
      company_name: companyName,
      total_participants: metrics.totalParticipants,
      total_missions: metrics.totalMissionsSponsored,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              tintColor={colors.accent}
              colors={[colors.accent]}
            />
          ) : undefined
        }
      >
        {/* Header with Company Logo and Name */}
        <View style={styles.header}>
          <View style={styles.companyInfo}>
            {companyLogo ? (
              <Image
                source={{ uri: companyLogo }}
                style={styles.companyLogo}
                resizeMode="contain"
              />
            ) : (
              <View style={[styles.companyLogo, styles.companyLogoPlaceholder]}>
                <Text style={styles.companyLogoText}>
                  {companyName.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
            <View style={styles.companyTextContainer}>
              <Text style={styles.companyName}>{companyName}</Text>
              <Text style={styles.headerSubtitle}>CSR Analytics Dashboard</Text>
            </View>
          </View>
        </View>

        {/* Date Range Selector */}
        <View style={styles.dateRangeSection}>
          <View style={styles.dateRangeHeader}>
            <Text style={styles.sectionLabel}>Time Period</Text>
            <ExportButton onExport={handleExport} />
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dateRangeContainer}
          >
            {DATE_RANGE_OPTIONS.map((option, index) => (
              <TouchableOpacity
                key={option.label}
                style={[
                  styles.dateRangePill,
                  selectedRangeIndex === index && styles.dateRangePillActive,
                ]}
                onPress={() => handleDateRangeSelect(index)}
              >
                <Text
                  style={[
                    styles.dateRangePillText,
                    selectedRangeIndex === index && styles.dateRangePillTextActive,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Key Metrics Cards */}
        <View style={styles.metricsSection}>
          <Text style={styles.sectionTitle}>Key Metrics</Text>
          <View style={styles.metricsGrid}>
            <MetricCard
              title="Total Participants"
              value={metrics.totalParticipants.toLocaleString()}
              icon="👥"
            />
            <MetricCard
              title="Points Distributed"
              value={metrics.totalPointsDistributed.toLocaleString()}
              icon="⭐"
            />
            <MetricCard
              title="Missions Sponsored"
              value={metrics.totalMissionsSponsored.toLocaleString()}
              icon="🎯"
            />
            <MetricCard
              title="Impact Score"
              value={metrics.impactScore.toFixed(1)}
              icon="📊"
            />
          </View>
        </View>

        {/* Participation Over Time Chart */}
        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Participation Over Time</Text>
          <View style={styles.chartCard}>
            <ParticipationChart data={metrics.participationOverTime} />
          </View>
        </View>

        {/* Mission Categories Chart */}
        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Mission Categories</Text>
          <View style={styles.chartCard}>
            <CategoryPieChart data={metrics.missionCategories} />
          </View>
        </View>

        {/* Geographic Distribution */}
        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Geographic Distribution</Text>
          <View style={styles.chartCard}>
            <GeographicDistribution data={metrics.geographicDistribution} />
          </View>
        </View>

        {/* Mission Performance Table */}
        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Mission Performance</Text>
          <MissionPerformanceTable missions={metrics.sponsoredMissions} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

interface MetricCardProps {
  title: string;
  value: string;
  icon: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon }) => {
  return (
    <View style={styles.metricCard}>
      <Text style={styles.metricIcon}>{icon}</Text>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricTitle}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
    backgroundColor: colors.gray100,
  },
  header: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  companyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  companyLogo: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.md,
    marginRight: spacing.md,
  },
  companyLogoPlaceholder: {
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  companyLogoText: {
    ...typography.h2,
    color: colors.white,
    fontWeight: '700',
  },
  companyTextContainer: {
    flex: 1,
  },
  companyName: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    ...typography.body2,
    color: colors.textSecondary,
  },
  dateRangeSection: {
    backgroundColor: colors.white,
    paddingVertical: spacing.md,
    marginTop: spacing.sm,
  },
  dateRangeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  sectionLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  dateRangeContainer: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  dateRangePill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.gray100,
    marginRight: spacing.sm,
  },
  dateRangePillActive: {
    backgroundColor: colors.primary,
  },
  dateRangePillText: {
    ...typography.body2,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  dateRangePillTextActive: {
    color: colors.white,
  },
  metricsSection: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  metricCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.md,
    alignItems: 'center',
  },
  metricIcon: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  metricValue: {
    ...typography.h2,
    color: colors.textPrimary,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  metricTitle: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  chartSection: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  chartCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.md,
  },
});

export default CSRDashboardScreen;
