/* eslint-disable @typescript-eslint/no-explicit-any */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit" 
import { config } from "@/config/api"
import { VoucherType } from "../types/voucher.type"

export const scanVoucherTesseractFeature = createAsyncThunk(
  "voucher/scanVoucherFeature",
  async (
    { text }: { text: string },
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();
      formData.append("text", text);
      const response = await fetch(`${config.BACK_URL}/voucher/scan-tesseract`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createVoucherFeature = createAsyncThunk(
  "voucher/createVoucherFeature",
  async (
    { voucher, File }: { voucher: VoucherType, File: File },
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();
      formData.append("voucher", JSON.stringify(voucher));
      formData.append("file", File);
      const response = await fetch(`${config.BACK_URL}/voucher/create-voucher`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteVoucherFeature = createAsyncThunk(
  "voucher/deleteVoucherFeature",
  async (
    { id }: { id: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(
        `${config.BACK_URL}/voucher/delete-voucher?id=${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const getVouchersFeature = createAsyncThunk(
  "voucher/getVouchersFeature",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${config.BACK_URL}/voucher/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
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
    vouchers: [] as VoucherType[],
    loadingScanTesseract: false,
    loadingCreateVoucher: false,
    loadingEditVoucher: false,
    loadingDeleteVoucher: false,
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
    builder.addCase(getVouchersFeature.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(getVouchersFeature.fulfilled, (state, action) => {
      state.loading = false
      state.vouchers = action.payload
    })
    builder.addCase(getVouchersFeature.rejected, (state) => {
      state.loading = false
    })
    builder.addCase(scanVoucherTesseractFeature.pending, (state) => {
      state.loadingScanTesseract = true;
    })
    builder.addCase(scanVoucherTesseractFeature.fulfilled, (state) => {
      state.loadingScanTesseract = false;
    })
    builder.addCase(scanVoucherTesseractFeature.rejected, (state) => {
      state.loadingScanTesseract = false;
    })
    builder.addCase(createVoucherFeature.pending, (state) => {
      state.loadingCreateVoucher = true;
    })
    builder.addCase(createVoucherFeature.fulfilled, (state, action) => {
      state.loadingCreateVoucher = false;
      state.vouchers.push(action.payload);
    })
    builder.addCase(createVoucherFeature.rejected, (state) => {
      state.loadingCreateVoucher = false;
    })
    builder.addCase(deleteVoucherFeature.pending, (state) => {
      state.loadingDeleteVoucher = true
      state.error = null
    })
    builder.addCase(deleteVoucherFeature.fulfilled, (state, action) => {
      state.loadingDeleteVoucher = false
      console.log(action.payload)
      state.vouchers = state.vouchers.filter((voucher) => voucher.id !== action.payload[0].id)
    })
    builder.addCase(deleteVoucherFeature.rejected, (state) => {
      state.loadingDeleteVoucher = false
    })
  },
})

export const {} = voucherSlice.actions

export default voucherSlice.reducer