/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Axios for API calls
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { MdDelete } from "react-icons/md";

// components
import Head from "../../components/common/Head";
import Button from "../../components/common/Button";
import QuantityButton from "./QuantityButton";
import { toast } from "react-toastify";
 
const Cart = () => {
  const {userInfo} = useSelector(state => state.auth);
  const userId = userInfo.userId;
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const navigate = useNavigate();
  const data = useSelector((state) => state.cart);
  console.log("Redux cart items : ", data);
  

  const staticCoupon = {
    name: "DISCOUNT10",
    discount: 10,
  };

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const response = await axios.get(`http://localhost:8090/cart/user/${userId}`);
        const data = response.data;
        console.log("cart Data : ", data);
        const allCartItems = data.flatMap((item) => item.cartItems);
        
        setCartItems(allCartItems);
        console.log("CartItems : ", allCartItems);
        
      } catch (error) {
        console.error("Error fetching cart data:", error);
      } finally {
        setLoading(false);
      }
    };

    // if (userId) {
      fetchCartData();
    // }
  }, []);

  

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleRemoveItem = async (itemId) => {
    try {
      const updatedItems = cartItems.filter((item) => item.id !== itemId);
      console.log(updatedItems);
      
      await axios.delete(`http://localhost:8090/cart/delete/${itemId}`, { cartItems: updatedItems });
      toast.success("Item removed successfully");
      setCartItems(updatedItems);

    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };



  const handleQuantityChange = async (itemId, newQuantity, productId) => {
    try {
      // Fetch product data to get available quantity only for increment cases
      const productResponse = await axios.get(`http://localhost:8082/products/${productId}`);
      const availableQuantity = productResponse.data.quantity;
      
      // Find current item quantity
      const currentItem = cartItems.find((item) => item.id === itemId);
      if (!currentItem) return;
  
      if (newQuantity > currentItem.quantity) {
        // Increment case
        if (newQuantity <= availableQuantity) {
          await axios.put(`http://localhost:8090/cart/${itemId}/item/${itemId}/increase`, { quantity: newQuantity });
          const updatedItems = cartItems.map((item) =>
            item.id === itemId ? { ...item, quantity: newQuantity } : item
          );
          setCartItems(updatedItems);
        } else {
          toast.error("Quantity exceeds available stock");
          return;
        }
      } else if (newQuantity < currentItem.quantity) {
        // Decrement case
        await axios.put(`http://localhost:8090/cart/${itemId}/item/${itemId}/decrease`, { quantity: newQuantity });
        const updatedItems = cartItems.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        );
        setCartItems(updatedItems);
      }
    } catch (error) {
      console.error("Error updating quantity in cart:", error);
    }
  };
  
  

  const handleApplyCoupon = () => {
    if (coupon.toUpperCase() === staticCoupon.name) {
      setDiscount(staticCoupon.discount);
      toast.success("Coupon applied successfully!");
    } else {
      setDiscount(0);
      toast.error("Invalid coupon code");
    }
  };

  const calculateTotal = () => {
    const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    return total - (total * discount) / 100;
  };

  // Function to prepare checkout data
  const prepareCheckoutData = () => {
    const products = cartItems.map((item) => ({
      id: item.id,
      productId: item.productId,
      name: item.productName,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
    }));
    console.log("cart product data XXX ::", products);
    

    const totalAmount = calculateTotal();
    const userID = userId;

    return { products, totalAmount, userID };
  };

   // Handle checkout button click
   const handleCheckout = () => {
    const checkoutData = prepareCheckoutData();
    console.log("Checkout data:", checkoutData);
    // Navigate to checkout page with checkout data, if passing via state
    navigate("/home/shop/checkout", { state: checkoutData });
  };

  return (
    <>
      <div className="mx-auto max-w-screen-xl px-4 pt-8 sm:py-12 flex justify-between items-center">
        <Head h1="Your" h2="Cart" />
      </div>

      {/* Cart Details */}
      <div className="justify-center flex-1 px-4 sm:py-6 mx-auto max-w-screen-xl lg:py-4 md:px-6">
        <div className="p-8 bg-gray-50">
          <div className="flex flex-wrap -mx-4">
            <div className="w-full px-4 mb-8 xl:mb-0">
              {cartItems.length === 0 ? (
                ""
              ) : (
                <div className="flex flex-wrap items-center mb-6 -mx-4 md:mb-8">
                  <div className="w-full md:block hidden px-4 mb-6 md:w-4/6 lg:w-6/12 md:mb-0">
                    <h2 className="font-bold text-gray-500">Product name</h2>
                  </div>
                  <div className="hidden px-4 lg:block lg:w-2/12">
                    <h2 className="font-bold text-gray-500">Price</h2>
                  </div>
                  <div className="hidden md:block px-4 md:w-1/6 lg:w-2/12">
                    <h2 className="font-bold text-gray-500">Quantity</h2>
                  </div>
                  <div className="hidden md:block px-4 text-right md:w-1/6 lg:w-2/12">
                    <h2 className="font-bold text-gray-500 mr-36">Subtotal</h2>
                  </div>
                </div>
              )}

              <div className="py-4 mb-8 border-t border-b border-gray-200">
                {loading ? (
                  Array(3)
                    .fill(0)
                    .map((_, index) => (
                      <div
                        key={index}
                        className="flex flex-wrap items-center mb-6 -mx-4 md:mb-8"
                      >
                        <div className="w-full px-4 mb-6 md:w-4/6 lg:w-6/12 md:mb-0">
                          <div className="flex flex-wrap items-center -mx-4">
                            <div className="w-full px-4 mb-3 md:w-1/3">
                              <Skeleton height={96} />
                            </div>
                            <div className="w-2/3 px-4">
                              <Skeleton height={24} width={`80%`} />
                              <Skeleton height={20} width={`60%`} />
                            </div>
                          </div>
                        </div>
                        <div className="hidden px-4 lg:block lg:w-2/12">
                          <Skeleton height={24} width={`50%`} />
                        </div>
                        <div className="w-auto px-4 md:w-1/6 lg:w-2/12">
                          <Skeleton height={32} width={64} />
                        </div>
                        <div className="w-auto px-4 text-right md:w-1/6 lg:w-2/12">
                          <Skeleton height={24} width={`50%`} />
                        </div>
                      </div>
                    ))
                ) : cartItems.length === 0 ? (
                  <div className="text-center py-8 items-center flex flex-col justify-center w-full">
                    <img
                      src="https://i.pinimg.com/564x/92/8b/b3/928bb331a32654ba76a4fc84386f3851.jpg"
                      height={300}
                      width={300}
                      alt=""
                    />
                    <h2 className="text-2xl font-bold text-gray-500">
                      Your cart is empty
                    </h2>
                    <p className="mt-2 text-gray-500">
                      Start adding items to your cart from the shop.
                    </p>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-wrap items-center mb-6 -mx-4 md:mb-8"
                    >
                      <div className="w-full px-4 mb-6 md:w-4/6 lg:w-6/12 md:mb-0">
                        <div className="flex flex-wrap items-center -mx-4">
                          <div className="w-full px-4 mb-3 md:w-1/3">
                            <div className="w-full h-96 md:h-24 md:w-24">
                              <img
                                src={item.image}
                                alt=""
                                className="object-cover w-full h-full"
                              />
                            </div>
                          </div>
                          <div className="w-2/3 px-4">
                            <h2 className="mb-2 text-xl font-bold">
                              {item.productName} <span className="text-gray-500">({item.size})</span>
                            </h2>
                            <p className="text-gray-500">{item.color}</p>
                          </div>
                        </div>
                      </div>
                      <div className="hidden px-4 lg:block lg:w-2/12">
                        <p className="text-lg font-bold text-blue-500">
                          ₹{item.price}
                        </p>
                      </div>
                      <div className="w-auto px-4 md:w-1/6 lg:w-2/12">
                        <QuantityButton
                          initialQuantity={item.quantity}
                          onUpdate={(newQuantity) => handleQuantityChange(item.id, newQuantity, item.productId)}
                          productId={item.productId}
                        />
                      </div>
                      <div className="w-auto px-4 text-right md:w-1/6 lg:w-2/12 flex items-center justify-between">
                        <p className="text-lg font-bold text-blue-500">
                          ₹{item.quantity * item.price}
                        </p>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="p-2 text-red-500 hover:bg-red-100 rounded"
                        >
                          <MdDelete size={24} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {/* Coupon and Total */}
              {cartItems.length === 0 ? (
                ""
              ) : (
                <div className="flex flex-wrap items-center gap-4">
                  <span>Apply Coupon</span>
                  <input
                    type="text"
                    className="flex-1 px-8 py-4 font-normal placeholder-gray-300 border dark:border-gray-700 md:flex-none md:mr-6 text-gray-500 rounded-md"
                    placeholder="Enter coupon code"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                  />
                  <Button text="Apply" color="mygreen" hover="myyellow" onClick={handleApplyCoupon} />
                  <Button
                    text="Checkout"
                    color="myyellow"
                    hover="mygreen"
                    onClick={handleCheckout}
                  />
                  <h2 className="text-xl font-bold">Total: ₹{calculateTotal().toFixed(2)}</h2>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
