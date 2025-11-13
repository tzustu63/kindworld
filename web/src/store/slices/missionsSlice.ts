import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Mission } from '../../types'

interface MissionsState {
  missions: Mission[]
  selectedMission: Mission | null
  filters: {
    category?: string
    location?: string
    date?: string
  }
  sortBy: 'date' | 'relevance' | 'distance'
  loading: boolean
}

const mockMissions: Mission[] = [
  {
    id: '1',
    title: 'Beach Cleanup Drive',
    description: 'Join us for a community beach cleanup event. Help protect marine life and keep our beaches beautiful.',
    imageUrls: ['https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=800'],
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    location: {
      address: '123 Beach Road',
      city: 'Taipei City',
      coordinates: { lat: 25.0330, lng: 121.5654 },
    },
    pointsReward: 500,
    category: 'volunteer',
    maxParticipants: 50,
    currentParticipants: 32,
    status: 'published',
    createdBy: 'admin1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Food Bank Volunteer',
    description: 'Help sort and distribute food to families in need. Make a direct impact in your community.',
    imageUrls: ['https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800'],
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    location: {
      address: '456 Community Center',
      city: 'Taipei City',
      coordinates: { lat: 25.0478, lng: 121.5318 },
    },
    pointsReward: 750,
    category: 'charity',
    maxParticipants: 30,
    currentParticipants: 18,
    status: 'published',
    createdBy: 'admin1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Blood Donation Drive',
    description: 'Donate blood and save lives. Every donation can help up to three people in need.',
    imageUrls: ['https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=800'],
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    location: {
      address: '789 Medical Center',
      city: 'Taipei City',
      coordinates: { lat: 25.0420, lng: 121.5200 },
    },
    pointsReward: 1000,
    category: 'blood_drive',
    maxParticipants: 100,
    currentParticipants: 67,
    status: 'published',
    createdBy: 'admin1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

const initialState: MissionsState = {
  missions: mockMissions,
  selectedMission: null,
  filters: {},
  sortBy: 'date',
  loading: false,
}

const missionsSlice = createSlice({
  name: 'missions',
  initialState,
  reducers: {
    setMissions: (state, action: PayloadAction<Mission[]>) => {
      state.missions = action.payload
    },
    setSelectedMission: (state, action: PayloadAction<Mission | null>) => {
      state.selectedMission = action.payload
    },
    setFilters: (state, action: PayloadAction<typeof initialState.filters>) => {
      state.filters = action.payload
    },
    setSortBy: (state, action: PayloadAction<typeof initialState.sortBy>) => {
      state.sortBy = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
  },
})

export const { setMissions, setSelectedMission, setFilters, setSortBy, setLoading } = missionsSlice.actions
export default missionsSlice.reducer
