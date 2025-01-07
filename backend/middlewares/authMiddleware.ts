import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET?.toString();

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    console.log("No ACCESS");
    res.status(401).json({ message: 'Token missing' }); 
    return
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET!);
    const { exp } = decoded as jwt.JwtPayload;

    
    if (exp && Date.now() >= exp * 1000) {
      console.log("Token expired");
      res.status(400).json({ message: 'Token expired', error: 'token_exp' }); 
      return
    }

    console.log("Token is valid", decoded);
    req.user = decoded; 
    next(); 
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(400).json({ message: 'Invalid token', error: 'token_invalid' }); 
    return
  }
};
