import { Request, Response } from "express";
import Recipe from "../db/pgmodels/Recipe";
import RecipeIngredient from "../db/pgmodels/RecipeIngredient";
import Ingredient from "../db/pgmodels/Ingredient";
import { Cuisine, RecipeType } from "../db/Enums";
import { Op } from "sequelize";

// Add Recipe
export const addRecipe = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { title, description, instructions, country_of_origin, type, user_id, ingredients } = req.body;

    // Create the recipe instance
    const recipe = await Recipe.create({
      title,
      description,
      instructions,
      country_of_origin,
      type,
      user_id,
    } as any);

    // If ingredients are provided, associate them with the recipe
    if (ingredients && ingredients.length > 0) {
      for (const ingredient of ingredients) {
        const { ingredient_id, quantity, unit, note } = ingredient;

        // Create RecipeIngredient instance and associate with the recipe
        await RecipeIngredient.create({
          recipe_id: recipe.recipe_id,
          ingredient_id,
          quantity,
          unit,
          note,
        } as any);
      }
    }

    // Fetch the created recipe with associated ingredients
    const createdRecipe = await Recipe.findByPk(recipe.recipe_id, {
      include: [
        {
          model: Ingredient,
          through: {
            attributes: ["quantity", "unit", "note"],
          },
        },
      ],
    });

    return res.status(201).json(createdRecipe);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get Recipes with pagination, search, and filters
export const getRecipes = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { page = 1, limit = 10, search, cuisine, type, userId } = req.query;

    const offset = (Number(page) - 1) * Number(limit);
    const whereClause: any = {};

    if (search) {
      whereClause.title = { [Op.like]: `%${search}%` };
    }

    if (cuisine) {
      whereClause.country_of_origin = cuisine;
    }

    if (type) {
      whereClause.type = type;
    }

    if (userId) {
      whereClause.user_id = userId;
    }

    const recipes = await Recipe.findAndCountAll({
      where: whereClause,
      limit: Number(limit),
      offset,
      include: [Ingredient],
    });

    return res.status(200).json({
      data: recipes.rows,
      total: recipes.count,
      page: Number(page),
      limit: Number(limit),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Delete Recipe
export const deleteRecipe = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const recipe = await Recipe.findByPk(id);

    if (recipe) {
      await recipe.destroy();
      return res.status(200).json({ message: "Recipe deleted successfully" });
    } else {
      return res.status(404).json({ message: "Recipe not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
