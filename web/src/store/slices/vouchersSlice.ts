import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Voucher } from '../../types'

interface VouchersState {
  vouchers: Voucher[]
  selectedCategory: string | null
  loading: boolean
}

const mockVouchers: Voucher[] = [
  {
    id: '1',
    brandName: '7-Eleven',
    brandLogo: '🏪',
    title: 'NT$100 Voucher',
    description: 'Redeemable at any 7-Eleven store',
    pointsCost: 1000,
    monetaryValue: 100,
    category: '7-eleven',
    stock: 500,
    termsAndConditions: 'Valid for 90 days from redemption',
    isActive: true,
  },
  {
    id: '2',
    brandName: 'FamilyMart',
    brandLogo: '🏪',
    title: 'NT$100 Voucher',
    description: 'Redeemable at any FamilyMart store',
    pointsCost: 1000,
    monetaryValue: 100,
    category: 'familymart',
    stock: 500,
    termsAndConditions: 'Valid for 90 days from redemption',
    isActive: true,
  },
  {
    id: '3',
    brandName: 'PX Mart',
    brandLogo: '🛒',
    title: 'NT$200 Voucher',
    description: 'Redeemable at any PX Mart store',
    pointsCost: 2000,
    monetaryValue: 200,
    category: 'px-mart',
    stock: 300,
    termsAndConditions: 'Valid for 90 days from redemption',
    isActive: true,
  },
  {
    id: '4',
    brandName: '7-Eleven',
    brandLogo: '🏪',
    title: 'NT$500 Voucher',
    description: 'Redeemable at any 7-Eleven store',
    pointsCost: 4500,
    monetaryValue: 500,
    category: '7-eleven',
    stock: 200,
    termsAndConditions: 'Valid for 90 days from redemption',
    isActive: true,
  },
]

const initialState: VouchersState = {
  vouchers: mockVouchers,
  selectedCategory: null,
  loading: false,
}

const vouchersSlice = createSlice({
  name: 'vouchers',
  initialState,
  reducers: {
    setVouchers: (state, action: PayloadAction<Voucher[]>) => {
      state.vouchers = action.payload
    },
    setSelectedCategory: (state, action: PayloadAction<string | null>) => {
      state.selectedCategory = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
  },
})

export const { setVouchers, setSelectedCategory, setLoading } = vouchersSlice.actions
export default vouchersSlice.reducer
