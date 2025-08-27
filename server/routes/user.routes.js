import {Router} from 'express';
import { body } from 'express-validator';

import * as userController from '../controllers/user.controller.js';
import * as authMiddleware from '../middlewear/auth.middlewear.js';

const router = Router();

router.post('/register',
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    userController.createUserController
);

router.post('/login',
    body('email').isEmail().withMessage('Invalid email'),
    body('password').exists().withMessage('Password is required'),
    userController.loginUserController
);

router.get('/profile', authMiddleware.authUser, userController.getUserProfileController);
router.get('/logout', authMiddleware.authUser, userController.logoutUserController);
export default router;