import express from 'express';
const router = express.Router();

import adminController from '../controller/admin.controller.js';
import groupController from '../controller/group.controller.js';

import { protectAdmin } from '../middleware/auth.middleware.js';

router.post('/register', adminController.registerAdmin);
router.post('/login', adminController.loginAdmin);

router.post('/createChannel', protectAdmin, adminController.createChannel);
router.post('/updateChannel', protectAdmin, adminController.updateChannel);

router.put('/makeModerator', protectAdmin, adminController.makeModerator);
router.put('/demoteToMember', protectAdmin, adminController.demoteToMember);

router.post('/createGroup', protectAdmin, groupController.createGroup)
router.put('/updateGroup', protectAdmin, groupController.updateGroup);

export default router;
