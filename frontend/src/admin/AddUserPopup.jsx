/* eslint-disable no-unused-vars */
import { useState } from 'react';
import axios from 'axios';

const AddUserPopup = ({ onClose, onAdd, operation }) => {
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newRole, setNewRole] = useState("");
  const [newUsername, setNewUsername] = useState("");

  const handleAdd = async () => {
    if (newFirstName.trim() === "" || newLastName.trim() === "" || newEmail.trim() === "" || newPhone.trim() === "" || newRole.trim() === "" || newUsername.trim() === "") return;
    try {
      const response = await axios.post("http://localhost:8081/auth/register", {
        firstName: newFirstName,
        lastName: newLastName,
        email: newEmail,
        password: password,
        phone: newPhone,
        role: newRole,
        username: newUsername,
      });
      if (response.status === 200) {
        console.log("User added successfully");
        operation();

        onClose();
      }
    } catch (error) {
      console.error("Error adding user:", error);
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
          <label className="block">First Name</label>
          <input
            type="text"
            name="firstName"
            value={newFirstName}
            onChange={(e) => setNewFirstName(e.target.value)}
            className="border p-2 w-full rounded-md"
          />
        </div>
        <div className="mb-4 text-lg">
          <label className="block">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={newLastName}
            onChange={(e) => setNewLastName(e.target.value)}
            className="border p-2 w-full rounded-md"
          />
        </div>
        <div className="mb-4 text-lg">
          <label className="block">Email</label>
          <input
            type="email"
            name="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="border p-2 w-full rounded-md"
          />
        </div>
        <div className="mb-4 text-lg">
          <label className="block">Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 w-full rounded-md"
          />
        </div>
        <div className="mb-4 text-lg">
          <label className="block">Phone</label>
          <input
            type="text"
            name="phone"
            value={newPhone}
            onChange={(e) => setNewPhone(e.target.value)}
            className="border p-2 w-full rounded-md"
          />
        </div>
        <div className="mb-4 text-lg">
          <label className="block">Role</label>
          <input
            type="text"
            name="role"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            className="border p-2 w-full rounded-md"
          />
        </div>
        <div className="mb-4 text-lg">
          <label className="block">Username</label>
          <input
            type="text"
            name="username"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            className="border p-2 w-full rounded-md"
          />
        </div>
        <button
          onClick={handleAdd}
          className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md"
        >
          Add User
        </button>
      </div>
    </div>
  );
};

export default AddUserPopup;