// middleware/saveUser.ts
import { Request, Response, NextFunction } from "express";
import User from "../db/pgmodels/User";

/**
 * Middleware function to check for existing users before saving a new user.
 * This function verifies if the provided username or email already exists in the database.
 * If the username or email is found, it responds with a conflict status (409).
 * If the username and email are unique, it proceeds to the next middleware or route handler.
 *
 * @param {Request} req - The request object containing the user details in the body.
 * @param {Response} res - The response object to send back HTTP responses.
 * @param {NextFunction} next - The next middleware function to call if validation is successful.
 * @returns {Response | void} - Returns a response with a 409 status if the username or email already exists,
 *                              or a 500 status if an internal server error occurs.
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
