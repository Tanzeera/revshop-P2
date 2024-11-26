import { useEffect, useState } from 'react';
import axios from 'axios';
import Head from '../components/common/Head';
import TableTransaction from '../components/common/TableTransaction'; // Import the TableTransaction component

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get('http://localhost:8085/api/payments');
      const data = response.data;

      if (!data) {
        console.error('Error fetching transactions');
        setError('Failed to fetch transactions.');
      } else {
        console.log('Fetched transactions:', data);
        setTransactions(data);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setError('Failed to fetch transactions.');
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const updateStatus = async (paymentId, newStatus) => {
    try {
      console.log(`Updating status for paymentId: ${paymentId} to ${newStatus}`);
      await axios.put(`http://localhost:8085/api/payments/${paymentId}/status?status=${newStatus}`);
      console.log(`Status updated successfully for paymentId: ${paymentId}`);
      fetchTransactions(); // Fetch the updated transactions
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    
    <div className="mx-auto max-w-screen-xl px-4 pt-8 mt-8 sm:py-12">
      <Head h1="Online" h2="Transactions" />
      {error && <p className="text-red-500 text-center mb-4 mt-6">{error}</p>}
      <div className='mt-10'>
        <TableTransaction transactions={transactions} onUpdateStatus={updateStatus} />
      </div>
    </div>
  );
}

export default Transactions;