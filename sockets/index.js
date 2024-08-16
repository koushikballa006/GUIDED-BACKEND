import Channel from "../models/channel.model.js";
import Group from "../models/group.model.js";
import Chat from "../models/chat.model.js";

const listenForChannel = (socket, io) => {
    socket.on('chat', async (data, cb) => {
      const { message, sender, group, channel } = data;
      console.log(data);
      const groupExist = await Group.findOne({ groupId: group });
      if(!groupExist) {
        socket.emit('error', 'Group not found');
      } else {
        const chat = await Chat.create({
          message,
          sender,
          group : groupExist._id,
        })

        if(chat) {
          io.emit('chat', {
            message,
            group
          });
          cb({
            status: 'ok',
            message: 'Message sent'
          })
        } else {
          cb({
            status: 'error',
            message: 'Message not sent'
          })
        }
      }
    })
}

export {
    listenForChannel
}