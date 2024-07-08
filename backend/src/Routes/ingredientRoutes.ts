import express from "express";
import { addIngredient, getIngredients, deleteIngredient } from "../Controllers/IngredientController";

const ingredientRoutes = express.Router();

ingredientRoutes.post("/", addIngredient);
ingredientRoutes.get("/", getIngredients);
ingredientRoutes.delete("/:id", deleteIngredient);

export default ingredientRoutes;
