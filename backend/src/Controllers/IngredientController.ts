import { Request, Response } from "express";
import Ingredient from "../db/pgmodels/Ingredient";
import { IngredientType } from "../db/Enums";
import { Op } from "sequelize";
import pluralize from "pluralize";

// Add Ingredient
/**
 * @param {Request} req - The request object containing the ingredient details.
 * @param {string} req.body.name - The name of the ingredient.
 * @param {string} req.body.ingredientType - The type of the ingredient.
 * @param {number} req.body.caloriesPer100g - The number of calories per 100 grams of the ingredient.
 *
 * @param {Response} res - The response object used to send back the desired HTTP response.
 *
 * @returns {Promise<Response>} - A promise that resolves to an HTTP response.
 *
 * @throws {Error} - Throws an error if there is a problem with the database operation.
 *
 * Status Codes:
 * - 201: Ingredient created successfully.
 * - 400: Invalid ingredient type provided.
 * - 409: Ingredient with the same name already exists.
 * - 500: Internal server error.
 */
export const addIngredient = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { name, ingredientType, caloriesPer100g } = req.body;

    // Validate ingredientType
    if (!Object.values(IngredientType).includes(ingredientType)) {
      return res.status(400).json({ success: false, message: "Invalid ingredient type" });
    }

    // Normalize and singularize the name to lowercase
    const normalizedName = pluralize.singular(name.trim().toLowerCase());

    // Check if an ingredient with the same normalized name already exists
    const existingIngredient = await Ingredient.findOne({
      where: {
        name: {
          [Op.iLike]: normalizedName,
        },
      },
    });

    if (existingIngredient) {
      return res.status(409).json({ success: false, message: "Ingredient already exists" });
    }

    // Create the ingredient
    const ingredient = await Ingredient.create({
      name: normalizedName,
      ingredientType,
      caloriesPer100g,
    } as any);

    return res.status(201).json({ success: true, ingredient });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Get Ingredients
/**
 * Get a list of all ingredients from the database.
 *
 *
 * @param {Response} res - The response object used to send back the ingredients.
 *
 * @returns {Promise<Response>} - A promise that resolves to an HTTP response.
 *
 * @throws {Error} - Throws an error if there is a problem with the database operation.
 *
 * Status Codes:
 * - 200: Ingredients retrieved successfully.
 * - 500: Internal server error.
 */
export const getIngredients = async (req: Request, res: Response): Promise<Response> => {
  try {
    const ingredients = await Ingredient.findAndCountAll({
      where: {
        deleted: false,
      },
    });

    return res.status(200).json({
      success: true,
      data: ingredients.rows,
      total: ingredients.count,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Delete Ingredient
/**
 *
 ** @param {Request} req - The request object containing the ingredient ID.
 * @param {string} req.params.id - The ID of the ingredient to be deleted.
 *
 * @param {Response} res - The response object used to send back the desired HTTP response.
 *
 * @returns {Promise<Response>} - A promise that resolves to an HTTP response.
 *
 * @throws {Error} - Throws an error if there is a problem with the database operation.
 *
 * Status Codes:
 * - 200: Ingredient deleted successfully (soft delete).
 * - 404: Ingredient not found.
 * - 500: Internal server error.
 */
export const deleteIngredient = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const ingredient = await Ingredient.findByPk(id);

    if (ingredient) {
      ingredient.deleted = true;
      await ingredient.save();
      return res.status(200).json({ message: "Ingredient deleted successfully (soft delete)" });
    } else {
      return res.status(404).json({ message: "Ingredient not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
