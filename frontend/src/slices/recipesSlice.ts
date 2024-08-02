import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import axiosInstance from "../api/axiosInstance.ts";
import { RootState } from "../store.ts";

/* eslint-disable no-param-reassign */

export type RecipeFetchParams = {
  page?: number;
  limit?: number;
  search?: string;
  cuisine?: string;
  type?: string;
  userId?: string;
  favUserId?: string; // Add favUserId here
};

export type ErrorResponse = {
  message?: string;
};

// Thunk to fetch favorite recipe IDs
export const fetchFavoriteRecipeIds = createAsyncThunk(
  "recipes/fetchFavoriteRecipeIds",
  async ({ userId, forceLoad }: { userId: string; forceLoad?: boolean }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const cachedRecipeIds = state.recipe.favoriteRecipeIds;

      // If we have cached data and forceLoad is not set, return cached data
      if (cachedRecipeIds && cachedRecipeIds.length > 0 && !forceLoad) {
        return cachedRecipeIds;
      }

      const response = await axiosInstance.get(`/api/recipes/favorites/${userId}`);
      return response.data.recipeIds;
    } catch (error) {
      let errorMsg = "Something went wrong!";
      if (error instanceof AxiosError && error.response) {
        errorMsg = error.response.data.message || errorMsg;
      }
      return rejectWithValue({ message: errorMsg });
    }
  }
);

export const addFavoriteRecipe = createAsyncThunk(
  "recipes/addFavoriteRecipe",
  async ({ userId, recipeId }: { userId: string; recipeId: number }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/api/recipes/favorites/add", { userId, recipeId });
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

// Modify the fetchRecipes thunk to use favorite recipe IDs if favUserId is provided
export const fetchRecipes = createAsyncThunk(
  "recipes/fetchRecipes",
  async (params: RecipeFetchParams, { rejectWithValue, dispatch }) => {
    try {
      let recipeIds = [];
      if (params.favUserId) {
        const favoriteRecipeIds = await dispatch(fetchFavoriteRecipeIds({ userId: params.favUserId })).unwrap();
        recipeIds = favoriteRecipeIds;
      }

      const response = await axiosInstance.get("/api/recipes", {
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
          search: params.search || "",
          cuisine: params.cuisine || "",
          type: params.type || "",
          userId: params.userId || "",
          recipeIds: recipeIds.length > 0 ? recipeIds : undefined,
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
interface RecipesState {
  recipes: any[]; // Adjust `any` to a more specific type if possible
  total: number;
  page: number;
  limit: number;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  favoriteRecipeIds: number[]; // Define this as an array of numbers
}
const initialState: RecipesState = {
  recipes: [],
  total: 0,
  page: 1,
  limit: 10,
  status: "idle",
  error: null,
  favoriteRecipeIds: [],
};
const recipesSlice = createSlice({
  name: "recipes",
  initialState,
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
      })
      .addCase(fetchFavoriteRecipeIds.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchFavoriteRecipeIds.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.favoriteRecipeIds = action.payload;
      })
      .addCase(fetchFavoriteRecipeIds.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as any;
      })
      .addCase(addFavoriteRecipe.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addFavoriteRecipe.fulfilled, (state, action: PayloadAction<number>) => {
        state.status = "succeeded";
        // Update the list of favorite recipe IDs if needed
        state.favoriteRecipeIds.push(action.payload); // Adjust based on your API response
      })
      .addCase(addFavoriteRecipe.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as any;
      });
  },
});

export default recipesSlice.reducer;
