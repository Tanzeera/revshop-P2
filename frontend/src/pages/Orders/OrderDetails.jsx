/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Head from "../../components/common/Head";
import Loader from "../../components/Loader/Loader";
import Button from "../../components/common/Button";
import AddReviews from "../Reviews/AddReviews";  // Import the AddReviews component

const OrderDetails = () => {
  const { orderId } = useParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);  // State to track selected product for review

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8084/orders/${orderId}`);
        console.log("Order Details fetched:", response.data);
        setOrderDetails(response.data);
      } catch (err) {
        console.error("Error fetching order details:", err);
      }
    };
    fetchOrderDetails();
  }, [orderId]);

  const handleAddReviewClick = (productId) => {
    // Set the selected product for review
    setSelectedProduct(productId);
  };

  const closeReviewModal = () => {
    // Clear selected product to close the review modal
    setSelectedProduct(null);
  };

  return (
    <div className="mt-20">
        <div className="container mt-8 w-full">
            {orderDetails ? (
                <div className="w-1/2 mb-16">
                <Head h1="Order" h2="Details" />
                <div className="mx-auto max-w-screen-xl px-4 py-8 flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Order ID - {orderDetails.id}</h2>
                </div>
                <div className="w-full h-1 bg-slate-600"></div>

                <section className="bg-white py-8 font-poppins max-w-6xl mx-auto">
                    <div className="px-4 py-4 border-b border-gray-200">
                    <p className="text-lg font-bold">Total Price: {orderDetails.totalAmount}</p>
                    <p className="text-lg font-bold">Billing Address: {orderDetails.billingAddress}</p>
                    <p className="text-lg font-bold">Order Type: {orderDetails.orderType}</p>
                    <p className="text-lg font-bold">Status: {orderDetails.status}</p>
                    </div>
                    <div className="w-full h-1 bg-slate-600 mb-4"></div>
                    <Head h1="Products" />
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mt-5">
                    {orderDetails.orderLineItems.map((product) => (
                        <div key={product.productId} className="border p-4 rounded-lg shadow-sm hover:shadow-md">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="object-cover w-full h-96 rounded-md mb-4"
                        />
                        <h4 className="text-lg font-bold mb-2">{product.name}</h4>
                        <p className="text-gray-700">Quantity: {product.quantity}</p>
                        <p className="text-gray-700">Price: ${product.price}</p>
                        <Button
                            text="Add Review"
                            color="mygreen"
                            hover="myyellow"
                            onClick={() => handleAddReviewClick(product.productId)}
                        />
                        </div>
                    ))}
                    </div>
                </section>

                {/* Conditionally render AddReviews component as a modal */}
                {selectedProduct && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-8 shadow-lg max-w-3xl w-full relative">
                        <button
                        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                        onClick={closeReviewModal}
                        >
                        ✕
                        </button>
                        <AddReviews
                        productID={selectedProduct}
                        userID={orderDetails.userId}
                        operation={closeReviewModal}
                        />
                    </div>
                    </div>
                )}
                </div>
            ) : (
                <Loader />
            )}
            </div>
    </div>
  );
};

export default OrderDetails;
