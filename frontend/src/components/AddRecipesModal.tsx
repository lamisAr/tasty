import {
  Typography,
  Box,
  Modal,
  Divider,
  Button,
  Autocomplete,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

// Define the Props type for the component
type Props = {
  open: boolean;
  handleClose: () => void;
  userId?: string
};

// Define the style for the modal content
const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  height: "80%",
  bgcolor: "white",
  boxShadow: 24,
  borderRadius: 5,
  p: 4,
};

// Define the Ingredient type
type Ingredient = {
  ingredient_id: number;
  name: string;
  ingredientType?: string;
  ingredientType2?: string;
  caloriesPer100g: number;
  quantity?: number; // Add quantity to the Ingredient type
  unit?: string; // Add unit to the Ingredient type
  note?: string; // Add note to the Ingredient type
};

export default function RecipeCard({ open, handleClose, userId }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");
  const [countryOfOrigin, setCountryOfOrigin] = useState("");
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Ingredient[]>([]);

  useEffect(() => {
    if (searchTerm) {
      axiosInstance
        .get(`/api/ingredients?search=${searchTerm}`)
        .then((response) => setSearchResults(response.data))
        .catch((error) => console.error("Error fetching ingredients:", error));
    }
  }, [searchTerm]);

  const handleAddIngredient = (ingredient: Ingredient | null) => {
    if (ingredient) {
      setIngredients([...ingredients, ingredient]);
    }
  };

  const handleFormSubmit = () => {
    const newRecipe = {
      title,
      description,
      instructions,
      country_of_origin: countryOfOrigin,
      user_id: userId, // Replace with actual user ID if available
      ingredients,
    };

    axiosInstance
      .post("/api/recipes", newRecipe)
      .then((response) => console.log("Recipe added:", response.data))
      .catch((error) => console.error("Error adding recipe:", error));
  };

  return (
    <Modal
      open={open}
      keepMounted
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2" pb={2}>
          Add Recipe
        </Typography>
        <Divider />
        <Box height={"85%"} overflow="auto">
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={4}
            margin="normal"
          />
          <TextField
            label="Instructions"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            fullWidth
            multiline
            rows={6}
            margin="normal"
          />
          <TextField
            label="Country of Origin"
            value={countryOfOrigin}
            onChange={(e) => setCountryOfOrigin(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Autocomplete
            options={searchResults}
            getOptionLabel={(option) => option.name}
            onInputChange={(event, value) => setSearchTerm(value)}
            onChange={(event, value) => handleAddIngredient(value)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search Ingredients"
                fullWidth
                margin="normal"
              />
            )}
          />
          <Box mt={2}>
            <Typography variant="h6">Selected Ingredients:</Typography>
            {ingredients.map((ingredient, index) => (
              <Typography key={index}>
                {ingredient.note} - {ingredient.quantity} {ingredient.unit}
              </Typography>
            ))}
          </Box>
        </Box>
        <Box display={"flex"} gap={1} justifyContent={"flex-end"} mt={2}>
          <Button variant="contained" color="error" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleFormSubmit}>
            Add Recipe
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
