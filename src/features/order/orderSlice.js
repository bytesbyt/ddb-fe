import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { showToastMessage } from "../common/uiSlice";
import { getCartQty } from "../cart/cartSlice";

// Define initial state
const initialState = {
  orderList: [],
  orderNum: "",
  selectedOrder: {},
  error: "",
  loading: false,
  totalPageNum: 1,
};

// Async thunks
export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post("/order", payload);
      if (response.status !== 200) throw new Error(response.error);
      dispatch(getCartQty())
      return response.data.orderNum;
    }catch (error) {
      // The error is already extracted as a string by the API interceptor
      let errorMessage = error || "Failed to create order";
      
      // If it's a multi-line error (stock issues), format it better
      if (typeof errorMessage === 'string' && errorMessage.includes('\n')) {
        // Replace line breaks with comma and space for toast display
        errorMessage = errorMessage.replace(/\n/g, ', ').replace(', ,', ',').trim();
        // Remove trailing comma if exists
        if (errorMessage.endsWith(',')) {
          errorMessage = errorMessage.slice(0, -1);
        }
      }
      
      dispatch(showToastMessage({
        message: errorMessage,
        status: "error",
      }))
      return rejectWithValue(error);
    }
  }
);

export const getOrder = createAsyncThunk(
  "order/getOrder",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.get("/order");
      if (response.status !== 200) throw new Error(response.error);
      return response.data.data;
    } catch (error) {
      dispatch(showToastMessage({
        message: error.error || "Failed to get orders",
        status: "error",
      }));
      return rejectWithValue(error.error);
    }
  }
);

export const getOrderList = createAsyncThunk(
  "order/getOrderList",
  async (query, { rejectWithValue, dispatch }) => {}
);

export const updateOrder = createAsyncThunk(
  "order/updateOrder",
  async ({ id, status }, { dispatch, rejectWithValue }) => {}
);

// Order slice
const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setSelectedOrder: (state, action) => {
      state.selectedOrder = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createOrder.pending, (state, action) => {
      state.loading = true;
    })
    .addCase(createOrder.fulfilled, (state, action) => {
      state.loading = false;
      state.error = "";
      state.orderNum = action.payload;
    })
    .addCase(createOrder.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase(getOrder.pending, (state, action) => {
      state.loading = true;
    })
    .addCase(getOrder.fulfilled, (state, action) => {
      state.loading = false;
      state.error = "";
      state.orderList = action.payload;
    })
    .addCase(getOrder.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
  },
});

export const { setSelectedOrder } = orderSlice.actions;
export default orderSlice.reducer;
