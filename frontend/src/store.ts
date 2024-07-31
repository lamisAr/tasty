import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice.ts";
import userReducer from "./slices/userSlice.ts";
import recipesSlice from "./slices/recipesSlice.ts";

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    recipe: recipesSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
