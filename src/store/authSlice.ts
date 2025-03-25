import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authService, setAuthToken } from "../service/service";
import { IAuthState } from "../interfaces/auth.interface";
import { AxiosError } from "axios";

interface AuthError {
  error?: string;
}

export const loginUser = createAsyncThunk(
  "auth/login",
  async (
    { username, password }: { username: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await authService.login(username, password);
      return response.data.data.token;
    } catch (error) {
      const axiosError = error as AxiosError<AuthError>;
      return rejectWithValue(
        axiosError.response?.data?.error || "Login failed"
      );
    }
  }
);

const initialState: IAuthState = {
  token: localStorage.getItem("token"),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.error = null;
      setAuthToken(null);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload;
        setAuthToken(action.payload);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export const authReducer = authSlice.reducer;
