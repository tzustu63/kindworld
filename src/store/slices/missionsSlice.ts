import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import firestore from '@react-native-firebase/firestore';
import { Mission, MissionCategory } from '../../types';
import { FilterOptions } from '../../components/FilterModal';
import { SortOption } from '../../components/SortModal';

interface MissionsState {
  missions: Mission[];
  favorites: Set<string>;
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  lastDoc: any | null;
  filters: FilterOptions;
  sortBy: SortOption;
}

const initialState: MissionsState = {
  missions: [],
  favorites: new Set(),
  loading: false,
  error: null,
  hasMore: true,
  lastDoc: null,
  filters: {},
  sortBy: 'date',
};

const PAGE_SIZE = 10;

// Fetch missions with filters and pagination
export const fetchMissions = createAsyncThunk(
  'missions/fetchMissions',
  async (
    {
      filters,
      sortBy,
      reset = false,
    }: {
      filters: FilterOptions;
      sortBy: SortOption;
      reset?: boolean;
    },
    { getState }
  ) => {
    const state = getState() as { missions: MissionsState };
    let query = firestore()
      .collection('missions')
      .where('status', '==', 'published');

    // Apply filters
    if (filters.category) {
      query = query.where('category', '==', filters.category);
    }

    if (filters.dateRange) {
      const now = new Date();
      let startDate = new Date();

      switch (filters.dateRange) {
        case 'today':
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          break;
        case 'all':
        default:
          startDate = new Date(0); // Beginning of time
      }

      query = query.where('date', '>=', firestore.Timestamp.fromDate(startDate));
    }

    // Apply sorting
    switch (sortBy) {
      case 'date':
        query = query.orderBy('date', 'asc');
        break;
      case 'relevance':
        query = query.orderBy('pointsReward', 'desc');
        break;
      case 'distance':
        // For distance sorting, we would need geolocation queries
        // For now, default to date sorting
        query = query.orderBy('date', 'asc');
        break;
    }

    // Pagination
    if (!reset && state.missions.lastDoc) {
      query = query.startAfter(state.missions.lastDoc);
    }

    query = query.limit(PAGE_SIZE);

    const snapshot = await query.get();
    const missions: Mission[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Mission[];

    const lastDoc = snapshot.docs[snapshot.docs.length - 1] || null;
    const hasMore = snapshot.docs.length === PAGE_SIZE;

    return { missions, lastDoc, hasMore, reset };
  }
);

// Fetch a single mission by ID
export const fetchMissionById = createAsyncThunk(
  'missions/fetchMissionById',
  async (missionId: string) => {
    const doc = await firestore().collection('missions').doc(missionId).get();

    if (!doc.exists) {
      throw new Error('Mission not found');
    }

    return {
      id: doc.id,
      ...doc.data(),
    } as Mission;
  }
);

// Toggle favorite status
export const toggleFavorite = createAsyncThunk(
  'missions/toggleFavorite',
  async (missionId: string, { getState }) => {
    const state = getState() as { missions: MissionsState; auth: any };
    const userId = state.auth.user?.id;

    if (!userId) {
      throw new Error('User not authenticated');
    }

    const isFavorite = state.missions.favorites.has(missionId);
    const userRef = firestore().collection('users').doc(userId);

    if (isFavorite) {
      await userRef.update({
        favoriteMissions: firestore.FieldValue.arrayRemove(missionId),
      });
    } else {
      await userRef.update({
        favoriteMissions: firestore.FieldValue.arrayUnion(missionId),
      });
    }

    return { missionId, isFavorite: !isFavorite };
  }
);

// Load user's favorite missions
export const loadFavorites = createAsyncThunk(
  'missions/loadFavorites',
  async (_, { getState }) => {
    const state = getState() as { auth: any };
    const userId = state.auth.user?.id;

    if (!userId) {
      return [];
    }

    const userDoc = await firestore().collection('users').doc(userId).get();
    const userData = userDoc.data();

    return (userData?.favoriteMissions || []) as string[];
  }
);

const missionsSlice = createSlice({
  name: 'missions',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<FilterOptions>) => {
      state.filters = action.payload;
    },
    setSortBy: (state, action: PayloadAction<SortOption>) => {
      state.sortBy = action.payload;
    },
    clearMissions: state => {
      state.missions = [];
      state.lastDoc = null;
      state.hasMore = true;
    },
    clearError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      // Fetch missions
      .addCase(fetchMissions.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMissions.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.reset) {
          state.missions = action.payload.missions;
        } else {
          state.missions = [...state.missions, ...action.payload.missions];
        }
        state.lastDoc = action.payload.lastDoc;
        state.hasMore = action.payload.hasMore;
      })
      .addCase(fetchMissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch missions';
      })
      // Fetch mission by ID
      .addCase(fetchMissionById.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMissionById.fulfilled, (state, action) => {
        state.loading = false;
        // Update or add the mission to the list
        const index = state.missions.findIndex(m => m.id === action.payload.id);
        if (index !== -1) {
          state.missions[index] = action.payload;
        } else {
          state.missions.unshift(action.payload);
        }
      })
      .addCase(fetchMissionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch mission';
      })
      // Toggle favorite
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        if (action.payload.isFavorite) {
          state.favorites.add(action.payload.missionId);
        } else {
          state.favorites.delete(action.payload.missionId);
        }
      })
      // Load favorites
      .addCase(loadFavorites.fulfilled, (state, action) => {
        state.favorites = new Set(action.payload);
      });
  },
});

export const { setFilters, setSortBy, clearMissions, clearError } =
  missionsSlice.actions;

export default missionsSlice.reducer;
