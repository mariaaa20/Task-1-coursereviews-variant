import mongoose from 'mongoose';

// TODO: define the Review schema per README.md section 1.

const reviewSchema = new mongoose.Schema(
  {
    courseCode: {
      type: String,
      required: true,
      trim: true
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      validate: {
        validator: Number.isInteger,
        message: 'Rating must be an integer'
      }
    },

    comment: {
      type: String,
      trim: true
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  
  { timestamps: true }
);

// TODO: add the uniqueness constraint described in README.md section 1.

export const Review = mongoose.model('Review', reviewSchema);
