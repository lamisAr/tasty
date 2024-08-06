import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { useParams } from "react-router";
import { useAppDispatch, useAppSelector } from "../hooks/redux-hooks.ts";
import { addFavoriteRecipe, getRecipeById, removeFavoriteRecipe } from "../slices/recipesSlice.ts";
import { getUser } from "../slices/authSlice.ts";
import ImagePlaceholder from "../media/img/foodIcon.jpg";
import { RootState } from "../store.ts";

type RecipeIngredient = {
  quantity?: number; // Add quantity to the Ingredient type
  unit?: string; // Add unit to the Ingredient type
};

type Ingredient = {
  ingredient_id: number;
  name: string;
  ingredientType?: string;
  ingredientType2?: string;
  caloriesPer100g: number;
  note?: string; // Add note to the Ingredient type
  RecipeIngredient?: RecipeIngredient;
};

type RecipeObj = {
  recipe_id: number;
  title?: string;
  type?: string;
  user_id: number;
  description?: string;
  country_of_origin?: string;
  ingredients?: [Ingredient];
  instructions?: string;
};

type User = {
  id: number;
  description?: string;
  username: string;
};
function Recipe() {
  // const basicUserInfo = useAppSelector((state) => state.auth.basicUserInfo);
  const { recipeId } = useParams<{ recipeId: string }>();
  const [recipe, setRecipe] = useState<RecipeObj>();
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<User>();

  const dispatch = useAppDispatch();
  const favoriteRecipeIds = useAppSelector((state: RootState) => state.recipe.favoriteRecipeIds);
  const basicUserInfo = useAppSelector((state) => state.auth.basicUserInfo);

  useEffect(() => {
    if (recipeId) {
      setLoading(true);
      dispatch(getRecipeById(Number(recipeId))).then(
        (res) => {
          if (res && res.payload && res.payload.data && res.payload.data.length) {
            setRecipe(res.payload.data[0]);
          }
          setLoading(false);
        },
        () => {
          setLoading(false);
        }
      );
    }
  }, [recipeId, dispatch]);

  useEffect(() => {
    if (recipe?.user_id)
      dispatch(getUser(recipe.user_id.toString())).then((userRes) => {
        if (userRes && userRes.payload) setUser(userRes.payload);
      });
  }, [recipe?.user_id]);

  const getCalories = (ingredient: Ingredient) => {
    if (ingredient.caloriesPer100g && ingredient.RecipeIngredient && ingredient.RecipeIngredient.quantity) {
      return (ingredient.caloriesPer100g * ingredient.RecipeIngredient.quantity) / 100;
    }
    return 0;
  };

  const getTotalCalories = (ingredients: [Ingredient]) =>
    ingredients.reduce(
      (total, ingredient) =>
        ingredient.caloriesPer100g && ingredient.RecipeIngredient && ingredient.RecipeIngredient.quantity
          ? total + (ingredient.caloriesPer100g * ingredient.RecipeIngredient.quantity) / 100
          : total,
      0
    );

  const [isFavRecipe, setIsFavRecipe] = useState<boolean>();
  useEffect(() => {
    if (
      favoriteRecipeIds &&
      favoriteRecipeIds.length > 0 &&
      favoriteRecipeIds.find((id: number) => {
        const idString = id.toString().trim();
        const recipeIdTrimmed = recipe?.recipe_id.toString().trim();
        return idString === recipeIdTrimmed;
      })
    ) {
      setIsFavRecipe(true);
    }
  }, [favoriteRecipeIds, recipe]);

  const handleAddToFavorites = () => {
    if (basicUserInfo?.id) {
      setIsFavRecipe(true);
      dispatch(addFavoriteRecipe({ userId: basicUserInfo.id, recipeId: Number(recipeId) }));
    }
  };
  const handleRemoveFromFavorites = () => {
    if (basicUserInfo?.id) {
      setIsFavRecipe(false);
      dispatch(removeFavoriteRecipe({ userId: basicUserInfo.id, recipeId: Number(recipeId) }));
    }
  };

  return (
    <Container maxWidth="xl" sx={{ padding: 4 }}>
      {recipe && (
        <Box>
          <Box
            component="img"
            sx={{
              width: "100%",
              maxHeight: { xs: 433, md: 267 },
              objectFit: "cover",
              borderRadius: "15px",
            }}
            alt={recipe?.title}
            src={ImagePlaceholder}
          />
          <Box sx={{ textAlign: "right", display: "flex", flexDirection: "row-reverse" }} pt={1}>
            {!isFavRecipe && (
              <Typography color="#1976d2" sx={{ cursor: "pointer" }} onClick={handleAddToFavorites}>
                + Add To Favorites
              </Typography>
            )}
            {isFavRecipe && (
              <Typography color="red" sx={{ cursor: "pointer" }} onClick={handleRemoveFromFavorites}>
                Remove From Favorites
              </Typography>
            )}
          </Box>
          <Typography variant="h6" color="gray">
            {user?.username}
          </Typography>
          <Typography variant="h4" fontWeight="bold">
            {recipe?.title}
          </Typography>
          <Typography variant="body1" pt={3}>
            {recipe?.description}
          </Typography>
          <Box pt={3} mt={3} pl={10} pb={3} sx={{ backgroundColor: "#f2f7ff", width: "100%", borderRadius: "15px" }}>
            <Typography variant="h6" color="#1976d2" pb={2}>
              Properties
            </Typography>
            <Typography pb={1}>&bull; &nbsp; &nbsp; Type: {recipe?.type}</Typography>
            <Typography pb={1}>&bull; &nbsp; &nbsp; Cuisine: {recipe?.country_of_origin}</Typography>
          </Box>
          <Box>
            <Typography variant="h5" color="#1976d2" pb={2} pt={3}>
              Ingredients
            </Typography>
            {recipe.ingredients &&
              recipe.ingredients.map((ingredient) => (
                <Typography pb={1} key={ingredient.ingredient_id}>
                  &bull; &nbsp; &nbsp;{ingredient?.name} ({ingredient?.RecipeIngredient?.quantity}{" "}
                  {ingredient?.RecipeIngredient?.unit})
                </Typography>
              ))}
          </Box>
          <Box>
            <Typography variant="h5" color="#1976d2" pb={2} pt={3}>
              Instructions
            </Typography>
            <Typography pb={1}>{recipe?.instructions}</Typography>
          </Box>
          {recipe.ingredients && (
            <Box>
              <Typography variant="h5" color="#1976d2" pb={2} pt={3}>
                Nutrition
              </Typography>
              <Typography pb={1}>Bellow is a detailed report of the recipe&apos;s calorie count.</Typography>
              <TableContainer>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>Ingredient</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }} align="right">
                        Calories in 100g
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }} align="right">
                        Recipe Amount
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }} align="right">
                        Calories per Amount
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recipe.ingredients.map((ingredient) => (
                      <TableRow key={ingredient.name} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                        <TableCell component="th" scope="row">
                          {ingredient.name}
                        </TableCell>
                        <TableCell align="right">{ingredient.caloriesPer100g}</TableCell>
                        <TableCell align="right">{ingredient.RecipeIngredient?.quantity}</TableCell>
                        <TableCell align="right">{getCalories(ingredient)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow key="total" sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                      <TableCell />
                      <TableCell />
                      <TableCell align="right" sx={{ fontWeight: "bold" }}>
                        Total Calories:{" "}
                      </TableCell>
                      <TableCell align="right">{getTotalCalories(recipe.ingredients)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </Box>
      )}
      {!recipe && !loading && <Typography variant="h5">:/ Could Not Find Recipe You Are Looking For!</Typography>}
      {!recipe && loading && <Typography variant="h5">Loading ... </Typography>}
    </Container>
  );
}

export default Recipe;
