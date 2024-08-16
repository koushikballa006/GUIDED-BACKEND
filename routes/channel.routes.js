import express from 'express';
import { protectUser } from '../middleware/auth.middleware.js';

import channelController from '../controller/channel.controller.js';
import groupController from '../controller/group.controller.js';

const router = express.Router();

router.get('/getAllChannels', channelController.getAllChannels);
router.get('/getChannelById/:channelId', channelController.getChannelById);

router.post('/joinChannel', protectUser, channelController.joinChannel);

router.get(
  '/getUsersOfChannel/:channelId',
  channelController.getAllUsersOfChannel
);

router.get(
  '/getAllGroups/:channelId',
  protectUser,
  groupController.getAllGroups
);

export default router;