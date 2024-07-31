import React from "react";
import { Container, Box, Typography, IconButton, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useAppSelector } from "../hooks/redux-hooks.ts";
import RecipesList from "../components/recipeList.tsx";
import AddRecipeModal from "../components/AddRecipesModal.tsx";

function UserRecipes() {
  const [openRecipeModal, setOpenRecipeModal] = React.useState(false);
  const handleOpenRecipeModal = () => setOpenRecipeModal(true);

  const basicUserInfo = useAppSelector((state) => state.auth.basicUserInfo);

  const handleCloseRecipeModal = () => {
    setOpenRecipeModal(false);
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
      <RecipesList isUserRecipe userId={basicUserInfo?.id} />
      <AddRecipeModal open={openRecipeModal} handleClose={handleCloseRecipeModal} userId={basicUserInfo?.id} />
    </>
  );
}

export default UserRecipes;
