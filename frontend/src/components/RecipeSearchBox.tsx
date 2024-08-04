import React from "react";
import { Box, TextField, Button, Typography } from "@mui/material";

type Props = {
  searchInput: string;
  // eslint-disable-next-line no-unused-vars
  onSearchInputChange: (value: string) => void;
  onSearchClick: () => void;
};

export default function RecipeSearchBox({ searchInput, onSearchInputChange, onSearchClick }: Props) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        backgroundColor: "#e8eff9",
        padding: "5vh 26vw;",
      }}
    >
      <Typography variant="h5" textAlign="center">
        START BY SEARCHING A RECIPE
      </Typography>
      <Box sx={{ gap: "15px", alignItems: "center", display: "inline-flex" }}>
        <TextField
          id="outlined-basic"
          label="Search A Recipe"
          variant="outlined"
          value={searchInput}
          onChange={(event) => onSearchInputChange(event.target.value)}
          style={{
            margin: "0 auto",
            width: "35vw",
            minWidth: "300px",
            backgroundColor: "white",
          }}
        />
        <Button variant="contained" onClick={onSearchClick}>
          Search
        </Button>
      </Box>
    </Box>
  );
}
