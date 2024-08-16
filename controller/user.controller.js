import expressAsyncHandler from 'express-async-handler';
import User from '../models/user.model.js';
import Channel from '../models/channel.model.js';
import generateToken from '../utils/generateToken.js';

class UserController {
  // @desc    Register a new user
  // @route   POST /api/users/register
  // @access  Public

  registerUser = expressAsyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    const user = await User.create({ name, email, password });

    if (user) {
      generateToken(res, user._id);

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  });

  // @desc    Login user
  // @route   POST /api/users/login
  // @access  Public

  loginUser = expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body;
    // console.log(email, password)

    const user = await User.findOne({ email });

    const matchPassword = await user.matchPassword(password);
    if (user && matchPassword) {
      generateToken(res, user._id);

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  });

  // @desc   Logout user
  // @route  POST /api/users/logout
  // @access Private

  logoutUser = expressAsyncHandler(async (req, res) => {
    res
      .cookie('jwt', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV !== 'development' ? 'none' : 'lax',
        expires: new Date(0),
      })
      .send({
        message: 'Logged out',
        success: true,
      });
  });

  // @desc   Get all users
  // @route  GET /api/users
  // @access Public

  getAllUsers = expressAsyncHandler(async (req, res) => {
    const users = await User.find({ role: 'user' }).populate(
      'channels.channelId',
      'channelId name description imageUrl'
    );
    if (users) {
      res.status(200).json(users);
    } else {
      res.status(404);
      throw new Error('No users found');
    }
  });

  // @desc   Get user by id
  // @route  GET /api/users/:id
  // @access Private

  getUserById = expressAsyncHandler(async (req, res) => {
    const { userId } = req.params;
    const user = await User.findById(userId).populate(
      'channels.channelId',
      'channelId name description imageUrl'
    );

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404);
      throw new Error('No user found');
    }
  });

  // @desc  Is user in channel
  // @route GET /api/users/isUserInChannel/:channelId
  // @access Private

  isUserInChannel = expressAsyncHandler(async (req, res) => {
    const { channelId } = req.params;
    const { _id } = req.user;

    const channel = await Channel.findOne({ channelId });
    if (!channel) {
      res.status(404);
      throw new Error('Channel not found');
    }

    const user = await User.findOne({ _id, 'channels.channelId': channel._id });
    if (user) {
      res.status(200).json({ isInChannel: true });
    } else {
      res.status(200).json({ isInChannel: false });
    }
  });
}

export default new UserController();