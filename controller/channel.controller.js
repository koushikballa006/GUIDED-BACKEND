import expressAsyncHandler from "express-async-handler";
import Channel from "../models/channel.model.js";
import User from "../models/user.model.js"

class ChannelController {

    // @desc Get all channels
    // @route GET /api/channels/getAllChannels
    // @access User and Admin

    getAllChannels = expressAsyncHandler(async (req, res) => {
        const channels = await Channel.find({});
        const channelsId = channels.map(channel => channel.channelId);
        if(channels) {
            res.status(200).json({
                channelsId
            });
        }
    })

    // @desc Get channel by id
    // @route GET /api/channels/getChannelById/:channelId
    // @access User and Admin

    getChannelById = expressAsyncHandler(async (req, res) => {
        const channel = await Channel.findOne({ channelId: req.params.channelId });
        if(channel) {
            res.status(200).json({
                channel
            });
        }
    })

    // @desc Join channel
    // @route POST /api/channels/joinChannel
    // @access User

    joinChannel = expressAsyncHandler(async (req, res) => {
        if (req.body.channelId) {
            const channel = await Channel.findOne({ channelId: req.body.channelId });
            if (channel) {
                const user = await User.findOne({ _id: req.user._id });
                const channelId = channel._id;
                if(!user) {
                    res.status(404);
                    throw new Error('User not found');
                } else {
                    const channelExist = user.channels.find(channel => channel.channelId == channelId);
                    if(channelExist) {
                        res.status(400);
                        throw new Error('User already joined this channel');
                    } else {
                        user.channels.push({
                            channelId: channelId,
                            role: 'member'
                        });
                        await user.save();
                        res.status(200).json({
                            message: 'User joined the channel'
                        });
                    }
                }
            }
        } else {
            res.status(400);
            throw new Error('Invalid channel id');
        }
    })

    // @desc Get all users of channel
    // @route GET /api/channels/getUsersOfChannel/:channelId
    // @access User and Admin

    getAllUsersOfChannel = expressAsyncHandler(async (req, res) => {
        const channelId = req.params.channelId;
        const channel = await Channel.findOne({ channelId: channelId });
    
        if(channel) {
            const id = channel._id;
            const users = await User.find({ channels: { $elemMatch: { channelId: id } } });
            res.status(200).json({
                users
            });
        } else {
            res.status(400);
            throw new Error('Invalid channel id');
        }
    })
}

export default new ChannelController();