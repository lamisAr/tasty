require("dotenv").config();
import { authenticate, sync } from "./db/pgdb";
import express , {Application,  NextFunction, Request, Response } from "express";
import userRoutes from "./Routes/userRoutes"

const cookieParser = require('cookie-parser')

authenticate();
sync();

const port = process.env.PORT || 5001;

const app: Application = express()

//middleware
app.use(express.json())
.use(express.urlencoded({ extended: true }))
.use(cookieParser())
.use("/api/user", userRoutes)


app.listen(port, () => console.log(`Server running at ${port}`));