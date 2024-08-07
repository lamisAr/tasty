import express from "express";
import {
  addRecipe,
  getRecipes,
  deleteRecipe,
  getFavoriteRecipeIds,
  addFavoriteRecipe,
  removeFavoriteRecipe,
  getCuisines,
} from "../Controllers/RecipeController";
import { authenticateToken } from "../Middleware/authToken";

const recipeRoutes = express.Router();

recipeRoutes.post("/", authenticateToken, addRecipe);
recipeRoutes.get("/", getRecipes);
recipeRoutes.delete("/:id", authenticateToken, deleteRecipe);
recipeRoutes.get("/favorites/:userId", authenticateToken, getFavoriteRecipeIds);
recipeRoutes.post("/favorites/add", authenticateToken, addFavoriteRecipe);
recipeRoutes.delete("/favorites/remove", authenticateToken, removeFavoriteRecipe);
recipeRoutes.get("/cuisines/", getCuisines);

export default recipeRoutes;
