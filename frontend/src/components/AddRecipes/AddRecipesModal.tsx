import {
  Typography,
  Box,
  Modal,
  Divider,
  Button,
  Autocomplete,
  TextField,
  IconButton,
  ListItemText,
  ListItem,
  List,
} from "@mui/material";
import { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import axiosInstance from "../../api/axiosInstance.ts";

type Props = {
  open: boolean;
  // eslint-disable-next-line no-unused-vars
  handleClose: (bool?: boolean) => void;
  userId?: string;
};

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  height: "90%",
  bgcolor: "white",
  boxShadow: 24,
  borderRadius: 5,
  p: 4,
  pr: 12,
  pl: 12,
};

type Ingredient = {
  ingredient_id: number;
  name: string;
  ingredientType?: string;
  ingredientType2?: string;
  caloriesPer100g: number;
  quantity?: number;
  unit?: string;
  note?: string;
};

export default function RecipeCard({ open, handleClose, userId }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [allIngredients, setAllIngredients] = useState<Ingredient[]>([]);
  const [ingredientInput, setIngredientInput] = useState("");

  const [countryOfOrigin, setCountryOfOrigin] = useState("");
  const [allCuisines, setAllCuisines] = useState<string[]>([]);
  const [cuisineInput, setCuisineInput] = useState<string>("");

  const handleCuisineChange = (value: string) => {
    setCountryOfOrigin(value);
  };

  useEffect(() => {
    const storedIngredients = sessionStorage.getItem("ingredients");
    if (storedIngredients && JSON.parse(storedIngredients)?.length > 0) {
      setAllIngredients(JSON.parse(storedIngredients));
    } else
      axiosInstance.get(`/ingredients`).then((response) => {
        sessionStorage.setItem("ingredients", JSON.stringify(response.data.data));
        setAllIngredients(response.data.data);
      });

    const storedCuisines = sessionStorage.getItem("cuisines");
    if (storedCuisines && JSON.parse(storedCuisines)?.length > 0) {
      setAllCuisines(JSON.parse(storedCuisines));
    } else
      axiosInstance.get(`/recipes/cuisines`).then((response) => {
        sessionStorage.setItem("cuisines", JSON.stringify(response.data.cuisines));
        setAllCuisines(response.data.data);
      });
  }, []);

  const handleAddIngredient = (ingredient: Ingredient | null) => {
    if (ingredient) {
      setIngredients([...ingredients, ingredient]);
      setIngredientInput("");
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setInstructions("");
    setCountryOfOrigin("");
    setIngredients([]);
    setIngredientInput("");
  };

  const handleFormSubmit = () => {
    const newRecipe = {
      title,
      description,
      instructions,
      country_of_origin: countryOfOrigin,
      user_id: userId,
      ingredients,
    };

    axiosInstance.post("/recipes", newRecipe).then((response) => {
      if (response.status === 201) {
        resetForm();
        handleClose(true);
      }
    });
  };

  const updateIngredient = (id: number, value: string | number, field: "unit" | "quantity") => {
    const updatedValue = field === "quantity" ? Number(value) : value;
    setIngredients((prevIngredients) =>
      prevIngredients.map((ingredient) =>
        ingredient.ingredient_id === id ? { ...ingredient, [field]: updatedValue } : ingredient
      )
    );
  };

  const deleteIngredient = (ingredient: Ingredient) => {
    setIngredients((prevIngredients) => {
      // Create a copy of the array to avoid direct mutation
      const newIngredients = [...prevIngredients];
      // Find the index of the ingredient to remove
      const index = newIngredients.findIndex((ing) => ing.ingredient_id === ingredient.ingredient_id);
      if (index !== -1) {
        // Remove the ingredient at the found index
        newIngredients.splice(index, 1);
      }
      return newIngredients;
    });
  };

  return (
    <Modal
      open={open}
      keepMounted
      onClose={() => handleClose(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2" pb={2}>
          Add Recipe
        </Typography>
        <Divider />
        <Box height="85%" overflow="auto">
          <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} fullWidth margin="normal" />
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
          <Autocomplete
            options={allCuisines}
            getOptionLabel={(option) => option}
            onChange={(event, value) => handleCuisineChange(value || "")}
            renderInput={(params) => <TextField {...params} label="Country of Origin" fullWidth margin="normal" />}
            inputValue={cuisineInput}
            value={countryOfOrigin}
            onInputChange={(event, newInputValue) => setCuisineInput(newInputValue)}
          />
          <Typography id="modal-modal-title" variant="body1" pt={2}>
            Add Ingredients
          </Typography>
          <List>
            {ingredients.map((ingredient: Ingredient) => (
              <ListItem
                key={ingredient.ingredient_id}
                secondaryAction={
                  <IconButton onClick={() => deleteIngredient(ingredient)} edge="end" aria-label="delete">
                    <DeleteIcon />
                  </IconButton>
                }
              >
                - <ListItemText primary={ingredient.name} sx={{ marginLeft: 2 }} />
                <TextField
                  label="unit"
                  value={ingredient.unit}
                  onChange={(e) => updateIngredient(ingredient.ingredient_id, e.target.value, "unit")}
                  margin="normal"
                  defaultValue="grams"
                  disabled
                />
                <TextField
                  label="quantity"
                  value={ingredient.quantity}
                  onChange={(e) => updateIngredient(ingredient.ingredient_id, e.target.value, "quantity")}
                  type="number"
                  margin="normal"
                  sx={{ marginLeft: 2 }}
                />
              </ListItem>
            ))}
          </List>
          <Autocomplete
            options={allIngredients}
            getOptionLabel={(option) => option.name}
            onChange={(event, value) => handleAddIngredient(value)}
            renderInput={(params) => <TextField {...params} label="Search Ingredients" fullWidth margin="normal" />}
            inputValue={ingredientInput}
            value={null}
            onInputChange={(event, newInputValue) => setIngredientInput(newInputValue)}
          />
        </Box>
        <Box display="flex" gap={1} justifyContent="flex-end" mt={2}>
          <Button variant="contained" color="error" onClick={() => handleClose(false)}>
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
