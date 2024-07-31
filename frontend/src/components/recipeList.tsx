import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Container, Grid, Typography, Box } from "@mui/material";
import { fetchRecipes, RecipeFetchParams } from "../slices/recipesSlice.ts";
import { useAppDispatch } from "../hooks/redux-hooks.ts";
import { RootState } from "../store.ts";
import RecipeCard from "./RecipeCard.tsx";
import RecipeSearchBox from "./RecipeSearchBox.tsx";

type Props = {
  isUserRecipe: boolean;
  userId?: string;
};

function RecipesList({ isUserRecipe, userId }: Props) {
  const dispatch = useAppDispatch();
  const { recipes, status, error } = useSelector((state: RootState) => state.recipe || {});
  const [searchInput, setSearchInput] = useState<string>("");

  const params: RecipeFetchParams = {
    page: 1,
    limit: 10,
    search: "",
    cuisine: "",
    type: "",
    userId,
  };

  useEffect(() => {
    dispatch(fetchRecipes(params));
  }, [dispatch]);

  const handleSearchInputChange = (value: string) => {
    setSearchInput(value);
  };

  const handleButtonClick = () => {
    params.search = searchInput;
    dispatch(fetchRecipes(params));
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "failed") {
    return <div>Error: {(error as any).message}</div>;
  }

  return (
    <Container maxWidth="xl" disableGutters>
      {!isUserRecipe && (
        <RecipeSearchBox
          searchInput={searchInput}
          onSearchInputChange={handleSearchInputChange}
          onSearchClick={handleButtonClick}
        />
      )}
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
                key={recipe.id}
                recipeId={recipe.id}
                recipeTitle={recipe.title}
                description={recipe.description}
                ingredients={recipe.ingredients}
              />
            ))
          ) : (
            <Typography>no data yet</Typography>
          )}
        </Grid>
      </Box>
    </Container>
  );
}

RecipesList.defaultProps = {
  userId: "",
};
export default RecipesList;
