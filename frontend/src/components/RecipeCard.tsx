import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import ImagePlaceholder from "../media/img/foodIcon.jpg";
import { useAppDispatch } from "../hooks/redux-hooks.ts";
import { addFavoriteRecipe } from "../slices/recipesSlice.ts";

type Props = {
  recipeTitle: string;
  description: string;
  recipeId: string;
  favoriteRecipeIds?: [number];
  userId?: string;
  // Add other fields as necessary
};

function RecipeCard({ recipeTitle, description, recipeId, favoriteRecipeIds, userId }: Props) {
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
  }, [favoriteRecipeIds]);
  const dispatch = useAppDispatch();
  const handleAddToFavorites = async () => {
    if (userId) {
      await dispatch(addFavoriteRecipe({ userId, recipeId: Number(recipeId) }));
      setIsFavRecipe(true);
    }
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
          <Button sx={{ color: "red" }}>Remove from Favorites</Button>
        ) : (
          <Button size="small" onClick={handleAddToFavorites}>
            + Add to Favorites
          </Button>
        )}
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  );
}

export default RecipeCard;
