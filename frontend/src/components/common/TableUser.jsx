/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Link } from "react-router-dom";
import Head from "../common/Head";
import Button from "../common/Button";

const TableUser = ({ users, onDeleteUser }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showPopthis, setShowPopthis] = useState(false);

    const totalPages = Math.ceil(users.length / pageSize);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const displayedUsers = users.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const handleViewClick = (user) => {
        setSelectedUser(user);
        setShowPopthis(true);
    };

    const handleClosePopthis = () => {
        setShowPopthis(false);
        setSelectedUser(null);
    };

    const Popthis = ({ user, onClose }) => {
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
                        <h2 className="font-bold mb-4 text-2xl flex items-center justify-center text-myred">User Details</h2>
                        <div className="mb-4 text-lg">
                            <strong>First Name:</strong> {user.firstName}
                        </div>
                        <div className="mb-4 text-lg">
                            <strong>Last Name:</strong> {user.lastName}
                        </div>
                        <div className="mb-4 text-lg">
                            <strong>Email:</strong> {user.email}
                        </div>
                        <div className="mb-4 text-lg">
                            <strong>Phone:</strong> {user.phone}
                        </div>
                        <div className="mb-4 text-lg">
                            <strong>Role:</strong> {user.role}
                        </div>
                        <div className="mb-4 text-lg">
                            <strong>Username:</strong> {user.username}
                        </div>
                    </div>
                </div>
            </>
        );
    };

    return (
        <>
            {/* <div className="mx-auto max-w-screen-xl px-4 pt-8 mt-8 sm:py-12">
                <Head h2="Users" />
            </div> */}
            <div className="pl-10 w-full max-w-6xl mx-auto mb-32">
                <div className="overflow-x-auto rounded-lg border border-base-300">
                    <table className="table w-full max-w-full">
                        <thead>
                            <tr className="text-neutral">
                                <th>ID</th>
                                <th className="pl-10">First Name</th>
                                <th className="pl-10">Last Name</th>
                                <th className="pl-10">Phone</th>
                                <th className="pl-10">Role</th>
                                <th className="pl-10">Username</th>
                                <th className="pl-10">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayedUsers.map((user, index) => (
                                <tr
                                    key={user.id}
                                    className={index % 2 === 0 ? "bg-base-200" : "bg-base-100"}
                                >
                                    <td>{user.id}</td>
                                    <td className="pl-10">{user.firstName}</td>
                                    <td className="pl-10">{user.lastName}</td>
                                    <td className="pl-10">{user.phone}</td>
                                    <td className="pl-10">{user.role}</td>
                                    <td className="pl-10">{user.username}</td>
                                    <td className="pl-10 flex space-x-2">
                                        <Link to="#">
                                            <Button
                                                text="View"
                                                color="mygreen"
                                                hover="myyellow"
                                                onClick={() => handleViewClick(user)}
                                            />
                                        </Link>
                                        <Button
                                            text="Delete"
                                            color="myred"
                                            hover="myyellow"
                                            onClick={() => onDeleteUser(user.id)}
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
            {showPopthis && selectedUser && (
                <Popthis user={selectedUser} onClose={handleClosePopthis} />
            )}
        </>
    );
};

export default TableUser;
