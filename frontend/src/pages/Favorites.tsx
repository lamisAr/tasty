import React from "react";
import { Container, Box, Typography } from "@mui/material";
import { useAppSelector } from "../hooks/redux-hooks.ts";
import RecipesList from "../components/recipeList.tsx";

function Favorites() {
  const basicUserInfo = useAppSelector((state) => state.auth.basicUserInfo);

  return (
    <>
      <Container maxWidth="xl" sx={{ padding: "0px !important" }}>
        <Box display="flex" alignItems="center" pt={4}>
          <Typography variant="h5" fontWeight="bold">
            Favorites
          </Typography>
        </Box>
      </Container>
      <RecipesList isFavRecipe userId={basicUserInfo?.id} />
    </>
  );
}

export default Favorites;
