import { Request, Response, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/user';
import { Op } from 'sequelize';


dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ username }, { email }],
      },
    });

    if (existingUser) {
      res.status(400).json({ error: 'u_e_not_unique' });
      return
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET!,
      { expiresIn: '12h' }
    );

    res.status(201).json({ message: 'User registered successfully', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'reg_failed' });
  }
};


export const login: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {

    const user = await User.findOne({ where: { email } });

    if (!user) {
      res.status(400).json({ error: 'user_nf' });
      return;
    }


    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(400).json({ error: 'bad_creds' });
      return
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET!,
      { expiresIn: '12h' }
    );

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
};


export const validateUser = (req: Request, res: Response): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Unauthorized: No token provided' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {

    const decoded = jwt.verify(token, JWT_SECRET!);

    res.status(200).json({ valid: true, user: decoded });
  } catch (error) {
    console.error('Token validation failed:', error);
    res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
  }
};
