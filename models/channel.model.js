import mongoose from 'mongoose';

const channelSchema = mongoose.Schema({
  channelId: {
    type: String,
    required: [true, 'Please enter channel id'],
  },
  name: {
    type: String,
    required: [true, 'Please enter channel name'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please enter channel description'],
    trim: true,
  },
  imageUrl: {
    type: String,
    required: [true, 'Please enter channel image'],
  },
},
{
  timestamps: true,
});

export default mongoose.model('Channel', channelSchema);