import React from "react";
import { useAppSelector } from "../hooks/redux-hooks";
import RecipesList from "../components/recipeList";
import { Container, Box, Typography, IconButton, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AddRecipeModal from "../components/AddRecipesModal";

const UserRecipes = () => {
  const [openRecipeModal, setOpenRecipeModal] = React.useState(false);
  const handleOpenRecipeModal = () => setOpenRecipeModal(true);

  const basicUserInfo = useAppSelector((state) => state.auth.basicUserInfo);

  const handleCloseRecipeModal = () => {
    setOpenRecipeModal(false);
  };

  return (
    <>
      <Container maxWidth="xl" sx={{ padding: "0px !important" }}>
        <Box display={"flex"} alignItems={"center"} pt={4}>
          <Typography variant="h5" fontWeight={"bold"}>
            My Recipes
          </Typography>
          <Tooltip title="Add a new recipe" onClick={handleOpenRecipeModal}>
            <IconButton>
              <AddIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Container>
      <RecipesList isUserRecipe={true} userId={basicUserInfo?.id}></RecipesList>
      <AddRecipeModal
        open={openRecipeModal}
        handleClose={handleCloseRecipeModal}
        userId={basicUserInfo?.id}
      ></AddRecipeModal>
    </>
  );
};

export default UserRecipes;
