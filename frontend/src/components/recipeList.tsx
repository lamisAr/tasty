// components/RecipesList.tsx
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import  {fetchRecipes, RecipeFetchParams, ErrorResponse } from "../slices/recipesSlice"
import { useAppDispatch } from "../hooks/redux-hooks";
import { RootState } from '../store'; 

const RecipesList = () => {
  const dispatch = useAppDispatch();
  const { recipes, status, total, error } = useSelector((state:RootState) => state.recipe || {});
  
  console.log(recipes)
  useEffect(() => {
    const params: RecipeFetchParams = {
      page: 1,
      limit: 10,
      search: '',
      cuisine: '',
      type: '',
    };
    dispatch(fetchRecipes(params));
    console.log(recipes)
  }, [dispatch]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'failed') {
    return <div>Error: {(error as any).message}</div>;
  }

  return (
    <>
      <h1>Recipes</h1>
      <p>Total Recipes: {total}</p>
      <ul>
        {recipes? recipes.map((recipe: any) => (
          <li key={recipe.recipe_id}>{recipe.title}</li>
        )): <div>no data yet</div>}
      </ul>

    </>
  );
};

export default RecipesList;
