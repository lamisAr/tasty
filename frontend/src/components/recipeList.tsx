// components/RecipesList.tsx
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import  {fetchRecipes, RecipeFetchParams, ErrorResponse } from "../slices/recipesSlice"
import { useAppDispatch } from "../hooks/redux-hooks";
import { RootState } from '../store'; 
import RecipeCard from './RecipeCard';
import { Container, Grid, Typography, TextField, Button, Box } from '@mui/material';

const RecipesList = () => {
  const dispatch = useAppDispatch();
  const { recipes, status, total, error } = useSelector((state:RootState) => state.recipe || {});
  const [searchInput, setSearchInput] = useState<string>("");

  var params: RecipeFetchParams = {
    page: 1,
    limit: 10,
    search: '',
    cuisine: '',
    type: '',
  };
  
  console.log(recipes)
  useEffect(() => {
    dispatch(fetchRecipes(params));
    console.log(recipes)
  }, [dispatch]);

  const handleSearchInputChange = (value: string)=>{
    setSearchInput(value);
  }

  const handleButtonClick = () =>{
    params.search = searchInput;
    dispatch(fetchRecipes(params));
  }

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'failed') {
    return <div>Error: {(error as any).message}</div>;
  }

  return (
    <Container maxWidth={false} disableGutters>
      <Box sx={{    display: 'flex',
    flexDirection: 'column',
    /* width: 50vw; */
    gap: '10px',
    backgroundColor: '#e8eff9',
    padding: '5vh 26vw;'}}>
      <Typography variant={'h5'} textAlign="center">START BY SEARCHING YOUR RECIPE</Typography>
      <Box sx={{gap:'15px', alignItems:'center', display: 'inline-flex'}}>
      <TextField id="outlined-basic" label="Outlined" variant="outlined" value= {searchInput}      onChange={(event) => handleSearchInputChange(event.target.value)}
      style={{
        margin: '0 auto',
        width: "35vw",
        backgroundColor: 'white'
      }}
    />
    <Button variant="contained" value="Search" onClick={handleButtonClick}> Search </Button>
    </Box>
    </Box>
      <p>Total Recipes: {total}</p>
      <Grid sx={{ width:'100%'}} container justifyContent="space-between">
        {recipes? recipes.map((recipe: any) => (
          <Grid  item ><RecipeCard recipeTitle={recipe.title} description={recipe.description} ingredients={recipe.ingredients}></RecipeCard></Grid>
        )): <Typography>no data yet</Typography>}
      </Grid>

    </Container>
  );
};

export default RecipesList;
