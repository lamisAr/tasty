import React from "react";
import Router from "./routes";
import Header from "./components/Header";
import { CssBaseline } from "@mui/material";
import "./styles/general.css";

const App = () => {
  return (
    <>
      <Header />
      <CssBaseline />
      <Router />
    </>
  );
};

export default App;
