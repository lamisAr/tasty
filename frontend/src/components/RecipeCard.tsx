import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import ImagePlaceholder from "../media/img/foodIcon.jpg";
import { useAppDispatch } from "../hooks/redux-hooks.ts";
import { addFavoriteRecipe, removeFavoriteRecipe, deleteRecipe } from "../slices/recipesSlice.ts";

type Props = {
  recipeTitle: string;
  description: string;
  recipeId: string;
  favoriteRecipeIds?: number[];
  userId?: string;
  recipeUser: string;
  // eslint-disable-next-line
  removeRecipeFromList: () => void;
};

function RecipeCard({
  recipeTitle,
  description,
  recipeId,
  favoriteRecipeIds,
  userId,
  recipeUser,
  removeRecipeFromList,
}: Props) {
  const [isFavRecipe, setIsFavRecipe] = useState(false);
  useEffect(() => {
    if (
      favoriteRecipeIds &&
      favoriteRecipeIds.length > 0 &&
      favoriteRecipeIds.find((id: number) => {
        const idString = id.toString().trim();
        const recipeIdTrimmed = recipeId.toString().trim();
        return idString === recipeIdTrimmed;
      })
    ) {
      setIsFavRecipe(true);
    }
  }, [favoriteRecipeIds, recipeId]);
  const dispatch = useAppDispatch();
  const handleAddToFavorites = () => {
    if (userId) {
      setIsFavRecipe(true);
      dispatch(addFavoriteRecipe({ userId, recipeId: Number(recipeId) }));
    }
  };
  const handleRemoveFromFavorites = () => {
    if (userId) {
      setIsFavRecipe(false);
      dispatch(removeFavoriteRecipe({ userId, recipeId: Number(recipeId) }));
    }
  };
  const handleDeleteRecipe = () => {
    if (recipeId) {
      dispatch(deleteRecipe(recipeId)).then((res) => {
        if (res.payload && res.payload.message && res.payload.message === "Recipe deleted successfully (soft delete)")
          removeRecipeFromList();
      });
    }
  };
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate(`/recipes/${recipeId}`);
  };

  return (
    <Card className="recipe-card" id={recipeId}>
      <CardMedia component="img" height="140" image={ImagePlaceholder} alt="ImagePlaceholder" />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {recipeTitle}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
      <CardActions>
        {isFavRecipe ? (
          <Button sx={{ color: "red" }} onClick={handleRemoveFromFavorites}>
            Remove from Favorites
          </Button>
        ) : (
          <Button size="small" onClick={handleAddToFavorites}>
            + Add to Favorites
          </Button>
        )}
        <Button size="small" onClick={handleNavigation}>
          Learn More
        </Button>
        {userId && userId === recipeUser && (
          <Button sx={{ color: "red" }} size="small" onClick={handleDeleteRecipe}>
            Delete Recipe
          </Button>
        )}
      </CardActions>
    </Card>
  );
}

export default RecipeCard;
