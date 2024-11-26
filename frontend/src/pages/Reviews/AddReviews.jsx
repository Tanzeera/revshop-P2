/* eslint-disable no-unused-vars */
import axios from 'axios';
import React, { useState } from 'react'
import { FaStar } from 'react-icons/fa'
import { toast } from 'react-toastify';

const AddReviews = ({productID, userID, operation}) => {
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

//   console.log("userId : ", userID);
//   console.log("productID : ", productID);
  
  


  const handleAddReview = async () => {
    if (!reviewText || !rating) {
      toast.error('Please enter a review and rating');
      return;
    }

    const newReview = {
      product: {id : productID},
      userId: userID,
      rating,
      reviewText,
    };

    try {
      const response = await axios.post('http://localhost:8082/reviews/add', newReview);
      if (response.status === 200) {
        toast.success('Review added successfully!');
        setReviewText('');
        setRating(0);
        operation();
      }
    } catch (error) {
      console.error('Failed to add review:', error);
      toast.error('Failed to add review.');
    }
  };




  return (
    <div className="mb-8 mt-8 p-8 bg-gradient-to-r from-teal-300 to-cyan-300 shadow-lg rounded-xl text-white transition-all duration-300">
        <h3 className="text-2xl font-bold mb-6 text-white">Add Your Review</h3>
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Write your review..."
          className="w-full p-4 mb-4 bg-white bg-opacity-20 rounded-lg text-teal-800 placeholder-gray-200 border-none focus:ring-2 focus:ring-blue-300 focus:outline-none transition-all duration-300 resize-none"
          rows="4"
        />
        <div className="flex items-center mb-6">
          <label className="mr-4 text-lg font-semibold">Rating:</label>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                size={30}
                className={`cursor-pointer transition-all ${
                  (hoverRating || rating) >= star ? 'text-yellow-400' : 'text-gray-300'
                }`}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
              />
            ))}
          </div>
        </div>
        <button
          onClick={handleAddReview}
          className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg"
        >
          Submit Review
        </button>
      </div>
  )
}

export default AddReviews
