import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import firestore from '@react-native-firebase/firestore';
import { Voucher, Redemption, VoucherCategory } from '../../types';

interface VouchersState {
  vouchers: Voucher[];
  redemptions: Redemption[];
  selectedCategory: VoucherCategory | 'all';
  loading: boolean;
  error: string | null;
  redeeming: boolean;
  redemptionError: string | null;
}

const initialState: VouchersState = {
  vouchers: [],
  redemptions: [],
  selectedCategory: 'all',
  loading: false,
  error: null,
  redeeming: false,
  redemptionError: null,
};

// Fetch all active vouchers
export const fetchVouchers = createAsyncThunk(
  'vouchers/fetchVouchers',
  async (_, { rejectWithValue }) => {
    try {
      const snapshot = await firestore()
        .collection('vouchers')
        .where('isActive', '==', true)
        .where('stock', '>', 0)
        .orderBy('stock', 'desc')
        .orderBy('pointsCost', 'asc')
        .get();

      const vouchers: Voucher[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Voucher[];

      return vouchers;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch vouchers');
    }
  }
);

// Fetch user's redemption history
export const fetchRedemptions = createAsyncThunk(
  'vouchers/fetchRedemptions',
  async (userId: string, { rejectWithValue }) => {
    try {
      const snapshot = await firestore()
        .collection('redemptions')
        .where('userId', '==', userId)
        .orderBy('redeemedAt', 'desc')
        .get();

      const redemptions: Redemption[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Redemption[];

      return redemptions;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch redemptions');
    }
  }
);

// Redeem a voucher
export const redeemVoucher = createAsyncThunk(
  'vouchers/redeemVoucher',
  async (
    { voucherId, userId, userPoints }: { voucherId: string; userId: string; userPoints: number },
    { rejectWithValue }
  ) => {
    try {
      // Get voucher details
      const voucherDoc = await firestore()
        .collection('vouchers')
        .doc(voucherId)
        .get();

      if (!voucherDoc.exists) {
        return rejectWithValue('Voucher not found');
      }

      const voucher = { id: voucherDoc.id, ...voucherDoc.data() } as Voucher;

      // Validate stock
      if (voucher.stock <= 0) {
        return rejectWithValue('Voucher is out of stock');
      }

      // Validate user has enough points
      if (userPoints < voucher.pointsCost) {
        return rejectWithValue('Insufficient points');
      }

      // Generate redemption code
      const redemptionCode = `KW-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

      // Create redemption record
      const redemptionData: Omit<Redemption, 'id'> = {
        userId,
        voucherId,
        pointsSpent: voucher.pointsCost,
        redemptionCode,
        status: 'issued',
        redeemedAt: firestore.Timestamp.now(),
        expiresAt: firestore.Timestamp.fromDate(
          new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 days
        ),
      };

      // Use batch write for atomicity
      const batch = firestore().batch();

      // Add redemption
      const redemptionRef = firestore().collection('redemptions').doc();
      batch.set(redemptionRef, redemptionData);

      // Update voucher stock
      batch.update(firestore().collection('vouchers').doc(voucherId), {
        stock: firestore.FieldValue.increment(-1),
      });

      // Deduct points from user
      batch.update(firestore().collection('users').doc(userId), {
        compassionPoints: firestore.FieldValue.increment(-voucher.pointsCost),
      });

      // Create points transaction
      const transactionRef = firestore().collection('pointsTransactions').doc();
      batch.set(transactionRef, {
        userId,
        amount: -voucher.pointsCost,
        type: 'voucher_redemption',
        relatedId: voucherId,
        description: `Redeemed ${voucher.title}`,
        timestamp: firestore.Timestamp.now(),
      });

      await batch.commit();

      const redemption: Redemption = {
        id: redemptionRef.id,
        ...redemptionData,
      };

      return { redemption, voucher };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to redeem voucher');
    }
  }
);

const vouchersSlice = createSlice({
  name: 'vouchers',
  initialState,
  reducers: {
    setSelectedCategory: (state, action: PayloadAction<VoucherCategory | 'all'>) => {
      state.selectedCategory = action.payload;
    },
    clearRedemptionError: (state) => {
      state.redemptionError = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch vouchers
    builder.addCase(fetchVouchers.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchVouchers.fulfilled, (state, action) => {
      state.loading = false;
      state.vouchers = action.payload;
    });
    builder.addCase(fetchVouchers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch redemptions
    builder.addCase(fetchRedemptions.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchRedemptions.fulfilled, (state, action) => {
      state.loading = false;
      state.redemptions = action.payload;
    });
    builder.addCase(fetchRedemptions.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Redeem voucher
    builder.addCase(redeemVoucher.pending, (state) => {
      state.redeeming = true;
      state.redemptionError = null;
    });
    builder.addCase(redeemVoucher.fulfilled, (state, action) => {
      state.redeeming = false;
      state.redemptions.unshift(action.payload.redemption);
      // Update voucher stock in local state
      const voucherIndex = state.vouchers.findIndex(
        v => v.id === action.payload.voucher.id
      );
      if (voucherIndex !== -1) {
        state.vouchers[voucherIndex].stock -= 1;
      }
    });
    builder.addCase(redeemVoucher.rejected, (state, action) => {
      state.redeeming = false;
      state.redemptionError = action.payload as string;
    });
  },
});

export const { setSelectedCategory, clearRedemptionError } = vouchersSlice.actions;

// Selectors
export const selectFilteredVouchers = (state: { vouchers: VouchersState }) => {
  const { vouchers, selectedCategory } = state.vouchers;
  if (selectedCategory === 'all') {
    return vouchers;
  }
  return vouchers.filter(v => v.category === selectedCategory);
};

export default vouchersSlice.reducer;
