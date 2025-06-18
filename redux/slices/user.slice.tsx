import { createSlice } from '@reduxjs/toolkit';
import { UserInterface } from '@/interfaces/user.interface';
import { PaymentInterface } from '@/interfaces/payment.interface';

const initialState: { user: UserInterface | null; cvMinuteCount: number } = {
  user: null,
  cvMinuteCount: 0,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserReducer: (state, action) => {
      const {
        user,
        cvMinuteCount,
      }: { user: UserInterface; cvMinuteCount?: number } = action.payload;
      state.user = user;

      if (cvMinuteCount) {
        state.cvMinuteCount = cvMinuteCount;
      }
    },
    updateUserReducer: (state, action) => {
      const {
        user,
        cvMinuteCount,
      }: { user?: UserInterface; cvMinuteCount?: number } = action.payload;

      if (user) {
        state.user = { ...state.user, ...user };
      }

      if (cvMinuteCount) {
        state.cvMinuteCount = cvMinuteCount;
      }
    },
    updatePaymentReducer: (state, action) => {
      const data: { payment: PaymentInterface } = action.payload;

      if (state.user) {
        if (state.user.payments) {
          const paymentIndex = state.user.payments?.findIndex(
            (item) => item.id === data.payment.id,
          );

          if (paymentIndex !== -1) {
            state.user.payments[paymentIndex] = data.payment;
          } else {
            state.user = {
              ...state.user,
              payments: [...state.user.payments, data.payment],
            };
          }
        } else {
          state.user = {
            ...state.user,
            payments: [data.payment],
          };
        }
      }
    },
    updatePaymentsReducer: (state, action) => {
      const data: { payments: PaymentInterface[] } = action.payload;

      if (state.user) {
        if (state.user.payments) {
          for (const payment of data.payments) {
            const paymentIndex = state.user.payments?.findIndex(
              (item) => item.id === payment.id,
            );

            if (paymentIndex !== -1) {
              state.user.payments[paymentIndex] = payment;
            }
          }
        }
      }
    },
  },
});

export const {
  setUserReducer,
  updateUserReducer,
  updatePaymentReducer,
  updatePaymentsReducer,
} = userSlice.actions;

export default userSlice.reducer;
