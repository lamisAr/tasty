import React from "react";
import { Container, Box, Typography, IconButton, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useAppSelector } from "../hooks/redux-hooks.ts";
import RecipesList from "../components/recipeList.tsx";
import AddRecipeModal from "../components/AddRecipes/AddRecipesModal.tsx";

function UserRecipes() {
  const [openRecipeModal, setOpenRecipeModal] = React.useState(false);
  const handleOpenRecipeModal = () => setOpenRecipeModal(true);
  const [refreshKey, setRefreshKey] = React.useState(0);

  const basicUserInfo = useAppSelector((state) => state.auth.basicUserInfo);

  const handleCloseRecipeModal = (recipeSubmitted?: boolean) => {
    setOpenRecipeModal(false);
    if (recipeSubmitted) {
      setRefreshKey((oldKey) => oldKey + 1);
    }
  };

  return (
    <>
      <Container maxWidth="xl" sx={{ padding: "0px !important" }}>
        <Box display="flex" alignItems="center" pt={4}>
          <Typography variant="h5" fontWeight="bold">
            My Recipes
          </Typography>
          <Tooltip title="Add a new recipe" onClick={handleOpenRecipeModal}>
            <IconButton>
              <AddIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Container>
      <RecipesList key={refreshKey} isUserRecipe userId={basicUserInfo?.id} />
      <AddRecipeModal open={openRecipeModal} handleClose={handleCloseRecipeModal} userId={basicUserInfo?.id} />
    </>
  );
}

export default UserRecipes;
