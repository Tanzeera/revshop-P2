/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import axios from "axios";
import Head from "../../components/common/Head";
import Button from "../../components/common/Button";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from 'uuid';
import { toast } from "react-toastify";

function Checkout() {
    const { state } = useLocation();
    const userId = state.userID;
    const directPurchase = state?.directPurchase;
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(state.totalAmount || 0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [orderId, setOrderId] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("online");
    const [billingAddress, setBillingAddress] = useState("");
    const navigate = useNavigate();
    const userName = useSelector((state) => state.auth.userInfo.username);
    // console.log("state", state);
    const token = useSelector((state) => state.auth.userInfo?.jwtToken)
    console.log("jwtToken ::" , token);
    

    useEffect(() => {
        const fetchCartItems = async () => {
            if (userName) {
                try {
                    // Make API request to fetch cart items for the logged-in user
                    const response = await axios.get(`http://localhost:8090/cart/user/${userId}`);
                    const cartData = response.data;

                    // Combine all cart items from the fetched data
                    const allCartItems = cartData.reduce((acc, cart) => {
                        return [...acc, ...cart.cartItems];
                    }, []);
                    
                    // Set the cart items and calculate the total
                    setCartItems(allCartItems);
                    calculateTotal(allCartItems);
                } catch (error) {
                    console.error("Error fetching cart items:", error);
                }
            }
        };

        if (directPurchase) {
            setCartItems([directPurchase]);
            calculateTotal([directPurchase]);
        } else {
            fetchCartItems();
        }
    }, [userName, directPurchase]);

    const calculateTotal = (items) => {
        const totalAmount = items.reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 1), 0);
        setTotal(totalAmount);
    };

    const handleBillingAddressChange = (e) => {
        setBillingAddress(e.target.value);
    };

    const placeOrder = async () => {
        console.log("inside place order and payment m", paymentMethod)
        console.log("username", userName)
        console.log("cartItems", cartItems.length);
        console.log("billingAddress", billingAddress);

        if (!userName || cartItems.length === 0 || !billingAddress) {
            console.error("Order cannot be placed. Missing required fields.");
            return;
        }

        const orderData = {
            totalAmount: total,
            userId: userId,
            status: 'PENDING',
            billingAddress,
            OrderType: "Cash On Delivery",
            orderLineItems: cartItems.map(item => ({
                productId: item.productId,
                name: item.productName,
                price: item.price,
                quantity: item.quantity || 1,
                image: item.image,
            })),
        };

        try {
            if (paymentMethod === "cod") {
                // const response = await axios.post("http://localhost:8084/orders", orderData);
                const response = await axios.post("http://localhost:8084/orders", orderData, {
                    headers: {
                      Authorization: `Bearer ${token}`, // Add the token in the Authorization header
                    },
                  });
                console.log("Order placed successfully:", response.data);
                setIsModalOpen(true);
                setCartItems([]);
                setOrderId(response.data.id || uuidv4());
                deleteCart();
            } else {
                // Implement online payment functionality here
                console.log("Online payment selected.");
                handleRazorpayPayment();
                // setIsModalOpen(true);
                // setCartItems([]);
                // setOrderId(uuidv4());
            }
        } catch (error) {
            console.error("Error placing order:", error);
        }
    };

    // Call the payment API to initiate online payment
    const handlePaymentApi = async (orderData, paymentID, orderID) => {
        const paymentData = {
            orderId: orderID,
            paymentId: paymentID,
            paymentLink: "http://localhost:8085/api/payments",
            status: "SUCCESS",
            totalAmount: orderData.totalAmount,
            userId : orderData.userId
        }
        try {
            const response = await axios.post("http://localhost:8085/api/payments", paymentData);
            console.log("Payment API call successful:", response.data);
        } catch (error) {
            console.error("Error calling payment API:", error);
        }
    }

    const handleRazorpayPayment = () => {
        if (typeof window.Razorpay === "undefined") {
            console.error("Razorpay SDK not loaded.");
            return;
        }
    
        const options = {
            key: "rzp_test_kOZuSgBkSmpz5o",  // Replace with your Razorpay Key ID
            amount: total * 100,  // Razorpay takes amount in paise
            currency: "INR",
            name: "E-Commerce Website",
            description: "Order Payment",
            handler: async (response) => {
                const orderData = {
                    totalAmount: total,
                    userId: userId,
                    status: 'SHIPPED',
                    billingAddress,
                    OrderType: "Online Payment",
                    // paymentId: response.razorpay_payment_id,
                    orderLineItems: cartItems.map(item => ({
                        productId: item.id,
                        name: item.productName,
                        price: item.price,
                        quantity: item.quantity || 1,
                        image: item.image,
                    })),
                };
    
                try {
                    const res = await axios.post("http://localhost:8084/orders", orderData);
                    console.log("Order placed successfully: XXX", res.data);
                    await handlePaymentApi(orderData, response.razorpay_payment_id, res.data.id);
                    deleteCart();
                    setIsModalOpen(true);
                    setOrderId(res.data.id || uuidv4());
                    setCartItems([]);
                } catch (error) {
                    console.error("Error placing order:", error);
                }
            },
            prefill: {
                name: userName,
                email: "sushantkapri@gmail.com",  // Replace with actual user email
                contact: "7547802323"  // Replace with actual user contact number
            },
            theme: {
                color: "#3399cc"
            }
        };
    
        const rzp1 = new window.Razorpay(options);
        rzp1.open();
    };

    const deleteCart = async() => {
        try{
            const res = await axios.delete(`http://localhost:8090/cart/deleteAll/${userId}`);
        }catch(e){
            toast.error("Error while deleting all cart item.")
            console.error("Error while deleting all cart items:", e);
        }
    }
    

    return (
        <>
            <div className="mx-auto max-w-screen-xl px-4 pt-8 sm:py-12 flex justify-between items-center mt-6">
                <Head h1="Check" h2="out" />
            </div>
            <div className="mx-auto max-w-screen-xl px-4 flex pb-8 flex-col-reverse md:flex-row lg:flex-row">
                <div className="w-full md:w-7/12 lg:w-3/4 pe-0 md:pe-12 lg:pe-12">
                    
                    {/* Billing Address Section */}
                    <h2 className="border-b-2 border-[#c4c4c4] pb-3 pt-4 bg-grey-900 mb-2 text-xl font-bold">Billing Address</h2>
                    <form className="flex flex-col gap-5">
                        <textarea
                            className="textarea textarea-bordered w-full"
                            placeholder="Enter your billing address"
                            onChange={handleBillingAddressChange}
                            value={billingAddress}
                        ></textarea>
                    </form>

                    {/* Payment Option Section with Enhanced UI */}
                    <h2 className="border-b-2 border-[#c4c4c4] pb-3 pt-4 bg-grey-900 mb-2 text-xl font-bold">Payment Option</h2>
                    <div className="flex gap-4 mt-4">
                        <label className="flex items-center gap-2 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="online"
                                checked={paymentMethod === "online"}
                                onChange={() => setPaymentMethod("online")}
                                className="radio radio-primary"
                            />
                            <span className="font-bold">Online Payment</span>
                        </label>
                        <label className="flex items-center gap-2 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="cod"
                                checked={paymentMethod === "cod"}
                                onChange={() => setPaymentMethod("cod")}
                                className="radio radio-primary"
                            />
                            <span className="font-bold">Cash on Delivery</span>
                        </label>
                    </div>

                    <div className="flex justify-end gap-4 mt-8">
                        <Button text="Back" color="myred" onClick={() => navigate('/home/shop/cart')} />
                        <Button text="Place Order" color="myyellow" onClick={placeOrder} />
                    </div>
                </div>

                {/* Order Summary Section */}
                <div className="w-full md:border-s-2 lg:border-s-2 border-[#c4c4c4] md:w-4/12 lg:w-1/4 ps-0 md:ps-8 lg:ps-8">
                    <h2 className="pb-3 pt-4 text-xl font-bold">ORDER SUMMARY</h2>
                    <div>
                        {cartItems.map((item) => (
                            <div key={item.productId}>
                                <div className="flex justify-between">
                                    <p className="font-medium">{item.productName}</p>
                                    <p className="font-medium">${item.price}</p>
                                </div>
                                <div className="flex justify-between">
                                    <span>Qty</span>
                                    <span>{item.quantity || 1}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Sub-total</span>
                                    <span>${(item.price || 0) * (item.quantity || 1)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="border-t border-[#c4c4c4] py-4">
                        <div className="flex justify-between py-3">
                            <span className="text-xl font-medium">Total</span>
                            <span className="text-xl font-bold">${total}</span>
                        </div>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out"
                    onClick={() => setIsModalOpen(false)}
                >
                    <div
                        className="modal-box relative p-8 bg-white rounded-lg shadow-lg transform transition-transform duration-300 ease-in-out scale-105 hover:scale-100"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="font-bold text-2xl text-mygreen mb-4 animate-bounce">
                            🎉 Congratulations!
                        </h3>
                        <p className="text-gray-700 mb-2">Your order has been placed successfully.</p>
                        <p className="font-semibold text-gray-600 mb-4">Order ID: {orderId}</p>
                        <div className="modal-action mt-6 flex justify-end">
                            <Link to={'/home/shop'}>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="btn bg-mygreen hover:bg-green-700 text-white px-6 py-2 rounded-full shadow-lg transition-all duration-200 transform hover:-translate-y-1 hover:scale-105"
                                >
                                    Continue Shopping
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Checkout;
