import { Share, Platform } from 'react-native';
import RNFS from 'react-native-fs';
import { CSRMetrics, SponsoredMissionMetrics } from '../types';

export type ExportFormat = 'csv' | 'pdf';

/**
 * Format CSR metrics data as CSV
 */
export const formatCSV = (metrics: CSRMetrics): string => {
  const lines: string[] = [];
  
  // Header
  lines.push('KindWorld CSR Analytics Report');
  lines.push('');
  
  // Summary Metrics
  lines.push('Summary Metrics');
  lines.push('Metric,Value');
  lines.push(`Total Participants,${metrics.totalParticipants}`);
  lines.push(`Points Distributed,${metrics.totalPointsDistributed}`);
  lines.push(`Missions Sponsored,${metrics.totalMissionsSponsored}`);
  lines.push(`Impact Score,${metrics.impactScore.toFixed(2)}`);
  lines.push('');
  
  // Participation Over Time
  lines.push('Participation Over Time');
  lines.push('Date,Participants');
  metrics.participationOverTime.forEach(item => {
    lines.push(`${item.date},${item.participants}`);
  });
  lines.push('');
  
  // Mission Categories
  lines.push('Mission Categories');
  lines.push('Category,Count,Percentage');
  metrics.missionCategories.forEach(item => {
    lines.push(`${item.category},${item.count},${item.percentage.toFixed(2)}%`);
  });
  lines.push('');
  
  // Geographic Distribution
  lines.push('Geographic Distribution');
  lines.push('City,Participants');
  metrics.geographicDistribution.forEach(item => {
    lines.push(`${item.city},${item.participants}`);
  });
  lines.push('');
  
  // Mission Performance
  lines.push('Mission Performance');
  lines.push('Title,Date,Participants,Points Distributed,Completion Rate,Engagement Score');
  metrics.sponsoredMissions.forEach(mission => {
    lines.push(
      `"${mission.title}",${mission.date},${mission.participants},${mission.pointsDistributed},${mission.completionRate}%,${mission.engagementScore.toFixed(2)}`
    );
  });
  
  return lines.join('\n');
};

/**
 * Format CSR metrics data as simple text-based PDF content
 */
export const formatPDF = (metrics: CSRMetrics, companyName: string): string => {
  const lines: string[] = [];
  
  lines.push('═══════════════════════════════════════════════════');
  lines.push('           KindWorld CSR Analytics Report          ');
  lines.push(`                  ${companyName}                   `);
  lines.push('═══════════════════════════════════════════════════');
  lines.push('');
  
  lines.push('SUMMARY METRICS');
  lines.push('───────────────────────────────────────────────────');
  lines.push(`Total Participants:      ${metrics.totalParticipants.toLocaleString()}`);
  lines.push(`Points Distributed:      ${metrics.totalPointsDistributed.toLocaleString()}`);
  lines.push(`Missions Sponsored:      ${metrics.totalMissionsSponsored}`);
  lines.push(`Impact Score:            ${metrics.impactScore.toFixed(2)}`);
  lines.push('');
  
  lines.push('MISSION CATEGORIES');
  lines.push('───────────────────────────────────────────────────');
  metrics.missionCategories.forEach(item => {
    lines.push(`${item.category.padEnd(30)} ${item.count.toString().padStart(5)} (${item.percentage.toFixed(1)}%)`);
  });
  lines.push('');
  
  lines.push('GEOGRAPHIC DISTRIBUTION');
  lines.push('───────────────────────────────────────────────────');
  metrics.geographicDistribution.slice(0, 10).forEach(item => {
    lines.push(`${item.city.padEnd(30)} ${item.participants.toString().padStart(5)} participants`);
  });
  lines.push('');
  
  lines.push('TOP PERFORMING MISSIONS');
  lines.push('───────────────────────────────────────────────────');
  const topMissions = [...metrics.sponsoredMissions]
    .sort((a, b) => b.engagementScore - a.engagementScore)
    .slice(0, 10);
  
  topMissions.forEach((mission, index) => {
    lines.push(`${index + 1}. ${mission.title}`);
    lines.push(`   Date: ${mission.date}`);
    lines.push(`   Participants: ${mission.participants} | Points: ${mission.pointsDistributed}`);
    lines.push(`   Engagement: ${mission.engagementScore.toFixed(1)} | Completion: ${mission.completionRate}%`);
    lines.push('');
  });
  
  lines.push('═══════════════════════════════════════════════════');
  lines.push(`Generated on: ${new Date().toLocaleDateString()}`);
  lines.push('═══════════════════════════════════════════════════');
  
  return lines.join('\n');
};

/**
 * Export CSR metrics data
 */
export const exportData = async (
  metrics: CSRMetrics,
  format: ExportFormat,
  companyName: string
): Promise<void> => {
  try {
    const timestamp = new Date().toISOString().split('T')[0];
    const fileName = `CSR_Analytics_${companyName.replace(/\s+/g, '_')}_${timestamp}.${format}`;
    
    let content: string;
    let mimeType: string;
    
    if (format === 'csv') {
      content = formatCSV(metrics);
      mimeType = 'text/csv';
    } else {
      content = formatPDF(metrics, companyName);
      mimeType = 'text/plain'; // Using plain text as a simple PDF alternative
    }
    
    // Determine file path based on platform
    const filePath = Platform.select({
      ios: `${RNFS.DocumentDirectoryPath}/${fileName}`,
      android: `${RNFS.DownloadDirectoryPath}/${fileName}`,
      default: `${RNFS.DocumentDirectoryPath}/${fileName}`,
    });
    
    // Write file
    await RNFS.writeFile(filePath, content, 'utf8');
    
    // Share the file
    await Share.share({
      title: `CSR Analytics Report - ${companyName}`,
      message: `CSR Analytics Report for ${companyName}`,
      url: Platform.OS === 'ios' ? filePath : `file://${filePath}`,
    });
    
  } catch (error) {
    console.error('Error exporting data:', error);
    throw new Error('Failed to export data. Please try again.');
  }
};

/**
 * Export individual mission data
 */
export const exportMissionData = async (
  mission: SponsoredMissionMetrics,
  format: ExportFormat
): Promise<void> => {
  try {
    const timestamp = new Date().toISOString().split('T')[0];
    const fileName = `Mission_${mission.id}_${timestamp}.${format}`;
    
    let content: string;
    
    if (format === 'csv') {
      content = [
        'Mission Performance Report',
        '',
        'Mission Details',
        'Field,Value',
        `Title,"${mission.title}"`,
        `Date,${mission.date}`,
        `Participants,${mission.participants}`,
        `Points Distributed,${mission.pointsDistributed}`,
        `Completion Rate,${mission.completionRate}%`,
        `Engagement Score,${mission.engagementScore.toFixed(2)}`,
      ].join('\n');
    } else {
      content = [
        '═══════════════════════════════════════════════════',
        '           Mission Performance Report              ',
        '═══════════════════════════════════════════════════',
        '',
        `Title: ${mission.title}`,
        `Date: ${mission.date}`,
        '',
        'METRICS',
        '───────────────────────────────────────────────────',
        `Participants:        ${mission.participants}`,
        `Points Distributed:  ${mission.pointsDistributed}`,
        `Completion Rate:     ${mission.completionRate}%`,
        `Engagement Score:    ${mission.engagementScore.toFixed(2)}`,
        '',
        '═══════════════════════════════════════════════════',
        `Generated on: ${new Date().toLocaleDateString()}`,
        '═══════════════════════════════════════════════════',
      ].join('\n');
    }
    
    const filePath = Platform.select({
      ios: `${RNFS.DocumentDirectoryPath}/${fileName}`,
      android: `${RNFS.DownloadDirectoryPath}/${fileName}`,
      default: `${RNFS.DocumentDirectoryPath}/${fileName}`,
    });
    
    await RNFS.writeFile(filePath, content, 'utf8');
    
    await Share.share({
      title: `Mission Report - ${mission.title}`,
      message: `Performance report for mission: ${mission.title}`,
      url: Platform.OS === 'ios' ? filePath : `file://${filePath}`,
    });
    
  } catch (error) {
    console.error('Error exporting mission data:', error);
    throw new Error('Failed to export mission data. Please try again.');
  }
};
