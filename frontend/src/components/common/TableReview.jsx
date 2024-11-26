/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../common/Button";

const TableReview = ({ reviews, onDeleteReview }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);
    const [selectedReview, setSelectedReview] = useState(null);
    const [showPopthis, setShowPopthis] = useState(false);

    const totalPages = Math.ceil(reviews.length / pageSize);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const displayedReviews = reviews.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const handleViewClick = (review) => {
        setSelectedReview(review);
        setShowPopthis(true);
    };

    const handleClosePopthis = () => {
        setShowPopthis(false);
        setSelectedReview(null);
    };

    const Popthis = ({ review, onClose }) => {
        return (
            <>
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="absolute inset-0 bg-mywhite bg-opacity-50"></div>
                    <div className="relative p-8 rounded-lg shadow-lg w-1/2 bg-mywhite text-black">
                        <button
                            onClick={onClose}
                            className="absolute top-0 right-0 mt-4 mr-4 text-xl"
                        >
                            &times;
                        </button>
                        <h2 className="font-bold mb-4 text-2xl flex items-center justify-center text-myred">Review Details</h2>
                        <div className="mb-4 text-lg">
                            <strong>Product Id:</strong> {review.product.id}
                        </div>
                        <div className="mb-4 text-lg">
                            <strong>Product Name:</strong> {review.product.name}
                        </div>
                        
                        <div className="mb-4 text-lg">
                            <strong>Product Description:</strong> {review.product.description}
                        </div>
                        <div className="mb-4 text-lg">
                            <strong>Price:</strong> ${review.product.price}
                        </div>
                        <div className="mb-4 text-lg">
                            <strong>Category:</strong> {review.product.category.name}
                        </div>
                        <div className="mb-4 text-lg">
                            <strong>User ID:</strong> {review.userId}
                        </div>
                        <div className="mb-4 text-lg">
                            <strong>Rating:</strong> {review.rating}
                        </div>
                        <div className="mb-4 text-lg">
                            <strong>Review Text:</strong> {review.reviewText}
                        </div>
                    </div>
                </div>
            </>
        );
    };

    return (
        <>
            <div className="pl-10 w-full max-w-6xl mx-auto mb-32">
                <div className="overflow-x-auto rounded-lg border border-base-300">
                    <table className="table w-full max-w-full">
                        <thead>
                            <tr className="text-neutral">
                                <th>Review ID</th>
                                <th className="pl-10">Product ID</th>
                                <th className="pl-10">Product Name</th>
                                
                                <th className="pl-10">User ID</th>
                                <th className="pl-10">Rating</th>
                                <th className="pl-10">Review Text</th>
                                <th className="pl-10">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayedReviews.map((review, index) => (
                                <tr
                                    key={review.id}
                                    className={index % 2 === 0 ? "bg-base-200" : "bg-base-100"}
                                >
                                    <td>{review.id}</td>
                                    <td className="pl-10">{review.product.id}</td>
                                    <td className="pl-10">{review.product.name}</td>
                                    <td className="pl-10">{review.userId}</td>
                                    <td className="pl-10">{review.rating}</td>
                                    <td className="pl-10">{review.reviewText}</td>
                                    <td className="pl-10 flex space-x-2">
                                        <Link to="#">
                                            <Button
                                                text="View"
                                                color="mygreen"
                                                hover="myyellow"
                                                onClick={() => handleViewClick(review)}
                                            />
                                        </Link>
                                        <Button
                                            text="Delete"
                                            color="myred"
                                            hover="myyellow"
                                            onClick={() => onDeleteReview(review.id)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="flex justify-center mt-6">
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i + 1}
                                className={`mx-2 px-3 py-1 rounded-md text-sm focus:outline-none ${
                                    currentPage === i + 1
                                        ? "bg-blue-500 text-white hover:bg-blue-600"
                                        : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-100"
                                }`}
                                onClick={() => handlePageChange(i + 1)}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            {showPopthis && selectedReview && (
                <Popthis review={selectedReview} onClose={handleClosePopthis} />
            )}
        </>
    );
};

export default TableReview;