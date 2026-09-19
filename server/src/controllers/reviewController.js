import { Review } from '../models/Review.js';
import Joi from 'joi';
import mongoose from 'mongoose';

const createReviewSchema = Joi.object({
  courseCode: Joi.string().trim().required(),

  rating: Joi.number()
    .integer()
    .min(1)
    .max(5)
    .required(),

  comment: Joi.string().trim().allow(''),

  reviewedBy: Joi.string()
    .hex()
    .length(24)
});

const updateReviewSchema = Joi.object({
  courseCode: Joi.string().trim(),

  rating: Joi.number()
    .integer()
    .min(1)
    .max(5),

  comment: Joi.string().trim().allow(''),

  reviewedBy: Joi.string()
    .hex()
    .length(24)
}).min(1);

// TODO: write a validation schema for create/update per README.md section 2.

// GET /api/reviews
// TODO: implement per README.md section 3.
export async function getAllReviews(req, res, next) {
  try {
    const reviews = await Review.find()
      .populate('reviewedBy', 'name email');

    res.json({ reviews });
  } catch (err) {
    next(err);
  }
}

// GET /api/reviews/:id
// TODO: implement per README.md sections 3 and 5.
export async function getReview(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: 'Invalid review ID'
      });
    }

    const review = await Review.findById(req.params.id)
      .populate('reviewedBy', 'name email');

    if (!review) {
      return res.status(404).json({
        message: 'Review not found'
      });
    }

    res.json({ review });
  } catch (err) {
    next(err);
  }
}

// GET /api/reviews/summary?courseCode=CS101
// TODO: implement per README.md section 4.
export async function getCourseSummary(req, res, next) {
try {
    const { courseCode } = req.query;

    if (!courseCode) {
      return res.status(400).json({
        message: 'courseCode is required'
      });
    }

    const result = await Review.aggregate([
      {
        $match: {
          courseCode: courseCode.trim()
        }
      },
      {
        $group: {
          _id: '$courseCode',
          averageRating: {
            $avg: '$rating'
          },
          reviewCount: {
            $sum: 1
          }
        }
      },
      {
        $project: {
          _id: 0,
          courseCode: '$_id',
          averageRating: {
            $round: ['$averageRating', 1]
          },
          reviewCount: 1
        }
      }
    ]);

    if (result.length === 0) {
      return res.json({
        courseCode: courseCode.trim(),
        averageRating: 0,
        reviewCount: 0
      });
    }

    res.json(result[0]);
  } catch (err) {
    next(err);
  }
}

// POST /api/reviews
// TODO: implement per README.md section 3.
export async function createReview(req, res, next) {
  try {
    const { value, error } = createSchema.validate(
      req.body,
      {
        abortEarly: false,
        stripUnknown: true
      }
    );

    if (error) {
      return res.status(400).json({
        message: error.message
      });
    }

    const review = await Review.create(value);

    res.status(201).json({ review });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        message: 'This user has already reviewed this course'
      });
    }

    next(err);
  }
}

// PATCH /api/reviews/:id
// TODO: implement per README.md sections 3 and 5.
export async function updateReview(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: 'Invalid review ID'
      });
    }

    const { value, error } = updateSchema.validate(
      req.body,
      {
        abortEarly: false,
        stripUnknown: true
      }
    );

    if (error) {
      return res.status(400).json({
        message: error.message
      });
    }

    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { $set: value },
      {
        new: true,
        runValidators: true
      }
    );

    if (!review) {
      return res.status(404).json({
        message: 'Review not found'
      });
    }

    res.json({ review });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        message: 'This user has already reviewed this course'
      });
    }

    next(err);
  }
}

// DELETE /api/reviews/:id
// TODO: implement per README.md sections 3 and 5.
export async function deleteReview(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: 'Invalid review ID'
      });
    }

    const review = await Review.findByIdAndDelete(req.params.id);

    if (!review) {
      return res.status(404).json({
        message: 'Review not found'
      });
    }

    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}
