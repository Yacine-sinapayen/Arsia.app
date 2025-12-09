import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  linkedin: {
    accessToken: {
      type: String,
      default: null
    },
    refreshToken: {
      type: String,
      default: null
    },
    expiresAt: {
      type: Date,
      default: null
    },
    personURN: {
      type: String,
      default: null
    },
    organizationURN: {
      type: String,
      default: null
    },
    organizationName: {
      type: String,
      default: null
    },
    connected: {
      type: Boolean,
      default: false
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('User', userSchema);

