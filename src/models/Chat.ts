import mongoose, { Schema } from 'mongoose';
import { Types } from 'mongoose';

interface IChat extends Document {
  buyer: Types.ObjectId;
  seller: Types.ObjectId;
  messages: {
    sender: Types.ObjectId;
    content: string;
    timestamp: Date;
  }[];
  product: Types.ObjectId;
  lastMessage: Date;
}

const ChatSchema = new Schema<IChat>({
  buyer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  seller: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  messages: [{
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  lastMessage: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Chat = mongoose.model<IChat>('Chat', ChatSchema);

export default Chat; 