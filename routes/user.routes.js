import express from 'express';
import { protectUser } from '../middleware/auth.middleware.js';

import userController from '../controller/user.controller.js';

const router = express.Router();

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.post('/logout', protectUser, userController.logoutUser);

router.get('/getAllUsers', userController.getAllUsers);
router.get('/getUserById/:userId', protectUser, userController.getUserById);

router.get(
  '/isUserInChannel/:channelId',
  protectUser,
  userController.isUserInChannel
);

export default router;