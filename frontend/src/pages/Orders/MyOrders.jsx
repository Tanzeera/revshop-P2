/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Popup from "./Popup";
import ReturnExchangePopup from "./ReturnExchangePopup";
import { Link, useNavigate } from "react-router-dom";
import Head from "../../components/common/Head";
import { Button as BootstrapButton } from "react-bootstrap";
import axios from "axios";
import { useSelector } from "react-redux";
import Loader from "../../components/Loader/Loader";
import Button from "../../components/common/Button";
import TrackingPopup from "./TrackingPopup";
import { toast } from "keep-react";

const MyOrders = () => {
  const [trackingOrder, setTrackingOrder] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [returnExchangeOrder, setReturnExchangeOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const userName = useSelector((state) => state.auth.userInfo.username);
  const { userInfo } = useSelector((state) => state.auth);
  const userId = userInfo.userId;
  const navigate = useNavigate();

  const handleTrackOrderClick = (order) => setTrackingOrder(order);
  const handleCloseTrackingPopup = () => setTrackingOrder(null);
  const handleViewClick = (index) => setOpenDropdown(index === openDropdown ? null : index);
  const handleInvoiceClick = (order) => setSelectedOrder(order);
  const handleReturnClick = (order) => setReturnExchangeOrder(order);
  const handleClosePopup = () => setSelectedOrder(null);
  const handleCloseReturnExchangePopup = () => setReturnExchangeOrder(null);

  const handleCancelClick = async (order) => {
    try {
      await axios.put(`http://localhost:8084/orders/${order.orderId}`, {
        id: order.orderId,
        status: "CANCELED",
      });
      // Refresh the orders list or update the UI
      setOrders((prevOrders) =>
        prevOrders.map((o) => (o.orderId === order.orderId ? { ...o, status: "CANCELED" } : o))
      );
      toast.success("Order canceled successfully")
    } catch (err) {
      console.error("Error canceling the order: ", err);
    }
  };

  const handleReturnExchangeSubmit = async (type, details) => {
    try {
      await axios.put(`http://localhost:8084/orders/${returnExchangeOrder.orderId}`, {
        id: returnExchangeOrder.orderId,
        status: type === "RETURN" ? "RETURNED" : "EXCHANGED",
        details,
      });
      setOrders((prevOrders) =>
        prevOrders.map((o) =>
          o.orderId === returnExchangeOrder.orderId ? { ...o, status: type } : o
        )
      );
      alert(`${type} action submitted successfully.`);
    } catch (err) {
      console.error(`${type} action failed:`, err);
    }
  };

  useEffect(() => {
    const fetchOrdersData = async () => {
      try {
        const response = await axios.get(`http://localhost:8084/orders/user-order/${userId}`);
        const fetchedOrders = response.data.map((order) => ({
          orderId: order.id.toString(),
          product: order.orderLineItems.map((item) => ({
            productId: item.productId,
            name: item.name,
            image: item.image,
            price: item.price,
            quantity: item.quantity,
          })),
          price: order.totalAmount,
          date: new Date().toLocaleDateString(),
          status: order.status,
        }));
        setOrders(fetchedOrders);
      } catch (err) {
        console.error("Error fetching orders: ", err);
      }
    };
    if (userName) fetchOrdersData();
  }, [userName]);

  const truncateText = (text, maxLength) => (text.length > maxLength ? `${text.slice(0, maxLength)}...` : text);

  const handleBuyAgainClick = () => {

  }

  const handleDetailsOrderClick = (orderId) => {
    navigate(`/orders/${orderId}`)
  }

  return (
    <>
      {orders.length > 0 ? (
        <>
          <div className="mx-auto max-w-screen-xl px-4 pt-8 mt-8 sm:py-12">
            <Head h1="My" h2="Orders" />
          </div>

          <div className="w-2/3 mx-auto mb-32 mt-12">
            <div className="overflow-x-auto rounded-lg border border-base-300">
              <table className="table w-full">
                <thead>
                  <tr className="text-neutral">
                    <th>Order No.</th>
                    {/* <th>ProductID</th> */}
                    <th>Products</th>
                    <th>Price</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th className="pl-12">Action</th>
                    <th>Track Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-base-200" : "bg-base-100"}>
                      <td>{truncateText(order.orderId, 10)}</td>
                      <td>
                        {order.product.map((product, productIndex) => (
                          <div className="font-medium" key={productIndex}>
                            {product.productId}
                            <br/>
                            {product.name}
                            <br />
                            Quantity: {product.quantity}
                          </div>
                        ))}
                      </td>
                      <td>${order.price}</td>
                      <td>{order.date}</td>
                      <td>
                        <span
                          className={`badge ${
                            order.status === "PENDING"
                              ? "badge-warning badge-outline"
                              : order.status === "SHIPPED"
                              ? "badge-info badge-outline"
                              : order.status === "OUT_FOR_DELIVERY"
                              ? "badge-accent badge-outline"
                              : order.status === "DELIVERED"
                              ? "badge-success badge-outline"
                              : order.status === "CANCELED"
                              ? "badge-error badge-outline"
                              : order.status === "RETURNED"
                              ? "badge-neutral badge-outline"
                              : order.status === "REFUNDED"
                              ? "badge-purple badge-outline"
                              : "badge-default badge-outline"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>

                      <td>
                        <div className="relative flex gap-5">
                          <BootstrapButton
                            className="btn btn-secondary dropdown-toggle bg-mygreen hover-myyellow"
                            type="button"
                            id="dropdownMenuButton"
                            aria-expanded="false"
                            style={{ borderColor: "#ffffff" }}
                            onClick={() => handleViewClick(index)}
                          >
                            View
                          </BootstrapButton>
                          {openDropdown === index && (
                            <ul
                              className="dropdown-menu absolute right-0 mt-2 py-1 w-48 bg-white border rounded shadow-md z-10"
                              aria-labelledby="dropdownMenuButton"
                            >
                              <li>
                                <button
                                  className="dropdown-item w-full text-left px-4 py-2"
                                  onClick={() => handleInvoiceClick(order)}
                                >
                                  Invoice
                                </button>
                              </li>
                              <li>
                                <button
                                  className="dropdown-item w-full text-left px-4 py-2"
                                  onClick={() => handleReturnClick(order)}
                                >
                                  Return/Exchange
                                </button>
                              </li>
                              <li>
                                <button
                                  className="dropdown-item w-full text-left px-4 py-2"
                                  onClick={() => handleBuyAgainClick(order)}
                                >
                                  Buy Again
                                </button>
                              </li>
                              <li>
                                <button
                                  className="dropdown-item w-full text-left px-4 py-2"
                                  onClick={() => handleCancelClick(order)}
                                >
                                  Cancel Order
                                </button>
                              </li>
                            </ul>
                          )}
                          <Button
                            text="Details"
                            color="myred"
                            hover="myyellow"
                            onClick={() => handleDetailsOrderClick(order.orderId)}
                          />
                        </div>
                      </td>
                      <td>
                        <Button
                          text="Track Order"
                          color="myyellow"
                          hover="mygreen"
                          onClick={() => handleTrackOrderClick(order)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {selectedOrder && <Popup order={selectedOrder} onClose={handleClosePopup} />}
          {returnExchangeOrder && (
            <ReturnExchangePopup
              order={returnExchangeOrder}
              onClose={handleCloseReturnExchangePopup}
              onSubmit={handleReturnExchangeSubmit}
            />
          )}
          {trackingOrder && <TrackingPopup order={trackingOrder} onClose={handleCloseTrackingPopup} />}
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default MyOrders;
