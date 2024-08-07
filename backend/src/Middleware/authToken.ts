import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthenticatedRequest extends Request {
  user?: any;
}

/**
 * Middleware function to authenticate JWT tokens.
 * This function checks the request for a JWT token in the cookies or the Authorization header.
 * If the token is present and valid, it decodes the token and attaches the user information
 * to the request object, allowing the next middleware or route handler to access the user data.
 * If the token is missing or invalid, it responds with a 401 Unauthorized status.
 *
 * @param {AuthenticatedRequest} req - The request object, extended to include user information.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function to call if authentication is successful.
 * @returns {Response | void} - Returns a response with a 401 status if the token is invalid or missing.
 */

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.jwt || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Invalid token." });
  }

  try {
    const secretKey = process.env.secretKey as string;
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token." });
  }
};
