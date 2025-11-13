import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { LeaderboardEntry, PointsHistory } from '../../types'

interface DashboardState {
  pointsHistory: PointsHistory[]
  leaderboard: LeaderboardEntry[]
  selectedMonth: string
  loading: boolean
}

const generatePointsHistory = (): PointsHistory[] => {
  const history: PointsHistory[] = []
  const basePoints = 20000
  for (let i = 30; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    history.push({
      date: date.toISOString().split('T')[0],
      points: basePoints + Math.floor(Math.random() * 10000) + (30 - i) * 300,
    })
  }
  return history
}

const initialState: DashboardState = {
  pointsHistory: generatePointsHistory(),
  leaderboard: [
    {
      userId: '2',
      displayName: 'Sarah Martinez',
      compassionPoints: 45230,
      rank: 1,
      change: 0,
    },
    {
      userId: '3',
      displayName: 'James Chen',
      compassionPoints: 42180,
      rank: 2,
      change: 1,
    },
    {
      userId: '4',
      displayName: 'Emma Patel',
      compassionPoints: 38950,
      rank: 3,
      change: -1,
    },
    {
      userId: '1',
      displayName: 'Alex Chen',
      compassionPoints: 28760,
      rank: 4,
      change: 2,
    },
    {
      userId: '5',
      displayName: 'Maria Johnson',
      compassionPoints: 26420,
      rank: 5,
      change: 0,
    },
  ],
  selectedMonth: 'Oct 2025',
  loading: false,
}

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setSelectedMonth: (state, action: PayloadAction<string>) => {
      state.selectedMonth = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
  },
})

export const { setSelectedMonth, setLoading } = dashboardSlice.actions
export default dashboardSlice.reducer
