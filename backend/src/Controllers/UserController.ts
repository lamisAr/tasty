import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../db/pgmodels/User";
import { decode, encode } from "../common_lib/encodeDecode";
import { describe } from "node:test";

const bcrypt = require("bcryptjs");

/**
 * Sign up a new user.
 *
 * @param {Request} req - The request object containing user details.
 * @param {string} req.body.userName - The user's username.
 * @param {string} req.body.email - The user's email address.
 * @param {string} req.body.password - The user's password.
 * @param {string} [req.body.firstName] - The user's first name (optional).
 * @param {string} [req.body.lastName] - The user's last name (optional).
 * @param {string} [req.body.description] - A description for the user (optional).
 *
 * @param {Response} res - The response object used to send back the desired HTTP response.
 *
 * @returns {Promise<Response>} - A promise that resolves to an HTTP response.
 *
 * Status Codes:
 * - 201: User created successfully.
 * - 400: Bad request, missing required fields.
 * - 409: Conflict, user details are not correct.
 * - 500: Internal server error.
 *
 * @throws {Error} - Throws an error if there is a problem with the database operation or token generation.
 */
const signup = async (req: Request, res: Response): Promise<Response | void> => {
  try {
    const { userName, email, password, firstName, lastName, description } = req.body;
    if (userName && email && password) {
      const hashedPassword = await bcrypt.hash(decode(process.env.secretKey || "defaultSalt", password), 10);
      const data = {
        userName,
        email,
        firstName,
        lastName,
        description,
        password: hashedPassword,
      };

      // Saving the user
      const user = await User.create(data as any);

      // If user details are captured, generate a token with the user's id and the secretKey in the env file
      // Set cookie with the token generated
      if (user) {
        const token = jwt.sign({ id: user.id }, process.env.secretKey as string, {
          expiresIn: 1 * 24 * 60 * 60,
        });

        res.cookie("jwt", token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });
        // Send user's details
        return res.status(201).send({
          id: user.id,
          userName: user.userName,
          email: email,
          token,
          firstName: user.firstName,
          lastName: user.lastName,
          description: user.description,
        });
      } else {
        return res.status(409).send("Details are not correct");
      }
    } else {
      return res.status(400).send("UserName, Email and password are required");
    }
  } catch (error) {
    // console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

/**
 * Log in a user.
 *
 * @param {Request} req - The request object containing user login details.
 * @param {string} req.body.email - The user's email address.
 * @param {string} req.body.password - The user's password.
 *
 * @param {Response} res - The response object used to send back the desired HTTP response.
 *
 * @returns {Promise<Response>} - A promise that resolves to an HTTP response.
 *
 * Status Codes:
 * - 201: User logged in successfully.
 * - 401: Authentication failed, user not found or credentials are incorrect.
 * - 500: Internal server error.
 *
 * @throws {Error} - Throws an error if there is a problem with the database operation or token generation.
 */
const login = async (req: Request, res: Response): Promise<Response | void> => {
  try {
    const { email, password } = req.body;

    // Find a user by their email
    const user = await User.findOne({
      where: { email },
    });

    // If user email is found, compare password with bcrypt
    if (user) {
      if (user.deletedAt) res.status(401).send("Authentication failed: user has been deleted");
      const isSame = await bcrypt.compare(decode(process.env.secretKey || "defaultSalt", password), user.password);

      // If password is the same, generate token with the user's id and the secretKey in the env file
      if (isSame) {
        const token = jwt.sign({ id: user.id }, process.env.secretKey as string, {
          expiresIn: 1 * 24 * 60 * 60,
        });

        // If password matches with the one in the database, generate a cookie for the user
        res.cookie("jwt", token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });
        // Send user data
        return res.status(201).send({
          id: user.id,
          userName: user.userName,
          email: email,
          firstName: user.firstName,
          lastName: user.lastName,
          description: user.description,
          token: token,
        });
      } else {
        return res.status(401).send("Authentication failed");
      }
    } else {
      return res.status(401).send("Authentication failed");
    }
  } catch (error) {
    // console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

/**
 * Log out a user by clearing the JWT token cookie.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object used to send back the desired HTTP response.
 *
 * @returns {void} - Sends a JSON response indicating successful logout.
 */
const logout = (req: Request, res: Response): void => {
  // Clear the JWT token cookie
  res.cookie("jwt", "", { maxAge: 0 });
  res.status(200).json({ message: "Logged out successfully" });
};

/**
 * Retrieve a user's information by their ID.
 *
 * @param {Request} req - The request object containing the user ID.
 * @param {string} req.params.userId - The ID of the user whose information is being retrieved.
 *
 * @param {Response} res - The response object used to send back the desired HTTP response.
 *
 * @returns {Promise<Response>} - A promise that resolves to an HTTP response.
 *
 * Status Codes:
 * - 201: User information retrieved successfully.
 * - 400: User not found.
 * - 500: Internal server error.
 *
 * @throws {Error} - Throws an error if there is a problem with the database operation.
 */
const getUser = async (req: Request, res: Response): Promise<Response | void> => {
  try {
    const { userId } = req.params;

    const user = await User.findOne({
      where: { id: userId },
    });

    if (user)
      return res
        .status(201)
        .send({ id: user.id, username: user.userName, email: user.email, description: user.description });
    return res.status(400).send("User Not Found!");
  } catch (error) {
    // console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

export { signup, login, logout, getUser };
