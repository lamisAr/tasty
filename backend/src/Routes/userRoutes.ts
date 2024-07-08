import express from "express";
import { signup, login } from "../Controllers/UserController";
import { saveUser } from "../Middleware/authUserMW";

const userRoutes = express
  .Router()
  .post("/signup", saveUser, signup)
  .post("/login", login);

export default userRoutes;
