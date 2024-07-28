import express from "express";
import { addIngredient, getIngredients, deleteIngredient } from "../Controllers/IngredientController";
import { authenticateToken } from "../Middleware/authToken";

const ingredientRoutes = express.Router();

ingredientRoutes.post("/", authenticateToken, addIngredient);
ingredientRoutes.get("/", getIngredients);
ingredientRoutes.delete("/:id", authenticateToken, deleteIngredient);

export default ingredientRoutes;
