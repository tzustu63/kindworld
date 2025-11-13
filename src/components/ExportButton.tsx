import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../theme';
import { ExportFormat } from '../utils/dataExport';

export interface ExportButtonProps {
  onExport: (format: ExportFormat) => Promise<void>;
  disabled?: boolean;
}

export const ExportButton: React.FC<ExportButtonProps> = ({
  onExport,
  disabled = false,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format: ExportFormat) => {
    setIsExporting(true);
    try {
      await onExport(format);
      setShowModal(false);
      Alert.alert(
        'Export Successful',
        `Your data has been exported as ${format.toUpperCase()}.`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert(
        'Export Failed',
        error instanceof Error ? error.message : 'An error occurred while exporting data.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.exportButton, disabled && styles.exportButtonDisabled]}
        onPress={() => setShowModal(true)}
        disabled={disabled}
      >
        <Text style={styles.exportButtonText}>📊 Export Data</Text>
      </TouchableOpacity>

      <Modal
        visible={showModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => !isExporting && setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Export Format</Text>
            <Text style={styles.modalSubtitle}>
              Choose a format to export your analytics data
            </Text>

            {isExporting ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.accent} />
                <Text style={styles.loadingText}>Exporting data...</Text>
              </View>
            ) : (
              <>
                <TouchableOpacity
                  style={styles.formatOption}
                  onPress={() => handleExport('csv')}
                >
                  <View style={styles.formatIcon}>
                    <Text style={styles.formatIconText}>📄</Text>
                  </View>
                  <View style={styles.formatInfo}>
                    <Text style={styles.formatTitle}>CSV</Text>
                    <Text style={styles.formatDescription}>
                      Comma-separated values, ideal for Excel and data analysis
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.formatOption}
                  onPress={() => handleExport('pdf')}
                >
                  <View style={styles.formatIcon}>
                    <Text style={styles.formatIconText}>📋</Text>
                  </View>
                  <View style={styles.formatInfo}>
                    <Text style={styles.formatTitle}>PDF</Text>
                    <Text style={styles.formatDescription}>
                      Formatted report, ideal for presentations and sharing
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setShowModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  exportButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    ...shadows.sm,
  },
  exportButtonDisabled: {
    backgroundColor: colors.gray300,
  },
  exportButtonText: {
    ...typography.button,
    color: colors.white,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    width: '100%',
    maxWidth: 400,
    ...shadows.lg,
  },
  modalTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  modalSubtitle: {
    ...typography.body2,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  formatOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.gray100,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  formatIcon: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  formatIconText: {
    fontSize: 32,
  },
  formatInfo: {
    flex: 1,
  },
  formatTitle: {
    ...typography.body1,
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  formatDescription: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  cancelButton: {
    marginTop: spacing.md,
    padding: spacing.sm,
    alignItems: 'center',
  },
  cancelButtonText: {
    ...typography.button,
    color: colors.textSecondary,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  loadingText: {
    ...typography.body2,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
});
