/* eslint-disable @typescript-eslint/no-explicit-any */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit" 
import { config } from "@/config/api"
import { VoucherType } from "../types/voucher.type"
import { toast } from "react-toastify"

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

export const scanVoucherTesseractFeature = createAsyncThunk(
  "voucher/scanVoucherTesseractTogetherFeature",
  async (
    { text, model }: { text: string, model: "together" | "groq" | "gemini" },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(`${config.BACK_URL}/voucher/scan-tesseract`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, model }),
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

export const scanVoucherWithGoogleVisionFeature = createAsyncThunk(
  "voucher/scanVoucherWithGoogleVisionFeature",
  async (
    { file, model }: { file: File, model: "together" | "groq" | "gemini" },
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("model", model);
      const response = await fetch(`${config.BACK_URL}/voucher/scan-google-vision`, {
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

export const scanVoucherGroqVisionFeature = createAsyncThunk("voucher/scan-groq-vision", async ({ file, model }: { file: File, model: "together" | "groq" | "gemini" }, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("model", model);
    const response = await fetch(`${config.BACK_URL}/voucher/scan-groq-vision`, {
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
});

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

export const updateVoucherFeature = createAsyncThunk(
  "voucher/updateVoucherFeature",
  async (
    { voucher }: { voucher: VoucherType },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(`${config.BACK_URL}/voucher/update-voucher`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ voucher }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      toast.error(`Error updating voucher ${error.message}`, {
        toastId: "update-voucher-error",
        position: "bottom-right",
        autoClose: 5000,
      });
      return rejectWithValue(error.message);
    }
  }
);
export const updateVoucherImgFeature = createAsyncThunk(
  "voucher/updateVoucherImgFeature",
  async (
    { voucher_id, file }: { voucher_id: string, file: File },
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch(
        `${config.BACK_URL}/voucher/update-voucher-img?voucher_id=${voucher_id}`,
        {
          method: "POST",
          body: formData,
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

export const deleteVoucherImgFeature = createAsyncThunk(
  "voucher/deleteVoucherImgFeature",
  async (
    { voucher_id, img_name }: { voucher_id: string, img_name: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(
        `${config.BACK_URL}/voucher/delete-voucher-img?voucher_id=${voucher_id}&img_name=${img_name}`,
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


const voucherSlice = createSlice({
  name: "voucher",
  initialState: {
    vouchers: [] as VoucherType[],
    loadingScanTesseract: false,
    loadingCreateVoucher: false,
    loadingEditVoucher: false,
    loadingDeleteVoucher: false,
    loadingDeleteVoucherImg: false,
    loadingUpdateVoucherImg: false,
    loadingUpdateVoucher: false,
    isOpenModal: false,
    selectedVoucherId: null as string | null,
    loading: false,
    error: null,
  },
  reducers: {
    setVouchers: (state, action) => {
      state.vouchers = action.payload
    },
    setIsToggleModal: (state, action) => {
      state.isOpenModal = action.payload.isOpenModal
      state.selectedVoucherId = action.payload.selectedVoucherId
    },
    setVoucherId: (state, action) => {
      state.selectedVoucherId = action.payload
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
    builder.addCase(updateVoucherFeature.pending, (state) => {
      state.loadingUpdateVoucher = true
      state.error = null
    })
    builder.addCase(updateVoucherFeature.fulfilled, (state, action) => {
      state.loadingUpdateVoucher = false
      state.vouchers = state.vouchers.map((voucher) => {
        if (voucher.id === action.payload.id) {
          return action.payload
        }
        return voucher
      })
    })
    builder.addCase(updateVoucherFeature.rejected, (state) => {
      state.loadingUpdateVoucher = false
    })
    // builder.addCase(updateVoucherImgFeature.pending, (state) => {
    //   state.loadingUpdateVoucherImg = true
    //   state.error = null
    // })
    // builder.addCase(updateVoucherImgFeature.fulfilled, (state, action) => {
    //   state.loadingUpdateVoucherImg = false
    //   state.vouchers = state.vouchers.map((voucher) => {
    //     if (voucher.id === action.payload.id) {
    //       voucher.img_name = action.payload.img_name
    //     }
    //     return voucher
    //   })
    // })
    // builder.addCase(updateVoucherImgFeature.rejected, (state) => {
    //   state.loadingUpdateVoucherImg = false
    // })
    builder.addCase(deleteVoucherFeature.pending, (state) => {
      state.loadingDeleteVoucher = true
      state.error = null
    })
    builder.addCase(deleteVoucherFeature.fulfilled, (state, action) => {
      state.loadingDeleteVoucher = false
      state.vouchers = state.vouchers.filter((voucher) => voucher.id !== action.payload.id)
    })
    builder.addCase(deleteVoucherFeature.rejected, (state) => {
      state.loadingDeleteVoucher = false
    })
    // builder.addCase(deleteVoucherImgFeature.pending, (state) => {
    //   state.loadingDeleteVoucherImg = true
    //   state.error = null
    // })
    // builder.addCase(deleteVoucherImgFeature.fulfilled, (state, action) => {
    //   state.loadingDeleteVoucherImg = false
    //   state.vouchers = state.vouchers.map((voucher) => {
    //     if (voucher.id === action.payload.id) {
    //       voucher.img_name = ''
    //     }
    //     return voucher
    //   })
    // })
    // builder.addCase(deleteVoucherImgFeature.rejected, (state) => {
    //   state.loadingDeleteVoucherImg = false
    // })
  },
})

export const { setVouchers, setIsToggleModal, setLoading, setError, setVoucherId } = voucherSlice.actions

export default voucherSlice.reducer