import { useAppSelector } from '../hooks/redux'
import { Link } from 'react-router-dom'
import { MapPin, Calendar, Users } from 'lucide-react'

export default function MissionsPage() {
  const { missions } = useAppSelector((state) => state.missions)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Discover Missions</h1>
        <p className="text-gray-600">
          Find volunteer opportunities that match your interests and make a difference
        </p>
      </div>

      {/* Search and Filters */}
      <div className="card p-4 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search missions..."
            className="input flex-1"
          />
          <button className="btn btn-secondary">
            Filter
          </button>
          <button className="btn btn-secondary">
            Sort
          </button>
        </div>
        <div className="mt-4 text-sm text-gray-600">
          {missions.length} missions available
        </div>
      </div>

      {/* Missions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {missions.map((mission) => (
          <Link
            key={mission.id}
            to={`/missions/${mission.id}`}
            className="card overflow-hidden hover:shadow-card-hover transition-shadow"
          >
            <div className="aspect-video bg-gradient-to-br from-accent/20 to-accent-light/20 relative overflow-hidden">
              {mission.imageUrls[0] ? (
                <img
                  src={mission.imageUrls[0]}
                  alt={mission.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl">
                  🌟
                </div>
              )}
              <div className="absolute top-4 right-4 bg-black text-white px-3 py-1 rounded-full text-sm font-semibold">
                +{mission.pointsReward} pts
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{mission.title}</h3>
              <p className="text-gray-600 mb-4 line-clamp-2">{mission.description}</p>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>{new Date(mission.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} />
                  <span>{mission.location.city}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={16} />
                  <span>
                    {mission.currentParticipants}
                    {mission.maxParticipants && `/${mission.maxParticipants}`} participants
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
