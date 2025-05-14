import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import User from '../models/user.model';
import { validationResult } from 'express-validator';
import dotenv from 'dotenv';

dotenv.config();

const jwtSecret: string  = process.env.JWT_SECRET || 'default_secret'; 

const expiresIn: string = process.env.JWT_EXPIRES_IN || '1h';

interface JwtPayload {
  id: number;
  email: string;
}

export const register = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  try {
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword });

    res.status(201).json({ id: user.id, email: user.email });
  } catch (err) {
    console.error('Register Error:', err);
    res.status(500).json({ message: 'Internal server error', error: err });
  }
};

export const login = async (req: Request, res: Response): Promise<Response> => {
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
    };

    const token = jwt.sign(payload, jwtSecret, {
        expiresIn
   });

    return res.status(200).json({ token });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error', error: err });
  }
};