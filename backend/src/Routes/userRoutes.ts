import express from "express";
import { signup, login, logout, getUser } from "../Controllers/UserController";
import { saveUser } from "../Middleware/authUserMW";

const userRoutes = express
  .Router()
  .post("/signup", saveUser, signup)
  .post("/login", login)
  .post("/logout", logout)
  .get("/:userId", getUser);

export default userRoutes;
