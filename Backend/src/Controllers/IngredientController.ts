import { Request, Response } from "express";
import Ingredient from "../db/pgmodels/Ingredient";
import { IngredientType } from "../db/Enums";
import { Op } from "sequelize";
import pluralize from "pluralize";

// Add Ingredient
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
            [Op.iLike]: normalizedName
          }
        }
      });
  
      if (existingIngredient) {
        return res.status(409).json({ success: false, message: "Ingredient already exists" });
      }
  
      // Create the ingredient
      const ingredient = await Ingredient.create({
        name: normalizedName,
        ingredientType,
        caloriesPer100g
      }as any);
  
      return res.status(201).json({ success: true, ingredient });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  };

// Get Ingredients
export const getIngredients = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { page = 1, size = 10, search = "" } = req.query;
      const limit = Number(size);
      const offset = (Number(page) - 1) * limit;
  
      const whereCondition = search
        ? {
            name: {
              [Op.like]: `%${search}%`,
            },
          }
        : {};
  
      const ingredients = await Ingredient.findAndCountAll({
        where: whereCondition,
        limit,
        offset,
      });
  
      return res.status(200).json({
        success: true,
        data: ingredients.rows,
        pagination: {
          total: ingredients.count,
          page: Number(page),
          size: limit,
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  };

// Delete Ingredient
export const deleteIngredient = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const ingredient = await Ingredient.findByPk(id);

    if (ingredient) {
      await ingredient.destroy();
      return res.status(200).json({ message: "Ingredient deleted successfully" });
    } else {
      return res.status(404).json({ message: "Ingredient not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
