import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Badge } from '../../types'

interface ProfileState {
  badges: Badge[]
  loading: boolean
}

const mockBadges: Badge[] = [
  {
    id: '1',
    name: 'First Steps',
    description: 'Completed your first mission',
    iconUrl: '🌟',
    criteria: { type: 'missions', threshold: 1 },
    rarity: 'common',
  },
  {
    id: '2',
    name: 'Dedicated Volunteer',
    description: 'Completed 50 hours of volunteering',
    iconUrl: '⭐',
    criteria: { type: 'hours', threshold: 50 },
    rarity: 'rare',
  },
  {
    id: '3',
    name: 'Point Master',
    description: 'Earned 25,000 Compassion Points',
    iconUrl: '💎',
    criteria: { type: 'points', threshold: 25000 },
    rarity: 'epic',
  },
]

const initialState: ProfileState = {
  badges: mockBadges,
  loading: false,
}

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setBadges: (state, action: PayloadAction<Badge[]>) => {
      state.badges = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
  },
})

export const { setBadges, setLoading } = profileSlice.actions
export default profileSlice.reducer
