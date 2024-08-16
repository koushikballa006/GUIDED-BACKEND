import mongoose from "mongoose";

const GroupSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  groupId: {
    type: String,
    required: true,
  },
  channel: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['public', 'private'],
    default: 'public',
  }
},
{
  timestamps: true,
}
);

const Group = mongoose.model('Group', GroupSchema);
export default Group;