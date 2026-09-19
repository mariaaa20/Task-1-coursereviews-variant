import test from 'node:test';
import assert from 'node:assert/strict';
import { Review } from '../src/models/Review.js';

test('Review schema defines the required fields and rating bounds', () => {
  const schema = Review.schema.tree;

  assert.equal(schema.courseCode.required, true);
  assert.equal(schema.rating.required, true);
  assert.equal(schema.rating.min, 1);
  assert.equal(schema.rating.max, 5);
  assert.equal(schema.rating.type, Number);
});

test('Review schema includes a unique compound index for course and reviewer', () => {
  const indexes = Review.schema.indexes();
  const hasCourseReviewerIndex = indexes.some((index) => {
    const fields = Array.isArray(index[0]) ? index[0] : Object.keys(index[0] || {});
    return fields.includes('courseCode') && fields.includes('reviewedBy');
  });

  assert.equal(hasCourseReviewerIndex, true);
});
