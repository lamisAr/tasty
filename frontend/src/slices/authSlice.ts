import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import axiosInstance from "../api/axiosInstance.ts";

/* eslint-disable no-param-reassign */

type User = {
  email: string;
  password: string;
};

type NewUser = User & {
  userName: string;
  description: string;
  firstName?: string;
  lastName?: string;
};

type UserBasicInfo = {
  id: string;
  userName: string;
  email: string;
  description?: string;
  firstName?: string;
  lastName?: string;
};

type UserProfileData = {
  userName: string;
  email: string;
};

type AuthApiState = {
  basicUserInfo?: UserBasicInfo | null;
  userProfileData?: UserProfileData | null;
  status: "idle" | "loading" | "failed";
  error: string | null;
};

const initialState: AuthApiState = {
  basicUserInfo: localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo") as string) : null,
  userProfileData: undefined,
  status: "idle",
  error: null,
};

export const login = createAsyncThunk("login", async (data: User) => {
  const response = await axiosInstance.post("/user/login", data);
  const resData = response.data;

  localStorage.setItem("jwt", resData.token);
  localStorage.setItem("userInfo", JSON.stringify(resData));
  localStorage.setItem("settings", JSON.stringify(["Profile", "My Recipes", "Favorites", "Logout"]));

  return resData;
});

export const register = createAsyncThunk("register", async (data: NewUser) => {
  const response = await axiosInstance.post("/user/signup", data);
  const resData = response.data;

  localStorage.setItem("jwt", resData.token);
  localStorage.setItem("userInfo", JSON.stringify(resData));
  localStorage.setItem("settings", JSON.stringify(["Profile", "My Recipes", "Favorites", "Logout"]));

  return resData;
});

export const logout = createAsyncThunk("logout", async () => {
  const response = await axiosInstance.post("/user/logout", {});
  const resData = response.data;

  localStorage.removeItem("userInfo");
  localStorage.setItem("settings", JSON.stringify(["Login", "Register"]));
  localStorage.removeItem("jwt");

  return resData;
});

export const getUser = createAsyncThunk("users/profile", async (userId: string, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`/user/${userId}`);
    return response.data;
  } catch (error) {
    let errorMsg = "Something went wrong!";
    if (error instanceof AxiosError && error.response) {
      errorMsg = error.response.data.message || errorMsg;
    }
    return rejectWithValue({ message: errorMsg });
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<UserBasicInfo>) => {
        state.status = "idle";
        state.basicUserInfo = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Login failed";
      })

      .addCase(register.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<UserBasicInfo>) => {
        state.status = "idle";
        state.basicUserInfo = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Registration failed";
      })

      .addCase(logout.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.status = "idle";
        state.basicUserInfo = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Logout failed";
      })

      .addCase(getUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state) => {
        state.status = "idle";
      })
      .addCase(getUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Get user profile data failed";
      });
  },
});

export default authSlice.reducer;
