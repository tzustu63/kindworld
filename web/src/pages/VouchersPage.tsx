import { useAppSelector } from '../hooks/redux'
import { Ticket } from 'lucide-react'

export default function VouchersPage() {
  const { vouchers } = useAppSelector((state) => state.vouchers)
  const { user } = useAppSelector((state) => state.auth)

  const categories = [
    { id: '7-eleven', name: '7-Eleven', icon: '🏪' },
    { id: 'familymart', name: 'FamilyMart', icon: '🏪' },
    { id: 'px-mart', name: 'PX Mart', icon: '🛒' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Voucher Store</h1>
        <p className="text-gray-600">
          Redeem your Compassion Points for rewards from partner retailers
        </p>
      </div>

      {/* Points Balance */}
      <div className="card p-6 mb-8 bg-gradient-to-br from-accent/10 to-accent-light/10">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-600 mb-1">Your Balance</div>
            <div className="text-3xl font-bold">
              {user?.compassionPoints.toLocaleString()} points
            </div>
          </div>
          <Ticket size={48} className="text-accent" />
        </div>
      </div>

      {/* Categories */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Categories</h2>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category.id}
              className="flex flex-col items-center gap-2 p-4 card min-w-[120px] hover:shadow-card-hover transition-shadow"
            >
              <div className="text-4xl">{category.icon}</div>
              <div className="text-sm font-medium">{category.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Vouchers Grid */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Available Vouchers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {vouchers.map((voucher) => (
            <div key={voucher.id} className="card overflow-hidden">
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-6xl">
                {voucher.brandLogo}
              </div>
              <div className="p-4">
                <div className="text-sm text-gray-600 mb-1">{voucher.brandName}</div>
                <h3 className="font-semibold mb-2">{voucher.title}</h3>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-accent">
                    {voucher.pointsCost.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">points</div>
                </div>
                <button
                  className={`btn w-full mt-4 ${
                    (user?.compassionPoints || 0) >= voucher.pointsCost
                      ? 'btn-primary'
                      : 'btn-secondary opacity-50 cursor-not-allowed'
                  }`}
                  disabled={(user?.compassionPoints || 0) < voucher.pointsCost}
                >
                  {(user?.compassionPoints || 0) >= voucher.pointsCost
                    ? 'Redeem'
                    : 'Insufficient Points'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
