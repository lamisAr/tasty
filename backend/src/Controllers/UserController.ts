import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../db/pgmodels/User"; // Adjust the import path to match your project structure

const bcrypt = require("bcryptjs");
// Signing a user up
// Hashing user's password before it's saved to the database with bcrypt
const signup = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const { userName, email, password } = req.body;
    if (userName && email && password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const data = {
        userName,
        email,
        password: hashedPassword,
      };

      // Saving the user
      const user = await User.create(data as any);

      // If user details are captured, generate a token with the user's id and the secretKey in the env file
      // Set cookie with the token generated
      if (user) {
        const token = jwt.sign(
          { id: user.id },
          process.env.secretKey as string,
          {
            expiresIn: 1 * 24 * 60 * 60 * 1000,
          }
        );

        res.cookie("jwt", token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });
        console.log("user", JSON.stringify(user, null, 2));
        console.log(token);
        // Send user's details
        return res.status(201).send({id:user.id, userName: user.userName, email: email});
      } else {
        return res.status(409).send("Details are not correct");
      }
    } else {
      return res.status(400).send("UserName, Email and password are required");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

// Login authentication
const login = async (req: Request, res: Response): Promise<Response | void> => {
  try {
    const { email, password } = req.body;

    // Find a user by their email
    const user = await User.findOne({
      where: { email },
    });

    // If user email is found, compare password with bcrypt
    if (user) {
      if (user.deletedAt)
        res.status(401).send("Authentication failed: user has been deleted");
      const isSame = await bcrypt.compare(password, user.password);

      // If password is the same, generate token with the user's id and the secretKey in the env file
      if (isSame) {
        const token = jwt.sign(
          { id: user.id },
          process.env.secretKey as string,
          {
            expiresIn: 1 * 24 * 60 * 60 * 1000,
          }
        );

        // If password matches with the one in the database, generate a cookie for the user
        res.cookie("jwt", token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });
        console.log("user", JSON.stringify(user, null, 2));
        console.log(token);
        // Send user data
        return res.status(201).send(user);
      } else {
        return res.status(401).send("Authentication failed");
      }
    } else {
      return res.status(401).send("Authentication failed");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

export { signup, login };
