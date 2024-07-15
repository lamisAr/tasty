import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux-hooks";
import { getUser } from "../slices/authSlice";
import RecipesList from "../components/RecipeList";
import { CssBaseline } from "@mui/material";

const Home = () => {
  const dispatch = useAppDispatch();

  const basicUserInfo = useAppSelector((state) => state.auth.basicUserInfo);

  useEffect(() => {
    if (basicUserInfo) {
      dispatch(getUser(basicUserInfo.id));
    }
  }, [basicUserInfo]);

  return (
    <>
      <CssBaseline />
      <RecipesList></RecipesList>
    </>
  );
};

export default Home;
