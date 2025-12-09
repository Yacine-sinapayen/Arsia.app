import mongoose from 'mongoose';

const publicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  location: {
    type: String,
    default: ''
  },
  workType: {
    type: String,
    default: ''
  },
  date: {
    type: Date,
    default: Date.now
  },
  imageUrl: {
    type: String,
    required: true
  },
  seoText: {
    type: String,
    default: ''
  },
  tags: {
    type: [String],
    default: []
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  publishedAt: {
    type: Date
  },
  linkedinPostId: {
    type: String,
    default: null
  }
});

export default mongoose.model('Publication', publicationSchema);

