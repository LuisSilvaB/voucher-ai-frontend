/* eslint-disable @typescript-eslint/no-explicit-any */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit" 
import { config } from "@/config/api"

export const scanVoucherFeature = createAsyncThunk(
  "voucher/scanVoucherFeature",
  async (text: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${config.BACK_URL}/voucher/scan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      })
      const data = await response.json()
      return data
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

const voucherSlice = createSlice({
  name: "voucher",
  initialState: {
    vouchers: [],
    loadingScanVoucher: false,
    loadingCreateVoucher: false,
    loadingEditVoucher: false,
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
  extraReducers: (builder) => {
    builder.addCase(scanVoucherFeature.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(scanVoucherFeature.fulfilled, (state, action) => {
      state.loading = false
      state.vouchers = action.payload
    })
    builder.addCase(scanVoucherFeature.rejected, (state) => {
      state.loading = false
    })
  },
})

export const {} = voucherSlice.actions

export default voucherSlice.reducer