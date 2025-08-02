import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { showToastMessage } from "../common/uiSlice";
import api from "../../utils/api";

export const loginWithEmail = createAsyncThunk(
  "user/loginWithEmail",
  async ({ email, password }, { rejectWithValue }) => {}
);

export const loginWithGoogle = createAsyncThunk(
  "user/loginWithGoogle",
  async (token, { rejectWithValue }) => {}
);

export const logout = () => (dispatch) => {};

export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (
    { email, name, password, navigate },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const response = await api.post("/user", {email, name, password});
      dispatch(
        showToastMessage({
          message: response.data.message || "Successfully registered",
          status: "success",
        })
      );
      navigate("/login");
      return response.data;
    }catch(error){
      dispatch(
        showToastMessage({
          message: error.error || error.message || "Failed to register",
          status: "error",
        })
      );
      return rejectWithValue(error.error || error.message);
    }
  } 
);

export const loginWithToken = createAsyncThunk(
  "user/loginWithToken",
  async (_, { rejectWithValue }) => {}
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    loading: false,
    loginError: null,
    registrationError: null,
    success: false,
  },
  reducers: {
    clearErrors: (state) => {
      state.loginError = null;
      state.registrationError = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(registerUser.pending, (state) => {
      state.loading = true;
    })
    .addCase(registerUser.fulfilled, (state) => {
      state.loading = false;
      state.registrationError = null;
    })
    .addCase(registerUser.rejected, (state, action) => {
      state.registrationError = action.payload;
    });
  },
});
export const { clearErrors } = userSlice.actions;
export default userSlice.reducer;
