import express from 'express';
const router = express.Router();

import { protectModerator } from '../middleware/auth.middleware.js';
import groupController from '../controller/group.controller.js';

router.post('/createGroup', protectModerator, groupController.createGroup);

router.put('/updateGroup', protectModerator, groupController.updateGroup);

export default router;