// middleware/saveUser.ts
import { Request, Response, NextFunction } from "express";
import User from "../db/pgmodels/User";

// Function to check if username or email already exists in the database
// This is to avoid having two users with the same username and email

/**
 *
 * @param req
 * @param res
 * @param next
 * @returns
 */
const saveUser = async (req: Request, res: Response, next: NextFunction) => {
  const { userName, email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return res.status(400).send("Email and password are required");
  }

  // Search the database to see if the user exists
  try {
    const username = await User.findOne({
      where: { userName },
    });

    // If username exists in the database respond with a status of 409
    if (username) {
      return res.status(409).send("Username already taken");
    }

    // Checking if email already exists
    const emailCheck = await User.findOne({
      where: { email },
    });

    // If email exists in the database respond with a status of 409
    if (emailCheck) {
      return res.status(409).send("Email already registered");
    }

    next();
  } catch (error) {
    // console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

// Exporting module
export { saveUser };
