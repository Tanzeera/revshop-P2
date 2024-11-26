/* eslint-disable no-unused-vars */
// ProductReview.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import Head from '../../components/common/Head';

function ProductReview({ productId, userID }) {
  const [reviews, setReviews] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const initialReviewLimit = 5;

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`http://localhost:8082/reviews/product/${productId}`);
      setReviews(response.data);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  // Determine how many reviews to display based on "show all" state
  const displayedReviews = showAll ? reviews : reviews.slice(0, initialReviewLimit);

  return (
    <div className="my-8 max-w-full mx-auto px-6">
      <Head h1="Product Reviews" h2="" />

      {/* Display Reviews */}
      <div className="border-t mt-8">
        {displayedReviews.length > 0 ? (
          displayedReviews.map((review, index) => (
            <motion.div
              key={index}
              className="mb-6 p-6 bg-gray-50 rounded-lg shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <p className="text-lg text-gray-800 mb-2">{review.reviewText}</p>
              <div className="flex items-center text-yellow-500">
                <span>{'⭐'.repeat(review.rating)}</span>
                <span className="ml-2 text-gray-600">({review.rating}/5)</span>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-gray-600 text-center">No reviews yet. Be the first to review this product!</p>
        )}

        {/* Show More / Show Less Button */}
        {reviews.length > initialReviewLimit && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="mt-4 w-full py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-all duration-300"
          >
            {showAll ? 'Show Less' : 'Show More'}
          </button>
        )}
      </div>
    </div>
  );
}

export default ProductReview;
