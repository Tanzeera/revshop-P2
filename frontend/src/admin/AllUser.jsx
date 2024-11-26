import { useEffect, useState } from 'react';
import axios from 'axios';
import Head from '../components/common/Head';
import Table from '../components/common/TableUser';
import AddUserPopup from './AddUserPopup'; // Import the AddUserPopup component

const AllUser = () => {
    const [users, setUsers] = useState([]);
    const [showAddPopup, setShowAddPopup] = useState(false);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:8081/auth/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };
    useEffect(() => {
        fetchUsers();
    }, []);

    const deleteUser = async (userId) => {
        try {
            await axios.delete(`http://localhost:8081/auth/users/${userId}`);
            setUsers(users.filter(user => user.id !== userId)); // Update state
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleAddClick = () => {
        setShowAddPopup(true);
    };

    const handleAdd = (updatedUsers) => {
        setUsers(updatedUsers);
    };

    const handleCloseAddPopup = () => {
        setShowAddPopup(false);
    };

    return (
        <div>
            <div className="mx-auto max-w-screen-xl px-4 pt-8 mt-8 sm:py-12">
                <Head h1="All" h2="Users" />
            </div>

           

            {/* Add User Popup */}
            {showAddPopup && (
                <AddUserPopup
                    onClose={handleCloseAddPopup}
                    onAdd={handleAdd}
                    operation={fetchUsers}
                />
            )}

            <div className="pl-10 w-full max-w-6xl mx-auto mb-32">
             {/* Add New User Button */}
            <div className="flex justify-end mb-8">
                <button
                    type="button"
                    onClick={handleAddClick}
                    className="flex items-center bg-green-600 text-white px-6 py-3 rounded-md shadow-md hover:bg-green-700 transition duration-200"
                >
                    <span className="mr-2">+</span>
                    Add User
                </button>
            </div>
                <Table users={users} onDeleteUser={deleteUser} /> {/* Pass deleteUser function */}
            </div>
        </div>
    );
};

export default AllUser;