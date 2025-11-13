import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { Mission, MissionStatus } from '../../types';

export interface MissionInput {
  title: string;
  description: string;
  date: Date;
  location: {
    address: string;
    city: string;
    latitude: number;
    longitude: number;
  };
  pointsReward: number;
  category: string;
  maxParticipants?: number;
  sponsorId?: string;
  imageUris?: string[]; // Local URIs for upload
}

export interface MissionParticipant {
  userId: string;
  displayName: string;
  photoURL?: string;
  joinedAt: Date;
  completedAt?: Date;
  status: 'joined' | 'completed' | 'cancelled';
}

export interface MissionAnalytics {
  missionId: string;
  totalParticipants: number;
  completedParticipants: number;
  totalPointsAwarded: number;
  engagementRate: number;
}

interface AdminState {
  missions: Mission[];
  selectedMission: Mission | null;
  participants: Record<string, MissionParticipant[]>;
  analytics: Record<string, MissionAnalytics>;
  loading: boolean;
  error: string | null;
  uploadProgress: number;
}

const initialState: AdminState = {
  missions: [],
  selectedMission: null,
  participants: {},
  analytics: {},
  loading: false,
  error: null,
  uploadProgress: 0,
};

// Fetch all missions (admin view - includes all statuses)
export const fetchAllMissions = createAsyncThunk(
  'admin/fetchAllMissions',
  async (_, { getState }) => {
    const state = getState() as { auth: any };
    const userId = state.auth.user?.id;

    if (!userId) {
      throw new Error('User not authenticated');
    }

    const snapshot = await firestore()
      .collection('missions')
      .where('createdBy', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();

    const missions: Mission[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Mission[];

    return missions;
  }
);

// Upload images to Firebase Storage
const uploadImages = async (
  imageUris: string[],
  missionId: string,
  onProgress?: (progress: number) => void
): Promise<string[]> => {
  const uploadPromises = imageUris.map(async (uri, index) => {
    const filename = `missions/${missionId}/${Date.now()}_${index}.jpg`;
    const reference = storage().ref(filename);
    
    const task = reference.putFile(uri);
    
    if (onProgress) {
      task.on('state_changed', snapshot => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress(progress / imageUris.length + (index / imageUris.length) * 100);
      });
    }
    
    await task;
    return await reference.getDownloadURL();
  });

  return Promise.all(uploadPromises);
};

// Create a new mission
export const createMission = createAsyncThunk(
  'admin/createMission',
  async (missionInput: MissionInput, { getState, dispatch }) => {
    const state = getState() as { auth: any };
    const userId = state.auth.user?.id;

    if (!userId) {
      throw new Error('User not authenticated');
    }

    // Create mission document first to get ID
    const missionRef = firestore().collection('missions').doc();
    const missionId = missionRef.id;

    // Upload images if provided
    let imageUrls: string[] = [];
    if (missionInput.imageUris && missionInput.imageUris.length > 0) {
      imageUrls = await uploadImages(
        missionInput.imageUris,
        missionId,
        (progress) => {
          dispatch(setUploadProgress(progress));
        }
      );
    }

    // Create mission data
    const missionData = {
      title: missionInput.title,
      description: missionInput.description,
      imageUrls,
      date: firestore.Timestamp.fromDate(missionInput.date),
      location: {
        address: missionInput.location.address,
        city: missionInput.location.city,
        coordinates: new firestore.GeoPoint(
          missionInput.location.latitude,
          missionInput.location.longitude
        ),
      },
      pointsReward: missionInput.pointsReward,
      category: missionInput.category,
      sponsorId: missionInput.sponsorId || null,
      maxParticipants: missionInput.maxParticipants || null,
      currentParticipants: 0,
      status: 'draft' as MissionStatus,
      createdBy: userId,
      createdAt: firestore.FieldValue.serverTimestamp(),
      updatedAt: firestore.FieldValue.serverTimestamp(),
    };

    await missionRef.set(missionData);

    return {
      id: missionId,
      ...missionData,
      createdAt: firestore.Timestamp.now(),
      updatedAt: firestore.Timestamp.now(),
    } as Mission;
  }
);

// Update an existing mission
export const updateMission = createAsyncThunk(
  'admin/updateMission',
  async (
    { missionId, updates }: { missionId: string; updates: Partial<MissionInput> },
    { getState, dispatch }
  ) => {
    const state = getState() as { auth: any };
    const userId = state.auth.user?.id;

    if (!userId) {
      throw new Error('User not authenticated');
    }

    const missionRef = firestore().collection('missions').doc(missionId);
    const missionDoc = await missionRef.get();

    if (!missionDoc.exists) {
      throw new Error('Mission not found');
    }

    const missionData = missionDoc.data();
    if (missionData?.createdBy !== userId) {
      throw new Error('Unauthorized to update this mission');
    }

    // Upload new images if provided
    let imageUrls = missionData?.imageUrls || [];
    if (updates.imageUris && updates.imageUris.length > 0) {
      const newImageUrls = await uploadImages(
        updates.imageUris,
        missionId,
        (progress) => {
          dispatch(setUploadProgress(progress));
        }
      );
      imageUrls = [...imageUrls, ...newImageUrls];
    }

    // Prepare update data
    const updateData: any = {
      updatedAt: firestore.FieldValue.serverTimestamp(),
    };

    if (updates.title) updateData.title = updates.title;
    if (updates.description) updateData.description = updates.description;
    if (updates.date) updateData.date = firestore.Timestamp.fromDate(updates.date);
    if (updates.location) {
      updateData.location = {
        address: updates.location.address,
        city: updates.location.city,
        coordinates: new firestore.GeoPoint(
          updates.location.latitude,
          updates.location.longitude
        ),
      };
    }
    if (updates.pointsReward !== undefined) updateData.pointsReward = updates.pointsReward;
    if (updates.category) updateData.category = updates.category;
    if (updates.maxParticipants !== undefined) updateData.maxParticipants = updates.maxParticipants;
    if (updates.sponsorId !== undefined) updateData.sponsorId = updates.sponsorId;
    if (imageUrls.length > 0) updateData.imageUrls = imageUrls;

    await missionRef.update(updateData);

    const updatedDoc = await missionRef.get();
    return {
      id: missionId,
      ...updatedDoc.data(),
    } as Mission;
  }
);

// Delete a mission
export const deleteMission = createAsyncThunk(
  'admin/deleteMission',
  async (missionId: string, { getState }) => {
    const state = getState() as { auth: any };
    const userId = state.auth.user?.id;

    if (!userId) {
      throw new Error('User not authenticated');
    }

    const missionRef = firestore().collection('missions').doc(missionId);
    const missionDoc = await missionRef.get();

    if (!missionDoc.exists) {
      throw new Error('Mission not found');
    }

    const missionData = missionDoc.data();
    if (missionData?.createdBy !== userId) {
      throw new Error('Unauthorized to delete this mission');
    }

    // Delete images from storage
    if (missionData?.imageUrls && missionData.imageUrls.length > 0) {
      const deletePromises = missionData.imageUrls.map((url: string) => {
        try {
          const ref = storage().refFromURL(url);
          return ref.delete();
        } catch (error) {
          console.error('Error deleting image:', error);
          return Promise.resolve();
        }
      });
      await Promise.all(deletePromises);
    }

    await missionRef.delete();

    return missionId;
  }
);

// Update mission status
export const updateMissionStatus = createAsyncThunk(
  'admin/updateMissionStatus',
  async (
    { missionId, status }: { missionId: string; status: MissionStatus },
    { getState }
  ) => {
    const state = getState() as { auth: any };
    const userId = state.auth.user?.id;

    if (!userId) {
      throw new Error('User not authenticated');
    }

    const missionRef = firestore().collection('missions').doc(missionId);
    const missionDoc = await missionRef.get();

    if (!missionDoc.exists) {
      throw new Error('Mission not found');
    }

    const missionData = missionDoc.data();
    if (missionData?.createdBy !== userId) {
      throw new Error('Unauthorized to update this mission');
    }

    await missionRef.update({
      status,
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });

    return { missionId, status };
  }
);

// Fetch mission participants
export const fetchMissionParticipants = createAsyncThunk(
  'admin/fetchMissionParticipants',
  async (missionId: string) => {
    const snapshot = await firestore()
      .collection('missions')
      .doc(missionId)
      .collection('participants')
      .orderBy('joinedAt', 'desc')
      .get();

    const participants: MissionParticipant[] = snapshot.docs.map(doc => ({
      userId: doc.id,
      ...doc.data(),
      joinedAt: doc.data().joinedAt?.toDate(),
      completedAt: doc.data().completedAt?.toDate(),
    })) as MissionParticipant[];

    return { missionId, participants };
  }
);

// Fetch mission analytics
export const fetchMissionAnalytics = createAsyncThunk(
  'admin/fetchMissionAnalytics',
  async (missionId: string) => {
    const missionDoc = await firestore().collection('missions').doc(missionId).get();
    
    if (!missionDoc.exists) {
      throw new Error('Mission not found');
    }

    const participantsSnapshot = await firestore()
      .collection('missions')
      .doc(missionId)
      .collection('participants')
      .get();

    const totalParticipants = participantsSnapshot.size;
    const completedParticipants = participantsSnapshot.docs.filter(
      doc => doc.data().status === 'completed'
    ).length;

    const missionData = missionDoc.data();
    const totalPointsAwarded = completedParticipants * (missionData?.pointsReward || 0);
    const engagementRate = totalParticipants > 0 
      ? (completedParticipants / totalParticipants) * 100 
      : 0;

    const analytics: MissionAnalytics = {
      missionId,
      totalParticipants,
      completedParticipants,
      totalPointsAwarded,
      engagementRate,
    };

    return analytics;
  }
);

// Bulk update mission status
export const bulkUpdateMissionStatus = createAsyncThunk(
  'admin/bulkUpdateMissionStatus',
  async (
    { missionIds, status }: { missionIds: string[]; status: MissionStatus },
    { getState }
  ) => {
    const state = getState() as { auth: any };
    const userId = state.auth.user?.id;

    if (!userId) {
      throw new Error('User not authenticated');
    }

    const batch = firestore().batch();

    for (const missionId of missionIds) {
      const missionRef = firestore().collection('missions').doc(missionId);
      batch.update(missionRef, {
        status,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
    }

    await batch.commit();

    return { missionIds, status };
  }
);

// Bulk delete missions
export const bulkDeleteMissions = createAsyncThunk(
  'admin/bulkDeleteMissions',
  async (missionIds: string[], { getState }) => {
    const state = getState() as { auth: any };
    const userId = state.auth.user?.id;

    if (!userId) {
      throw new Error('User not authenticated');
    }

    const batch = firestore().batch();

    for (const missionId of missionIds) {
      const missionRef = firestore().collection('missions').doc(missionId);
      batch.delete(missionRef);
    }

    await batch.commit();

    return missionIds;
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setSelectedMission: (state, action: PayloadAction<Mission | null>) => {
      state.selectedMission = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setUploadProgress: (state, action: PayloadAction<number>) => {
      state.uploadProgress = action.payload;
    },
    resetUploadProgress: (state) => {
      state.uploadProgress = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all missions
      .addCase(fetchAllMissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllMissions.fulfilled, (state, action) => {
        state.loading = false;
        state.missions = action.payload;
      })
      .addCase(fetchAllMissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch missions';
      })
      // Create mission
      .addCase(createMission.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.uploadProgress = 0;
      })
      .addCase(createMission.fulfilled, (state, action) => {
        state.loading = false;
        state.missions.unshift(action.payload);
        state.uploadProgress = 0;
      })
      .addCase(createMission.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create mission';
        state.uploadProgress = 0;
      })
      // Update mission
      .addCase(updateMission.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.uploadProgress = 0;
      })
      .addCase(updateMission.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.missions.findIndex(m => m.id === action.payload.id);
        if (index !== -1) {
          state.missions[index] = action.payload;
        }
        if (state.selectedMission?.id === action.payload.id) {
          state.selectedMission = action.payload;
        }
        state.uploadProgress = 0;
      })
      .addCase(updateMission.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update mission';
        state.uploadProgress = 0;
      })
      // Delete mission
      .addCase(deleteMission.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMission.fulfilled, (state, action) => {
        state.loading = false;
        state.missions = state.missions.filter(m => m.id !== action.payload);
        if (state.selectedMission?.id === action.payload) {
          state.selectedMission = null;
        }
      })
      .addCase(deleteMission.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete mission';
      })
      // Update mission status
      .addCase(updateMissionStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMissionStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.missions.findIndex(m => m.id === action.payload.missionId);
        if (index !== -1) {
          state.missions[index].status = action.payload.status;
        }
        if (state.selectedMission?.id === action.payload.missionId) {
          state.selectedMission.status = action.payload.status;
        }
      })
      .addCase(updateMissionStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update mission status';
      })
      // Fetch participants
      .addCase(fetchMissionParticipants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMissionParticipants.fulfilled, (state, action) => {
        state.loading = false;
        state.participants[action.payload.missionId] = action.payload.participants;
      })
      .addCase(fetchMissionParticipants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch participants';
      })
      // Fetch analytics
      .addCase(fetchMissionAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMissionAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.analytics[action.payload.missionId] = action.payload;
      })
      .addCase(fetchMissionAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch analytics';
      })
      // Bulk update status
      .addCase(bulkUpdateMissionStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bulkUpdateMissionStatus.fulfilled, (state, action) => {
        state.loading = false;
        action.payload.missionIds.forEach(missionId => {
          const index = state.missions.findIndex(m => m.id === missionId);
          if (index !== -1) {
            state.missions[index].status = action.payload.status;
          }
        });
      })
      .addCase(bulkUpdateMissionStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to bulk update missions';
      })
      // Bulk delete
      .addCase(bulkDeleteMissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bulkDeleteMissions.fulfilled, (state, action) => {
        state.loading = false;
        state.missions = state.missions.filter(
          m => !action.payload.includes(m.id)
        );
      })
      .addCase(bulkDeleteMissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to bulk delete missions';
      });
  },
});

export const { setSelectedMission, clearError, setUploadProgress, resetUploadProgress } = adminSlice.actions;

export default adminSlice.reducer;
