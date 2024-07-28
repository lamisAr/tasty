import { Sequelize } from "sequelize-typescript";
import User from "./pgmodels/User";
import Comment from "./pgmodels/Comment";
import Favorite from "./pgmodels/Favorite";
import Ingredient from "./pgmodels/Ingredient";
import MealPlan from "./pgmodels/MealPlan";
import MealPlanRecipe from "./pgmodels/MealPlanRecipe";
import Rating from "./pgmodels/Rating";
import Recipe from "./pgmodels/Recipe";
import ShoppingList from "./pgmodels/ShoppingList";
import ShoppingListItem from "./pgmodels/ShoppingListItem";
import RecipeIngredient from "./pgmodels/RecipeIngredient";
import ImageURL from "./pgmodels/ImageURL";
import Follows from "./pgmodels/Follows";

const url = process.env.DATABASE_URL as string;

export const sequelize = new Sequelize(url, {
  models: [__dirname + "/pgmodels/**/*.ts"],
  dialect: "postgres",
  dialectOptions: url.includes("@localhost")
    ? {}
    : {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
});

sequelize.addModels([
  User,
  Comment,
  Favorite,
  Ingredient,
  MealPlan,
  MealPlanRecipe,
  Rating,
  Recipe,
  RecipeIngredient,
  ShoppingList,
  ShoppingListItem,
  Follows,
  ImageURL,
]);

export const authenticate = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

export const sync = async () => {
  sequelize.sync();
};
