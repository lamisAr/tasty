import express from "express";
import { addRecipe, getRecipes, deleteRecipe } from "../Controllers/RecipeController";

const recipeRoutes = express.Router();

recipeRoutes.post("/", addRecipe);
recipeRoutes.get("/", getRecipes);
recipeRoutes.delete("/:id", deleteRecipe);

export default recipeRoutes;
