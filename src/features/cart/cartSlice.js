import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { showToastMessage } from "../common/uiSlice";

const initialState = {
  loading: false,
  error: "",
  cartList: [],
  selectedItem: {},
  cartItemCount: 0,
  totalPrice: 0,
};

// Async thunk actions
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ id, size }, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.post("/cart", { productId: id, size, qty: 1 });
      dispatch(
        showToastMessage({
          message: "Added to cart",
          status: "success",
        })
      );
      return response.data.cartItemQty;
    } catch (error) {
      dispatch(
        showToastMessage({
          message: error.error || "Failed to add to cart",
          status: "error",
        })
      );
      return rejectWithValue(error.error);
    }
  }
);

export const getCartList = createAsyncThunk(
  "cart/getCartList",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.get("/cart");
      return response.data.data;
    } catch (error) {
      dispatch(
        showToastMessage({
          message: error.error || "Failed to get cart list",
          status: "error",
        })
      );
      return rejectWithValue(error.error);
    }
  }
);

export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.delete(`/cart/${id}`);
      dispatch(
        showToastMessage({
          message: "Item removed from cart",
          status: "success",
        })
      );
      return { deletedItemId: id, cartItemQty: response.data.cartItemQty };
    } catch (error) {
      dispatch(
        showToastMessage({
          message: error.error || "Failed to remove item from cart",
          status: "error",
        })
      );
      return rejectWithValue(error.error);
    }
  }
);

export const updateQty = createAsyncThunk(
  "cart/updateQty",
  async ({ id, value }, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.put(`/cart/${id}`, { qty: value });
      dispatch(
        showToastMessage({
          message: "Quantity updated",
          status: "success",
        })
      );
      return response.data.data;
    } catch (error) {
      dispatch(
        showToastMessage({
          message: error.error || "Failed to update quantity",
          status: "error",
        })
      );
      return rejectWithValue(error.error);
    }
  }
);

export const getCartQty = createAsyncThunk(
  "cart/getCartQty",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.get("/cart/qty");
      return response.data.qty;
    } catch (error) {
      return rejectWithValue(error.error);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    initialCart: (state) => {
      state.cartItemCount = 0;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(addToCart.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(addToCart.fulfilled, (state, action) => {
      state.loading = false;
      state.error = "";
      state.cartItemCount = action.payload;
    });
    builder.addCase(addToCart.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(getCartList.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(getCartList.fulfilled, (state, action) => {
      state.loading = false;
      state.error = "";
      state.cartList = action.payload;
      state.cartItemCount = action.payload.length;
      state.totalPrice = action.payload.reduce(
        (total, item) => total + item.productId.price * item.qty,
        0
      );
    });
    builder.addCase(getCartList.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(getCartQty.fulfilled, (state, action) => {
      state.cartItemCount = action.payload;
    });
    builder.addCase(deleteCartItem.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(deleteCartItem.fulfilled, (state, action) => {
      state.loading = false;
      state.error = "";
      const deletedItemId = action.payload.deletedItemId;
      state.cartList = state.cartList.filter(
        (item) => item._id !== deletedItemId
      );
      state.cartItemCount = action.payload.cartItemQty;
      state.totalPrice = state.cartList.reduce(
        (total, item) => total + item.productId.price * item.qty,
        0
      );
    });
    builder.addCase(deleteCartItem.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(updateQty.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(updateQty.fulfilled, (state, action) => {
      state.loading = false;
      state.error = "";
      state.cartList = action.payload;
      state.cartItemCount = action.payload.length;
      state.totalPrice = action.payload.reduce(
        (total, item) => total + item.productId.price * item.qty,
        0
      );
    });
    builder.addCase(updateQty.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export default cartSlice.reducer;
export const { initialCart } = cartSlice.actions;
