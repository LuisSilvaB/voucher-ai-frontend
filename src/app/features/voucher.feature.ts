import { createSlice } from "@reduxjs/toolkit"
const voucherSlice = createSlice({
  name: "voucher",
  initialState: {
    vouchers: [],
    loading: false,
    error: null,
  },
  reducers: {
    setVouchers: (state, action) => {
      state.vouchers = action.payload
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
  },
})

export const {} = voucherSlice.actions

export default voucherSlice.reducer