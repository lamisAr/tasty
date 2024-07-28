import express from "express";
import { addRecipe, getRecipes, deleteRecipe } from "../Controllers/RecipeController";
import { authenticateToken } from "../Middleware/authToken";

const recipeRoutes = express.Router();

recipeRoutes.post("/", authenticateToken, addRecipe);
recipeRoutes.get("/", getRecipes);
recipeRoutes.delete("/:id", authenticateToken, deleteRecipe);

export default recipeRoutes;
