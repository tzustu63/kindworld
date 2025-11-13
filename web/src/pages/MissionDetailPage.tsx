import { useParams, useNavigate } from 'react-router-dom'
import { useAppSelector } from '../hooks/redux'
import { MapPin, Calendar, Users, ArrowLeft } from 'lucide-react'

export default function MissionDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { missions } = useAppSelector((state) => state.missions)
  
  const mission = missions.find((m) => m.id === id)

  if (!mission) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <p>Mission not found</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-black mb-6"
      >
        <ArrowLeft size={20} />
        Back
      </button>

      <div className="card overflow-hidden">
        <div className="aspect-video bg-gradient-to-br from-accent/20 to-accent-light/20 relative">
          {mission.imageUrls[0] ? (
            <img
              src={mission.imageUrls[0]}
              alt={mission.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl">
              🌟
            </div>
          )}
        </div>

        <div className="p-8">
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-3xl font-bold">{mission.title}</h1>
            <div className="bg-black text-white px-4 py-2 rounded-full font-semibold">
              +{mission.pointsReward} pts
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Calendar className="text-accent" size={24} />
              <div>
                <div className="text-sm text-gray-600">Date</div>
                <div className="font-semibold">
                  {new Date(mission.date).toLocaleDateString()}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <MapPin className="text-accent" size={24} />
              <div>
                <div className="text-sm text-gray-600">Location</div>
                <div className="font-semibold">{mission.location.city}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Users className="text-accent" size={24} />
              <div>
                <div className="text-sm text-gray-600">Participants</div>
                <div className="font-semibold">
                  {mission.currentParticipants}
                  {mission.maxParticipants && `/${mission.maxParticipants}`}
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">About this mission</h2>
            <p className="text-gray-700 leading-relaxed">{mission.description}</p>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Location</h2>
            <p className="text-gray-700">{mission.location.address}</p>
            <p className="text-gray-700">{mission.location.city}</p>
          </div>

          <button className="btn btn-primary w-full md:w-auto px-12">
            Join Mission
          </button>
        </div>
      </div>
    </div>
  )
}
