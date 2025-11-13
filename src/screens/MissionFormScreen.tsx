import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAppDispatch, useAppSelector } from '../store';
import {
  createMission,
  updateMission,
  deleteMission,
  updateMissionStatus,
  clearError,
} from '../store/slices/adminSlice';
import { MissionForm, MissionFormData } from '../components/MissionForm';
import { Mission, MissionStatus } from '../types';
import { RootStackParamList } from '../navigation/types';
import { colors } from '../theme';

type MissionFormScreenRouteProp = RouteProp<
  RootStackParamList & { MissionForm: { missionId?: string } },
  'MissionForm'
>;

type MissionFormScreenNavigationProp = StackNavigationProp<
  RootStackParamList & { MissionForm: { missionId?: string } }
>;

const MissionFormScreen: React.FC = () => {
  const navigation = useNavigation<MissionFormScreenNavigationProp>();
  const route = useRoute<MissionFormScreenRouteProp>();
  const dispatch = useAppDispatch();

  const { selectedMission, loading, error, uploadProgress } = useAppSelector(
    state => state.admin
  );

  const missionId = route.params?.missionId;
  const isEditMode = !!missionId && !!selectedMission;

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
      dispatch(clearError());
    }
  }, [error]);

  const handleSubmit = async (data: MissionFormData) => {
    try {
      if (isEditMode && selectedMission) {
        // Update existing mission
        await dispatch(
          updateMission({
            missionId: selectedMission.id,
            updates: data,
          })
        ).unwrap();

        Alert.alert('Success', 'Mission updated successfully');
      } else {
        // Create new mission
        await dispatch(createMission(data)).unwrap();

        Alert.alert(
          'Success',
          'Mission created successfully as draft. Publish it to make it visible to users.',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to save mission');
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleDelete = () => {
    if (!selectedMission) return;

    Alert.alert(
      'Delete Mission',
      'Are you sure you want to delete this mission? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(deleteMission(selectedMission.id)).unwrap();
              Alert.alert('Success', 'Mission deleted successfully');
              navigation.goBack();
            } catch (err: any) {
              Alert.alert('Error', err.message || 'Failed to delete mission');
            }
          },
        },
      ]
    );
  };

  const handleStatusChange = (status: MissionStatus) => {
    if (!selectedMission) return;

    const statusLabels: Record<MissionStatus, string> = {
      draft: 'Draft',
      published: 'Published',
      ongoing: 'Ongoing',
      completed: 'Completed',
      cancelled: 'Cancelled',
    };

    Alert.alert(
      'Change Status',
      `Change mission status to ${statusLabels[status]}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: async () => {
            try {
              await dispatch(
                updateMissionStatus({
                  missionId: selectedMission.id,
                  status,
                })
              ).unwrap();

              Alert.alert('Success', `Mission status changed to ${statusLabels[status]}`);
            } catch (err: any) {
              Alert.alert('Error', err.message || 'Failed to update status');
            }
          },
        },
      ]
    );
  };

  // Set navigation options for edit mode
  useEffect(() => {
    if (isEditMode) {
      navigation.setOptions({
        title: 'Edit Mission',
        headerRight: () => (
          <View style={styles.headerButtons}>
            {/* Status change buttons could go here */}
          </View>
        ),
      });
    } else {
      navigation.setOptions({
        title: 'Create Mission',
      });
    }
  }, [isEditMode, navigation]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <MissionForm
        initialData={selectedMission || undefined}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
        uploadProgress={uploadProgress}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  headerButtons: {
    flexDirection: 'row',
    marginRight: 16,
  },
});

export default MissionFormScreen;
