import React, { useState } from "react";
import { LockOutlined } from "@mui/icons-material";
import { Container, CssBaseline, Box, Avatar, Typography, TextField, Button, Grid } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../hooks/redux-hooks.ts";
import { login } from "../slices/authSlice.ts";
import { encode } from "../common_lib/encodeDecode.ts";

function Login() {
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (email && password) {
      try {
        const encodedPassword = encode(process.env.secretKey || "defaultSalt", password);
        await dispatch(
          login({
            email,
            password: encodedPassword,
          })
        ).unwrap();
        navigate("/home");
      } catch (e) {
        navigate("/login");
      }
    }
  };

  return (
    <Container maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          mt: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "primary.light" }}>
          <LockOutlined />
        </Avatar>
        <Typography variant="h5">Login</Typography>
        <Box sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            id="password"
            name="password"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />

          <Button fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} onClick={handleLogin}>
            Login
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link to="/register">Don&apos;t have an account? Register</Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default Login;
