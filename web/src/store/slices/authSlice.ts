import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { User } from '../../types'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: {
    id: '1',
    email: 'alex.chen@example.com',
    displayName: 'Alex Chen',
    photoURL: undefined,
    bio: 'Passionate about making a difference',
    compassionPoints: 28760,
    totalVolunteerHours: 156,
    badges: [],
    followers: [],
    following: [],
    role: 'user',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  isAuthenticated: true, // Set to true for demo
  loading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      state.isAuthenticated = true
    },
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
  },
})

export const { setUser, logout, setLoading, setError } = authSlice.actions
export default authSlice.reducer
