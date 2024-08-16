import express from 'express';
const router = express.Router();

import GroupController from '../controller/group.controller.js';

router.get('/getAllChats/:groupId', GroupController.getAllChats);

export default router;