import express from "express";
import { signup, login, logout } from "../Controllers/UserController";
import { saveUser } from "../Middleware/authUserMW";

const userRoutes = express.Router().post("/signup", saveUser, signup).post("/login", login).post("/logout", logout);

export default userRoutes;
