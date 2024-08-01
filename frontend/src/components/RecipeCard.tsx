import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import ImagePlaceholder from "../media/img/foodIcon.jpg";

type Props = {
  recipeTitle: string;
  description: string;
  recipeId: string;
  // Add other fields as necessary
};

function RecipeCard({ recipeTitle, description, recipeId }: Props) {
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
        <Button size="small">+ Add to Favorites</Button>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  );
}

export default RecipeCard;
