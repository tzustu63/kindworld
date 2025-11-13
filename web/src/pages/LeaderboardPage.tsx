import { useAppSelector } from '../hooks/redux'
import { Trophy, TrendingUp, TrendingDown } from 'lucide-react'

export default function LeaderboardPage() {
  const { leaderboard } = useAppSelector((state) => state.dashboard)
  const { user } = useAppSelector((state) => state.auth)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Leaderboard</h1>
        <p className="text-gray-600">
          See how you rank among other volunteers in the community
        </p>
      </div>

      {/* Top 3 Podium */}
      <div className="card p-8 mb-8">
        <div className="flex items-end justify-center gap-4 mb-8">
          {/* 2nd Place */}
          {leaderboard[1] && (
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-white text-2xl font-bold mb-2">
                {leaderboard[1].displayName.charAt(0)}
              </div>
              <div className="text-4xl mb-2">🥈</div>
              <div className="font-semibold text-center">{leaderboard[1].displayName}</div>
              <div className="text-sm text-gray-600">
                {leaderboard[1].compassionPoints.toLocaleString()} pts
              </div>
            </div>
          )}

          {/* 1st Place */}
          {leaderboard[0] && (
            <div className="flex flex-col items-center -mt-8">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-white text-3xl font-bold mb-2">
                {leaderboard[0].displayName.charAt(0)}
              </div>
              <div className="text-5xl mb-2">🏆</div>
              <div className="font-bold text-lg text-center">{leaderboard[0].displayName}</div>
              <div className="text-sm text-gray-600">
                {leaderboard[0].compassionPoints.toLocaleString()} pts
              </div>
            </div>
          )}

          {/* 3rd Place */}
          {leaderboard[2] && (
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-300 to-orange-500 flex items-center justify-center text-white text-2xl font-bold mb-2">
                {leaderboard[2].displayName.charAt(0)}
              </div>
              <div className="text-4xl mb-2">🥉</div>
              <div className="font-semibold text-center">{leaderboard[2].displayName}</div>
              <div className="text-sm text-gray-600">
                {leaderboard[2].compassionPoints.toLocaleString()} pts
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Full Leaderboard */}
      <div className="card p-8">
        <h2 className="text-2xl font-semibold mb-6">All Rankings</h2>
        <div className="space-y-2">
          {leaderboard.map((entry) => (
            <div
              key={entry.userId}
              className={`flex items-center gap-4 p-4 rounded-xl transition-colors ${
                entry.userId === user?.id
                  ? 'bg-accent/10 border-2 border-accent'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3 min-w-[80px]">
                <div
                  className={`text-2xl font-bold ${
                    entry.rank === 1
                      ? 'text-yellow-500'
                      : entry.rank === 2
                      ? 'text-gray-400'
                      : entry.rank === 3
                      ? 'text-orange-500'
                      : 'text-gray-400'
                  }`}
                >
                  {entry.rank}
                </div>
                {entry.rank <= 3 && (
                  <Trophy
                    size={20}
                    className={
                      entry.rank === 1
                        ? 'text-yellow-500'
                        : entry.rank === 2
                        ? 'text-gray-400'
                        : 'text-orange-500'
                    }
                  />
                )}
              </div>

              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-accent to-accent-light flex items-center justify-center text-white font-semibold text-lg">
                {entry.displayName.charAt(0)}
              </div>

              <div className="flex-1">
                <div className="font-semibold text-lg">
                  {entry.displayName}
                  {entry.userId === user?.id && (
                    <span className="ml-2 text-sm text-accent">(You)</span>
                  )}
                </div>
                <div className="text-sm text-gray-600">
                  {entry.compassionPoints.toLocaleString()} Compassion Points
                </div>
              </div>

              {entry.change !== 0 && (
                <div
                  className={`flex items-center gap-1 ${
                    entry.change > 0 ? 'text-success' : 'text-error'
                  }`}
                >
                  {entry.change > 0 ? (
                    <TrendingUp size={20} />
                  ) : (
                    <TrendingDown size={20} />
                  )}
                  <span className="font-semibold">{Math.abs(entry.change)}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
