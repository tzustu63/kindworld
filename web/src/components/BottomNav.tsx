import { Link, useLocation } from 'react-router-dom'
import { Home, Search, Activity, User } from 'lucide-react'

export default function BottomNav() {
  const location = useLocation()

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/missions', icon: Search, label: 'Missions' },
    { path: '/vouchers', icon: Activity, label: 'Vouchers' },
    { path: '/profile', icon: User, label: 'Profile' },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
      <div className="flex justify-around items-center h-16">
        {navItems.map(({ path, icon: Icon, label }) => (
          <Link
            key={path}
            to={path}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              isActive(path) ? 'text-black' : 'text-gray-400'
            }`}
          >
            <Icon size={24} />
            <span className="text-xs mt-1">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}
