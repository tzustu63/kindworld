import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useAppSelector } from '../hooks/redux'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()
  const { user } = useAppSelector((state) => state.auth)

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/missions', label: 'Missions' },
    { path: '/vouchers', label: 'Vouchers' },
    { path: '/leaderboard', label: 'Leaderboard' },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-semibold text-black">
            KindWorld
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-medium transition-colors ${
                  isActive(link.path)
                    ? 'text-black'
                    : 'text-gray-600 hover:text-accent'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/profile"
              className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent-light flex items-center justify-center text-white font-semibold"
            >
              {user?.displayName?.charAt(0) || 'U'}
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2 rounded-lg font-medium transition-colors ${
                  isActive(link.path)
                    ? 'bg-black text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  )
}
