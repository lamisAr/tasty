import { Request, Response } from "express";
import Recipe from "../db/pgmodels/Recipe";
import RecipeIngredient from "../db/pgmodels/RecipeIngredient";
import Ingredient from "../db/pgmodels/Ingredient";
import Favorite from "../db/pgmodels/Favorite";
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

//getRecipes
export const getRecipes = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { page = 1, limit = 10, search, cuisine, type, userId, recipeIds } = req.query;

    // Convert page and limit to numbers
    const offset = (Number(page) - 1) * Number(limit);
    const whereClause: any = {};

    // Handle recipeIds parameter
    if (recipeIds) {
      // Ensure recipeIds is an array of numbers
      let idsArray: number[] = [];

      // Check if recipeIds is an array
      if (Array.isArray(recipeIds)) {
        idsArray = recipeIds
          .map((id) => {
            const parsedId = typeof id === "string" ? parseInt(id, 10) : Number(id);
            return isNaN(parsedId) ? null : parsedId; // Handle invalid numbers
          })
          .filter((id) => id !== null) as number[];
      } else {
        // Handle single value case
        const parsedId = typeof recipeIds === "string" ? parseInt(recipeIds, 10) : Number(recipeIds);
        if (!isNaN(parsedId)) {
          idsArray = [parsedId];
        }
      }

      if (idsArray.length > 0) {
        whereClause.recipe_id = { [Op.in]: idsArray };
      }
    } else {
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
        whereClause.user_id = userId; // Filter recipes created by the user
      }
    }

    // Fetch recipes with filters and pagination
    const recipes = await Recipe.findAndCountAll({
      where: whereClause,
      limit: Number(limit),
      offset,
      include: [
        Ingredient, // Include Ingredients if needed
      ],
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

//get list of fav recipes
export const getFavoriteRecipeIds = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Get userId from query and ensure it is a string
    const { userId } = req.params;

    // Query to get all recipe_ids for the specified user
    const favorites = await Favorite.findAll({
      attributes: ["recipe_id"],
      where: { user_id: userId },
    });

    const recipeIds = favorites.map((favorite) => favorite.recipe_id);

    return res.status(200).json({ recipeIds });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Add recipe to favorites
export const addFavoriteRecipe = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Extract userId and recipeId from request body
    const { userId, recipeId } = req.body;

    // Validate input
    if (!userId || !recipeId) {
      return res.status(400).json({ message: "User ID and Recipe ID are required" });
    }

    // Check if the favorite already exists
    const existingFavorite = await Favorite.findOne({
      where: {
        user_id: userId,
        recipe_id: recipeId,
      },
    });

    if (existingFavorite) {
      return res.status(400).json({ message: "Recipe is already in favorites" });
    }

    // Create a new favorite entry
    await Favorite.create({
      user_id: userId,
      recipe_id: recipeId,
    } as any);

    return res.status(201).json({ message: "Recipe added to favorites" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Remove recipe from favorites
export const removeFavoriteRecipe = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Extract userId and recipeId from request body
    const { userId, recipeId } = req.body;

    // Validate input
    if (!userId || !recipeId) {
      return res.status(400).json({ message: "User ID and Recipe ID are required" });
    }

    // Find the favorite entry
    const favorite = await Favorite.findOne({
      where: {
        user_id: userId,
        recipe_id: recipeId,
      },
    });

    if (!favorite) {
      return res.status(404).json({ message: "Favorite not found" });
    }

    // Delete the favorite entry
    await favorite.destroy();

    return res.status(200).json({ message: "Recipe removed from favorites" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
