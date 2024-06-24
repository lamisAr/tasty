require("dotenv").config();
import { authenticate, sync } from "./db/pgdb";
import express , {Application,  NextFunction, Request, Response } from "express";
import userRoutes from "./Routes/userRoutes"

const cookieParser = require('cookie-parser')
const cors = require('cors');

authenticate();
sync();

const port = process.env.PORT || 5001;

const app: Application = express()

const corsOptions ={
    origin:'http://localhost:3000', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}

//middleware
app.use(cors(corsOptions))
.use(express.json())
.use(express.urlencoded({ extended: true }))
.use(cookieParser())
.use("/api/user", userRoutes)


app.listen(port, () => console.log(`Server running at ${port}`));