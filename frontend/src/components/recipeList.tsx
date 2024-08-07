import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Container, Grid, Typography, Box } from "@mui/material";
import { fetchFavoriteRecipeIds, fetchRecipes, RecipeFetchParams } from "../slices/recipesSlice.ts";
import { useAppDispatch, useAppSelector } from "../hooks/redux-hooks.ts";
import { RootState } from "../store.ts";
import RecipeCard from "./RecipeCard.tsx";
import RecipeSearchBox from "./RecipeSearchBox.tsx";

type Props = {
  isUserRecipe?: boolean;
  isFavRecipe?: boolean;
  userId?: string;
};

function RecipesList({ isUserRecipe = false, isFavRecipe = false, userId }: Props) {
  const dispatch = useAppDispatch();
  const { recipes } = useSelector((state: RootState) => state.recipe || {});
  // const {status, error } = useSelector((state: RootState) => state.recipe || {});
  const [searchInput, setSearchInput] = useState<string>("");

  const basicUserInfo = useAppSelector((state) => state.auth.basicUserInfo);

  const favoriteRecipeIds = useAppSelector((state: RootState) => state.recipe.favoriteRecipeIds);

  // Memoize params to avoid unnecessary re-renders
  const params: RecipeFetchParams = useMemo(
    () => ({
      page: 1,
      limit: 100,
      search: searchInput,
      cuisine: "",
      type: "",
      ...(isUserRecipe && userId ? { userId } : {}),
      ...(isFavRecipe && userId ? { favUserId: userId } : {}),
    }),
    [searchInput, isUserRecipe, isFavRecipe, userId]
  );

  useEffect(() => {
    dispatch(fetchRecipes(params));
  }, [params]);

  useEffect(() => {
    const fetchAndSetFavoriteRecipes = async () => {
      if (basicUserInfo?.id) {
        await dispatch(fetchFavoriteRecipeIds({ userId: basicUserInfo?.id })).unwrap();
      }
    };

    fetchAndSetFavoriteRecipes();
  }, [basicUserInfo?.id]);

  const handleSearchInputChange = (value: string) => {
    setSearchInput(value);
  };

  const handleButtonClick = () => {
    params.search = searchInput;
    dispatch(fetchRecipes(params));
  };

  const removeRecipeFromList = () => {
    dispatch(fetchRecipes(params));
  };

  // if (status === "loading") {
  //   return <div>Loading...</div>;
  // }

  // if (status === "failed") {
  //   return <div>Error: {(error as any).message}</div>;
  // }

  return (
    <Container maxWidth="xl" disableGutters>
      {!(isUserRecipe || isFavRecipe) && (
        <RecipeSearchBox
          searchInput={searchInput}
          onSearchInputChange={handleSearchInputChange}
          onSearchClick={handleButtonClick}
        />
      )}
      {isFavRecipe && favoriteRecipeIds.length === 0 ? (
        <Typography mt={3}>No Favorites Available!</Typography>
      ) : (
        <Box display="flex" flexDirection="column" alignItems="center">
          <Box maxWidth="xl" width="100%">
            <Typography variant="body1" mt={2} mb={2}>
              Total Recipes: {recipes ? recipes.length : 0}
            </Typography>
          </Box>
          <Grid maxWidth="xl" container gap="20px" justifyContent="center">
            {recipes ? (
              recipes.map((recipe: any) => (
                <RecipeCard
                  key={recipe.recipe_id}
                  recipeId={recipe.recipe_id}
                  recipeTitle={recipe.title}
                  description={recipe.description}
                  favoriteRecipeIds={favoriteRecipeIds}
                  userId={basicUserInfo?.id}
                  recipeUser={recipe.user_id}
                  removeRecipeFromList={removeRecipeFromList}
                />
              ))
            ) : (
              <Typography>no data yet</Typography>
            )}
          </Grid>
        </Box>
      )}
    </Container>
  );
}

export default RecipesList;
