import { Routes, Route, Navigate } from 'react-router-dom'
import { useAppSelector } from './hooks/redux'
import Layout from './components/Layout'
import SignInPage from './pages/SignInPage'
import DashboardPage from './pages/DashboardPage'
import MissionsPage from './pages/MissionsPage'
import MissionDetailPage from './pages/MissionDetailPage'
import VouchersPage from './pages/VouchersPage'
import ProfilePage from './pages/ProfilePage'
import LeaderboardPage from './pages/LeaderboardPage'

function App() {
  const { isAuthenticated } = useAppSelector((state) => state.auth)

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/signin" element={<SignInPage />} />
        <Route path="*" element={<Navigate to="/signin" replace />} />
      </Routes>
    )
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/missions" element={<MissionsPage />} />
        <Route path="/missions/:id" element={<MissionDetailPage />} />
        <Route path="/vouchers" element={<VouchersPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}

export default App
