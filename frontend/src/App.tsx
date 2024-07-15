import React from 'react';
import Router from "./routes";
import Header from './components/Header';
import { CssBaseline } from "@mui/material";

const App = () => {
  return (
    <>
    <Header/>
    <CssBaseline />
    <Router/>
    </>
  );
};

export default App;
