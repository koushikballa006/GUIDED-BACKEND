import mongoose from "mongoose";

const ChatSchema = mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Group',
  },
  time: {
    type: Date,
    default: Date.now,
  },
},
{
  timestamps: true,
}
);

const Chat = mongoose.model('Chat', ChatSchema);
export default Chat;