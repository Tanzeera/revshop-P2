import { useEffect, useState } from 'react';
import axios from 'axios';
import Head from '../components/common/Head';
import Table from '../components/common/TableReview'; // Import the TableReview component

const Review = () => {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await axios.get('http://localhost:8082/reviews'); // Replace with your reviews endpoint
                setReviews(response.data);
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching reviews:', error);
            }
        };

        fetchReviews();
    }, []);

    const deleteReview = async (reviewId) => {
        try {
            await axios.delete(`http://localhost:8082/reviews/${reviewId}`); // Replace with your delete review endpoint
            setReviews(reviews.filter(review => review.id !== reviewId)); // Update state
        } catch (error) {
            console.error('Error deleting review:', error);
        }
    };

    return (
        <div>
            <div className="mx-auto max-w-screen-xl px-4 pt-8 mt-8 sm:py-12">
                <Head h1="All" h2="Reviews" />
            </div>
            <div className="pl-10 w-full max-w-6xl mx-auto mb-32">
                <Table reviews={reviews} onDeleteReview={deleteReview} /> {/* Pass deleteReview function */}
            </div>
        </div>
    );
};

export default Review;