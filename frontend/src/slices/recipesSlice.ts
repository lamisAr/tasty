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
  favUserId?: string;
};

export type ErrorResponse = {
  message?: string;
};

/**
 * Async thunk to fetch favorite recipe IDs for a specific user.
 * Retrieves the list of favorite recipe IDs from the server or uses cached data if available and forceLoad is not true.
 * @param {Object} params - The parameters for fetching favorite recipe IDs.
 * @param {string} params.userId - The ID of the user whose favorite recipes are to be fetched.
 * @param {boolean} [params.forceLoad] - Optional flag to force load from the server.
 * @param {ThunkAPI} { getState, rejectWithValue } - The thunk API to access the state and handle errors.
 * @returns {Promise<number[]>} - The list of favorite recipe IDs.
 */
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

      const response = await axiosInstance.get(`/recipes/favorites/${userId}`);
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

/**
 * Async thunk to add a recipe to the user's favorites.
 * Sends a request to the server to add a recipe to the list of favorite recipes.
 * @param {Object} params - The parameters for adding a recipe to favorites.
 * @param {string} params.userId - The ID of the user who is adding the recipe to favorites.
 * @param {number} params.recipeId - The ID of the recipe to be added to favorites.
 * @param {ThunkAPI} { rejectWithValue } - The thunk API to handle errors.
 * @returns {Promise<any>} - The response from the server.
 */
export const addFavoriteRecipe = createAsyncThunk(
  "recipes/addFavoriteRecipe",
  async ({ userId, recipeId }: { userId: string; recipeId: number }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/recipes/favorites/add", { userId, recipeId });
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

/**
 * Async thunk to remove a recipe from the user's favorites.
 * Sends a request to the server to remove a recipe from the list of favorite recipes.
 * @param {Object} params - The parameters for removing a recipe from favorites.
 * @param {string} params.userId - The ID of the user who is removing the recipe from favorites.
 * @param {number} params.recipeId - The ID of the recipe to be removed from favorites.
 * @param {ThunkAPI} { rejectWithValue } - The thunk API to handle errors.
 * @returns {Promise<any>} - The response from the server.
 */
export const removeFavoriteRecipe = createAsyncThunk(
  "recipes/removeFavoriteRecipe",
  async ({ userId, recipeId }: { userId: string; recipeId: number }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete("/recipes/favorites/remove", {
        data: { userId, recipeId },
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

/**
 * Async thunk to remove a recipe from the user's favorites.
 * Sends a request to the server to remove a recipe from the list of favorite recipes.
 * @param {Object} params - The parameters for removing a recipe from favorites.
 * @param {string} params.userId - The ID of the user who is removing the recipe from favorites.
 * @param {number} params.recipeId - The ID of the recipe to be removed from favorites.
 * @param {ThunkAPI} { rejectWithValue } - The thunk API to handle errors.
 * @returns {Promise<any>} - The response from the server.
 */
export const deleteRecipe = createAsyncThunk(
  "recipes/delete",
  async (recipeId: string | number, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/recipes/${recipeId}`);
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

/**
 * Async thunk to fetch recipes based on various parameters.
 * Includes an option to fetch recipes based on favorite recipe IDs if favUserId is provided.
 * @param {RecipeFetchParams} params - The parameters for fetching recipes.
 * @param {ThunkAPI} { rejectWithValue, dispatch } - The thunk API to handle errors and dispatch other thunks.
 * @returns {Promise<any>} - The list of recipes.
 */
export const fetchRecipes = createAsyncThunk(
  "recipes/fetchRecipes",
  async (params: RecipeFetchParams, { rejectWithValue, dispatch }) => {
    try {
      let recipeIds = [];
      if (params.favUserId) {
        const favoriteRecipeIds = await dispatch(fetchFavoriteRecipeIds({ userId: params.favUserId })).unwrap();
        recipeIds = favoriteRecipeIds;
      }

      const response = await axiosInstance.get("/recipes", {
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

/**
 * Async thunk to fetch a single recipe by its ID.
 * @param {number} recipeId - The ID of the recipe to be fetched.
 * @param {ThunkAPI} { rejectWithValue } - The thunk API to handle errors.
 * @returns {Promise<any>} - The recipe data.
 */
export const getRecipeById = createAsyncThunk(
  "recipes/getRecipeById",
  async (recipeId: number, { rejectWithValue }) => {
    try {
      const recipeIds = [recipeId];
      const response = await axiosInstance.get("/recipes", {
        params: {
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
  favoriteRecipeIds: number[];
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
      .addCase(getRecipeById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getRecipeById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.recipes = action.payload.data;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
      })
      .addCase(getRecipeById.rejected, (state, action) => {
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
      .addCase(addFavoriteRecipe.fulfilled, (state, action: PayloadAction<number>) => {
        state.status = "succeeded";
        // Update the list of favorite recipe IDs if needed
        state.favoriteRecipeIds.push(action.payload);
      })
      .addCase(addFavoriteRecipe.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as any;
      })
      .addCase(removeFavoriteRecipe.fulfilled, (state, action: PayloadAction<number>) => {
        state.status = "succeeded";
        // Update the list of favorite recipe IDs if needed
        state.favoriteRecipeIds.splice(state.favoriteRecipeIds.indexOf(action.payload), 1);
      })
      .addCase(removeFavoriteRecipe.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as any;
      });
  },
});

export default recipesSlice.reducer;
