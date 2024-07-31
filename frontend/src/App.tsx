import React from "react";
import { CssBaseline } from "@mui/material";
import Router from "./routes/index.tsx";
import Header from "./components/Header.tsx";
import "./styles/general.css";

function App() {
  return (
    <>
      <Header />
      <CssBaseline />
      <Router />
    </>
  );
}

export default App;
