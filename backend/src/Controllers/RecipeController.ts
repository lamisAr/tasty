import { Request, Response } from "express";
import Recipe from "../db/pgmodels/Recipe";
import RecipeIngredient from "../db/pgmodels/RecipeIngredient";
import Ingredient from "../db/pgmodels/Ingredient";
import Favorite from "../db/pgmodels/Favorite";
import { Cuisine, RecipeType } from "../db/Enums";
import { Op } from "sequelize";

// Add Recipe
/**
 *
 *
 * @param {Request} req - The request object containing the recipe details.
 * @param {string} req.body.title - The title of the recipe.
 * @param {string} req.body.description - The description of the recipe.
 * @param {string} req.body.instructions - The instructions for the recipe.
 * @param {string} req.body.country_of_origin - The country of origin for the recipe.
 * @param {string} req.body.type - The type of the recipe.
 * @param {number} req.body.user_id - The ID of the user creating the recipe.
 * @param {Array} req.body.ingredients - The list of ingredients for the recipe, each containing:
 *    @param {number} ingredient_id - The ID of the ingredient.
 *    @param {number} quantity - The quantity of the ingredient.
 *    @param {string} unit - The unit of measurement for the ingredient.
 *    @param {string} note - Any additional notes for the ingredient.
 *
 * @param {Response} res - The response object used to send back the desired HTTP response.
 *
 * @returns {Promise<Response>} - A promise that resolves to an HTTP response.
 *
 * @throws {Error} - Throws an error if there is a problem with the database operation.
 *
 * Status Codes:
 * - 201: Recipe created successfully.
 * - 500: Internal server error.
 *
 */
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
/**
 * Get a list of recipes from the database with optional filters and pagination.
 *
 * @param {Request} req - The request object containing query parameters.
 * @param {number} [req.query.page=1] - The page number for pagination.
 * @param {number} [req.query.limit=10] - The number of recipes to return per page.
 * @param {string} [req.query.search] - The search term to filter recipes by title.
 * @param {string} [req.query.cuisine] - The cuisine type to filter recipes.
 * @param {string} [req.query.type] - The recipe type to filter recipes.
 * @param {number} [req.query.userId] - The ID of the user to filter recipes created by them.
 * @param {Array|string} [req.query.recipeIds] - The list of recipe IDs to filter specific recipes.
 *
 * @param {Response} res - The response object used to send back the desired HTTP response.
 *
 * @returns {Promise<Response>} - A promise that resolves to an HTTP response.
 *
 * @throws {Error} - Throws an error if there is a problem with the database operation.
 *
 * Status Codes:
 * - 200: Recipes retrieved successfully.
 * - 500: Internal server error.
 */
export const getRecipes = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { page = 1, limit = 10, search, cuisine, type, userId, recipeIds } = req.query;

    // Convert page and limit to numbers
    const offset = (Number(page) - 1) * Number(limit);
    const whereClause: any = { deleted: false }; // Exclude deleted recipes

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

//Delete Recipe
/**
 * Soft delete a recipe by setting the deleted flag to true.
 *
 * @param {Request} req - The request object containing the recipe ID.
 * @param {string} req.params.id - The ID of the recipe to be deleted.
 *
 * @param {Response} res - The response object used to send back the desired HTTP response.
 *
 * @returns {Promise<Response>} - A promise that resolves to an HTTP response.
 *
 * @throws {Error} - Throws an error if there is a problem with the database operation.
 *
 * Status Codes:
 * - 200: Recipe deleted successfully (soft delete).
 * - 404: Recipe not found.
 * - 500: Internal server error.
 */
export const deleteRecipe = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const recipe = await Recipe.findByPk(id);

    if (recipe) {
      recipe.deleted = true;
      await recipe.save();
      return res.status(200).json({ message: "Recipe deleted successfully (soft delete)" });
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

//Add Fav
/**
 * Add a recipe to the user's favorites list.
 *
 * @param {Request} req - The request object containing userId and recipeId.
 * @param {number} req.body.userId - The ID of the user adding the recipe to favorites.
 * @param {number} req.body.recipeId - The ID of the recipe being added to favorites.
 *
 * @param {Response} res - The response object used to send back the desired HTTP response.
 *
 * @returns {Promise<Response>} - A promise that resolves to an HTTP response.
 *
 * Status Codes:
 * - 201: Recipe added to favorites successfully.
 * - 400: Bad request, user ID or recipe ID is missing or the recipe is already in favorites.
 * - 500: Internal server error.
 *
 * @throws {Error} - Throws an error if there is a problem with the database operation.
 */
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

    return res.status(201).json(recipeId);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//Remove Fav
/**
 * Remove a recipe from the user's favorites list.
 *
 * @param {Request} req - The request object containing userId and recipeId.
 * @param {number} req.body.userId - The ID of the user removing the recipe from favorites.
 * @param {number} req.body.recipeId - The ID of the recipe being removed from favorites.
 *
 * @param {Response} res - The response object used to send back the desired HTTP response.
 *
 * @returns {Promise<Response>} - A promise that resolves to an HTTP response.
 *
 * Status Codes:
 * - 200: Recipe removed from favorites successfully.
 * - 400: Bad request, user ID or recipe ID is missing.
 * - 404: Favorite entry not found.
 * - 500: Internal server error.
 *
 * @throws {Error} - Throws an error if there is a problem with the database operation.
 */
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

    return res.status(200).json(recipeId);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * @route   GET /api/recipes/cuisines
 * @desc    Get all available cuisines
 * @access  Public
 */
export const getCuisines = async (req: Request, res: Response): Promise<Response> => {
  try {
    const cuisines = Object.values(Cuisine);

    return res.status(200).json({
      success: true,
      cuisines,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
