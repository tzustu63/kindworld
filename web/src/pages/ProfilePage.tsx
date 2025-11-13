import { useAppSelector } from '../hooks/redux'
import { Edit, Award, TrendingUp } from 'lucide-react'

export default function ProfilePage() {
  const { user } = useAppSelector((state) => state.auth)
  const { badges } = useAppSelector((state) => state.profile)
  const { leaderboard } = useAppSelector((state) => state.dashboard)

  const userRank = leaderboard.find((entry) => entry.userId === user?.id)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header */}
      <div className="card p-8 mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent to-accent-light flex items-center justify-center text-white text-4xl font-bold">
            {user?.displayName?.charAt(0) || 'U'}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">{user?.displayName}</h1>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Edit size={20} />
              </button>
            </div>
            <p className="text-gray-600 mb-4">{user?.bio || 'No bio yet'}</p>
            <div className="flex flex-wrap gap-6 text-sm">
              <div>
                <span className="font-bold text-2xl">{user?.compassionPoints.toLocaleString()}</span>
                <span className="text-gray-600 ml-2">points</span>
              </div>
              <div>
                <span className="font-bold text-2xl">{user?.followers.length}</span>
                <span className="text-gray-600 ml-2">followers</span>
              </div>
              <div>
                <span className="font-bold text-2xl">{user?.following.length}</span>
                <span className="text-gray-600 ml-2">following</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-2">
            <Award className="text-accent" size={24} />
            <div className="text-sm text-gray-600">Total Hours</div>
          </div>
          <div className="text-3xl font-bold">{user?.totalVolunteerHours}</div>
        </div>
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="text-success" size={24} />
            <div className="text-sm text-gray-600">Rank</div>
          </div>
          <div className="text-3xl font-bold">#{userRank?.rank || '-'}</div>
        </div>
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-2">
            <Award className="text-accent" size={24} />
            <div className="text-sm text-gray-600">Badges</div>
          </div>
          <div className="text-3xl font-bold">{badges.length}</div>
        </div>
      </div>

      {/* Badges Section */}
      <div className="card p-8 mb-8">
        <h2 className="text-2xl font-semibold mb-6">Your Badges</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className="flex flex-col items-center p-4 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className="text-5xl mb-2">{badge.iconUrl}</div>
              <div className="text-sm font-semibold text-center">{badge.name}</div>
              <div className="text-xs text-gray-600 text-center mt-1">
                {badge.description}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 p-4 bg-gray-50 rounded-lg text-center">
          <p className="text-gray-600">
            Completed <span className="font-bold">{user?.totalVolunteerHours}</span> hours of
            volunteering
          </p>
        </div>
      </div>

      {/* Leaderboard Position */}
      <div className="card p-8">
        <h2 className="text-2xl font-semibold mb-6">Leaderboard Position</h2>
        <div className="space-y-2">
          {leaderboard.slice(0, 6).map((entry) => (
            <div
              key={entry.userId}
              className={`flex items-center gap-4 p-4 rounded-xl transition-colors ${
                entry.userId === user?.id ? 'bg-accent/10' : 'hover:bg-gray-50'
              }`}
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
