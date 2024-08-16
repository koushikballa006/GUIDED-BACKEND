import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/user.model.js';
import Channel from '../models/channel.model.js';

const protectAdmin = asyncHandler(async (req, res, next) => {
  let token;
  token = req.cookies.jwt

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.userId).select('-password');

      if(req.user.role !== 'admin') {
        throw new Error('Not authorized as an admin');
      }

      next();
    } catch (error) {
      console.error(error);
      if(error.message == 'Not authorized as an admin') {
        res.status(401);
        throw new Error('Not authorized as an admin');
      } else {
        res.status(401);
        throw new Error('Not authorized, token failed');
      }
    }
  } else {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

const protectUser = asyncHandler(async (req, res, next) => {
  let token;
  token = req.cookies.jwt

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.userId).select('-password');

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  } else {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

const protectModerator = asyncHandler(async (req, res, next) => {
  let token;
  token = req.cookies.jwt
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.userId).select('-password');
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }

    let { channelId } = req.body;
    const channel = await Channel.findOne({ channelId: channelId });
    if(!channel) {
      res.status(400);
      throw new Error('Channel does not exist');
    } else {
      channelId = channel._id.toString();
      let isModerator = false
      req.user.channels.forEach((channel) => {
        if(channel.channelId === channelId) {
          isModerator = channel.role === 'moderator';
        }
      })

      if(!isModerator) {
        res.status(401);
        throw new Error('Not authorized as a moderator');
      } else {
        next();
      }
    }

  } else {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

export { protectAdmin, protectUser, protectModerator };
