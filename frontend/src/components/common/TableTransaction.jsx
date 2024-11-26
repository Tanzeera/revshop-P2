import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Button from "../common/Button";
import axios from "axios";

const TableTransaction = ({ transactions }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showPopthis, setShowPopthis] = useState(false);
  const [transactionData, setTransactionData] = useState(transactions);

  // Effect to update local state when the 'transactions' prop changes
  useEffect(() => {
    setTransactionData(transactions);
  }, [transactions]); // This will run whenever 'transactions' prop changes

  const totalPages = Math.ceil(transactionData.length / pageSize);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const displayedTransactions = transactionData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleViewClick = (transaction) => {
    setSelectedTransaction(transaction);
    setShowPopthis(true);
  };

  const handleClosePopthis = () => {
    setShowPopthis(false);
    setSelectedTransaction(null);
  };

  const handleUpdate = (transactionId, newStatus) => {
    setTransactionData(
      transactionData.map((transaction) =>
        transaction.id === transactionId ? { ...transaction, status: newStatus } : transaction
      )
    );
  };

  const Popthis = ({ transaction, onClose, onUpdate }) => {
    const [newStatus, setNewStatus] = useState(transaction.status);

    const handleStatusChange = async () => {
      try {
        const response = await axios.put(
          `http://localhost:8085/api/payments/${transaction.id}/status?status=${newStatus}`
        );

        console.log("Transaction updated successfully:", response.data);

        // Optionally refetch the transactions to get the latest data
        const updatedTransactions = await axios.get(
          `http://localhost:8085/api/payments`
        );
        
        // Update the local transaction data state with the new transactions
        setTransactionData(updatedTransactions.data);

        onUpdate(transaction.id, newStatus); // Update the transaction data in the table
        onClose();
      } catch (error) {
        console.error("Error updating transaction status:", error);
        if (error.response) {
          console.error("Server responded with:", error.response.data);
        }
      }
    };

    return (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="absolute inset-0 bg-mywhite bg-opacity-50"></div>
        <div className="relative p-8 rounded-lg shadow-lg w-1/2 bg-mywhite text-black">
          <button
            onClick={onClose}
            className="absolute top-0 right-0 mt-4 mr-4 text-xl"
          >
            &times;
          </button>
          <div className="mb-4 text-lg">
            <strong>Order ID:</strong> {transaction.orderId}
          </div>
          <div className="mb-4 text-lg">
            <strong>Status:</strong>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="ml-2 p-1 border rounded"
            >
              <option value="INITIATED">INITIATED</option>
              <option value="SUCCESS">SUCCESS</option>
              <option value="FAILURE">FAILURE</option>
            </select>
          </div>
          <div className="mb-4 text-lg">
            <strong>Total Amount:</strong> ₹{transaction.totalAmount.toFixed(2)}
          </div>
          <div className="mb-4 text-lg">
            <strong>User ID:</strong> {transaction.userId}
          </div>
          <button
            onClick={handleStatusChange}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Update Status
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="pl-10 w-full max-w-6xl mx-auto mb-32">
        <div className="overflow-x-auto rounded-lg border border-base-300">
          <table className="table w-full max-w-full">
            <thead>
              <tr className="text-neutral">
                <th>ID</th>
                <th className="pl-10">Order ID</th>
                <th className="pl-10">Payment ID</th>
                <th className="pl-10">User ID</th>
                <th className="pl-10">Total Amount</th>
                <th className="pl-10">Status</th>
                <th className="pl-10">Action</th>
              </tr>
            </thead>
            <tbody>
              {displayedTransactions.map((transaction, index) => (
                <tr
                  key={transaction.id}
                  className={index % 2 === 0 ? "bg-base-200" : "bg-base-100"}
                >
                  <td>{transaction.id}</td>
                  <td className="pl-10">{transaction.orderId}</td>
                  <td className="pl-10">{transaction.paymentId}</td>
                  <td className="pl-10">{transaction.userId}</td>
                  <td className="pl-10">₹{transaction.totalAmount.toFixed(2)}</td>
                  <td className="pl-10 capitalize">
                    {transaction.status === "INITIATED" ? (
                      <span className='bg-yellow-500 p-2 font-semibold rounded-md text-white'>{transaction.status}</span>
                    ) : transaction.status === "FAILURE" ? (
                      <span className='bg-red-500 p-2 rounded-md text-white font-semibold'>{transaction.status}</span>
                    ) : (
                      <span className='bg-green-500 p-2 rounded-md text-white font-semibold'>{transaction.status}</span>
                    )}
                  </td>
                  <td >
                    <Link to="#">
                      <Button
                        text="View"
                        color="mygreen"
                        hover="myyellow"
                        onClick={() => handleViewClick(transaction)}
                      />
                    </Link>
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
      {showPopthis && selectedTransaction && (
        <Popthis
          transaction={selectedTransaction}
          onClose={handleClosePopthis}
          onUpdate={handleUpdate}
        />
      )}
    </>
  );
};

export default TableTransaction;