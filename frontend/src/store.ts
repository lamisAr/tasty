import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import userReducer from "./slices/userSlice";
import recipesSlice from "./slices/recipesSlice";

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
