import Table from "../components/common/Table";
import { useEffect, useState } from "react";
import axios from 'axios';


const fetchOrders = async () => {
  try {
    const response = await axios.get(`http://localhost:8084/orders/user-order`);
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
};

const Orders = () => {
  const [orderStore, setOrderStore] = useState([]);

  useEffect(() => {
    const getOrders = async () => {
      const ordersData = await fetchOrders();
      setOrderStore(ordersData);
    };
    getOrders();
  }, []);

  console.log(orderStore);
  return (
    <div>
      <Table orders={orderStore} />
    </div>
  );
};

export default Orders;
