import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { check } from 'express-validator';

const router = Router();

router.post(
  '/register',
  [
    check('email').isEmail().withMessage('Invalid email').normalizeEmail(),
    check('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters')
      .matches(/\d/)
      .withMessage('Password must contain a number'),
  ],
  register
);

router.post(
  '/login',
  [
    check('email').isEmail().withMessage('Email is invalid').normalizeEmail(),
    check('password').notEmpty().withMessage('Password is required'),
  ],
  login
);
router.get('/profile', authenticate, (req, res) => {
  res.json({ message: 'Access granted to protected route', user: req.user });
});

export default router;
