import { useAppSelector, useAppDispatch } from '../hooks/redux'
import { setSelectedMonth } from '../store/slices/dashboardSlice'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function DashboardPage() {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const { pointsHistory, leaderboard, selectedMonth } = useAppSelector((state) => state.dashboard)

  const months = ['Dec 2025', 'Nov 2025', 'Oct 2025', 'Sept 2025', 'Aug 2025']

  const currentPoints = user?.compassionPoints || 0
  const growthPercentage = 20

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Month Selector */}
      <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
        {months.map((month) => (
          <button
            key={month}
            onClick={() => dispatch(setSelectedMonth(month))}
            className={`px-6 py-2 rounded-full whitespace-nowrap transition-all ${
              selectedMonth === month
                ? 'bg-black text-white'
                : 'bg-white border-2 border-gray-200 hover:border-accent'
            }`}
          >
            {month}
          </button>
        ))}
      </div>

      {/* Points Card */}
      <div className="card p-8 mb-8">
        <div className="text-6xl font-bold mb-2">{currentPoints.toLocaleString()}</div>
        <div className="text-xl text-gray-600 mb-4">Compassion Points</div>
        <div className="flex items-center gap-2 text-success font-semibold mb-4">
          <TrendingUp size={20} />
          <span>+{growthPercentage}% month over month</span>
        </div>
        <Link to="/vouchers" className="text-accent font-semibold text-lg hover:underline">
          Exchange Now! →
        </Link>
      </div>

      {/* Points Chart */}
      <div className="card p-8 mb-8">
        <h2 className="text-2xl font-semibold mb-6">Points Statement</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={pointsHistory}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tickFormatter={(date) => new Date(date).getDate().toString()}
              stroke="#757575"
            />
            <YAxis stroke="#757575" />
            <Tooltip
              formatter={(value: number) => [value.toLocaleString(), 'Points']}
              labelFormatter={(date) => new Date(date).toLocaleDateString()}
            />
            <Line
              type="monotone"
              dataKey="points"
              stroke="#4A90E2"
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Leaderboard */}
      <div className="card p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Leaderboard</h2>
          <Link to="/leaderboard" className="text-accent font-semibold hover:underline">
            View All
          </Link>
        </div>
        <div className="space-y-2">
          {leaderboard.slice(0, 5).map((entry) => (
            <div
              key={entry.userId}
              className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div
                className={`text-xl font-bold min-w-[40px] ${
                  entry.rank <= 3 ? 'text-yellow-500' : 'text-gray-400'
                }`}
              >
                {entry.rank}
              </div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-accent-light flex items-center justify-center text-white font-semibold">
                {entry.displayName.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="font-semibold">
                  {entry.displayName}
                  {entry.userId === user?.id && ' (You)'}
                </div>
                <div className="text-sm text-gray-600">
                  {entry.compassionPoints.toLocaleString()} points
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
