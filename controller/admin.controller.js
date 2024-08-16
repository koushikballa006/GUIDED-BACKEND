import expressAsyncHandler from 'express-async-handler';
import Admin from '../models/user.model.js';
import User from '../models/user.model.js';
import Channel from '../models/channel.model.js';
import generateToken from '../utils/generateToken.js';

class AdminController {
  // desc Register a new admin
  // @route POST /api/admin/register
  // @access Public

  registerAdmin = expressAsyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    const adminExist = await Admin.findOne({ email });

    if (adminExist) {
      res.status(400);
      throw new Error('Admin already exists');
    }

    const admin = await Admin.create({ name, email, password, role: 'admin' });

    if (admin) {
      generateToken(res, admin._id);

      res.status(201).json({
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      });
    } else {
      res.status(400);
      throw new Error('Invalid admin data');
    }
  });

  // @desc Login the admin
  // @route POST /api/admin/login
  // @access Public

  loginAdmin = expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    const matchPassword = await admin.matchPassword(password);
    if (admin && matchPassword && admin.role == 'admin') {
      generateToken(res, admin._id);

      res.json({
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  });

  // @desc Create the channel
  // @route POST /api/admin/createChannel
  // @access Private - Admin

  createChannel = expressAsyncHandler(async (req, res) => {
    const { channelId, name, description, imageUrl } = req.body;

    const channelExist = await Channel.findOne({ channelId });
    if (channelExist) {
      res.status(400);
      throw new Error('Channel already exists');
    }

    const channel = await Channel.create({
      channelId,
      name,
      description,
      imageUrl,
    });
    if (channel) {
      res.status(201).json({
        _id: channel._id,
        channelId: channel.channelId,
        name: channel.name,
        description: channel.description,
        imageUrl: channel.imageUrl,
      });
    } else {
      res.status(400);
      throw new Error('Invalid channel data');
    }
  });

  // @desc Update the channel
  // @route POST /api/admin/updateChannel
  // @access Private - Admin

  updateChannel = expressAsyncHandler(async (req, res) => {
    const { channelId, name, description, imageUrl } = req.body;
    const channelExist = await Channel.findOne({ channelId });

    if (!channelExist) {
      res.statuschannelExist;
      throw new Error('Channel does not exist');
    }

    const channel = await Channel.findOneAndUpdate(
      { channelId },
      { name, description, imageUrl }
    );
    if (channel) {
      res.status(201).json({
        _id: channel._id,
        channelId: channel.channelId,
        name: channel.name,
        description: channel.description,
        imageUrl: channel.imageUrl,
      });
    } else {
      res.status(400);
      throw new Error('Invalid channel data');
    }
  });

  // @desc Promote a user to moderator
  // @route POST /api/admin/makeModerator
  // @access Private - Admin

  makeModerator = expressAsyncHandler(async (req, res) => {
    var { channelId, userEmail } = req.body;
    const user = await User.findOne({ email: userEmail });
    const channel = await Channel.findOne({ channelId });
    console.log(channel);
    channelId = channel._id.toString();
    if (!user) {
      res.status(400);
      throw new Error('User does not exist');
    } else {
      var isMemeber = false;
      user.channels.forEach((channel) => {
        if (channel.channelId == channelId) {
          isMemeber = true;
        }
      });

      if (!isMemeber) {
        res.status(400);
        throw new Error('User is not a member of this channel');
      }

      const isAlreadyModerator =
        (await user.channels.find((channel) => channel.channelId == channelId)
          .role) == 'moderator';

      if (isAlreadyModerator) {
        res.status(400);
        throw new Error('User is already a moderator');
      }

      const updatedUser = await User.findOneAndUpdate(
        { email: userEmail, 'channels.channelId': channelId },
        { $set: { 'channels.$.role': 'moderator' } }
      );

      if (updatedUser) {
        res.status(201).json({
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          channels: {
            channelId: channelId,
            role: 'moderator',
          },
        });
      } else {
        res.status(400);
        throw new Error('Invalid user data');
      }
    }
  });

  // @desc Demote a user to member
  // @route POST /api/admin/demoteToMember
  // @access Private - Admin

  demoteToMember = expressAsyncHandler(async (req, res) => {
    var { channelId, userEmail } = req.body;
    const user = await User.findOne({ email: userEmail });
    const channel = await Channel.findOne({ channelId });
    channelId = channel._id.toString();
    if (!user) {
      res.status(400);
      throw new Error('User does not exist');
    } else {
      var isMember = false;
      user.channels.forEach((channel) => {
        if (channel.channelId == channelId) {
          isMember = true;
        }
      });

      if (!isMember) {
        res.status(400);
        throw new Error('User is not a member of this channel');
      }

      const isAlreadyMember =
        (await user.channels.find((channel) => channel.channelId == channelId)
          .role) == 'member';

      if (isAlreadyMember) {
        res.status(400);
        throw new Error('User is already a memeber');
      }

      const updatedUser = await User.findOneAndUpdate(
        { email: userEmail, 'channels.channelId': channelId },
        { $set: { 'channels.$.role': 'member' } }
      );

      if (updatedUser) {
        res.status(201).json({
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          channels: {
            channelId: channelId,
            role: 'member',
          },
        });
      } else {
        res.status(400);
        throw new Error('Invalid user data');
      }
    }
  });
}

export default new AdminController();
