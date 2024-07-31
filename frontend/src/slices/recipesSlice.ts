// features/recipes/recipesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import axiosInstance from "../api/axiosInstance.ts";

/* eslint-disable no-param-reassign */

export type RecipeFetchParams = {
  page?: number;
  limit?: number;
  search?: string;
  cuisine?: string;
  type?: string;
  userId?: string;
};

export type ErrorResponse = {
  message?: string;
};

export const fetchRecipes = createAsyncThunk(
  "recipes/fetchRecipes",
  async (params: RecipeFetchParams, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/api/recipes", {
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
          search: params.search || "",
          cuisine: params.cuisine || "",
          type: params.type || "",
          userId: params.userId || "",
        },
      });
      return response.data;
    } catch (error) {
      let errorMsg = "Something went wrong!";
      if (error instanceof AxiosError && error.response) {
        errorMsg = error.response.data.message || errorMsg;
      }
      return rejectWithValue({ message: errorMsg });
    }
  }
);

const recipesSlice = createSlice({
  name: "recipes",
  initialState: {
    recipes: [],
    total: 0,
    page: 1,
    limit: 10,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecipes.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchRecipes.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.recipes = action.payload.data;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
      })
      .addCase(fetchRecipes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as any;
      });
  },
});

export default recipesSlice.reducer;
