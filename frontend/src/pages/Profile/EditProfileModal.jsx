/* eslint-disable react/prop-types */
import axios from "axios";
import { useState } from "react";
import { z } from "zod";

const phoneSchema = z.string().refine((value) => {
    return /^[0-9]{10}$/.test(value);
}, { message: 'Phone number must be exactly 10 digits and contain only numbers' });

function EditProfileModal({ userData, onUpdate }) {
    const [phoneError, setPhoneError] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const [formData, setFormData] = useState({
        id: userData.id,
        username: userData.username,
        email: userData.email,
        role: userData.role,
        firstName: userData.firstName,
        phone: userData.phone,
        password: userData.password,
        lastName: userData.lastName
    });

    // Inside your EditProfileModal component
    
    const handleUpdate = async () => {
        setIsSaving(true);
    
        // Validate phone number
        const validationResult = phoneSchema.safeParse(formData.phone);
        if (!validationResult.success) {
            setPhoneError("Invalid phone number");
            setIsSaving(false);
            return;
        }
    
        try {
            const response = await axios.put(`http://localhost:8081/auth/users/${formData.id}`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
    
            if (response.status !== 200) {
                throw new Error(`Failed to update user: ${response.statusText}`);
            }
    
            setIsModalOpen(false);
            onUpdate(); // Call onUpdate to refresh data
        } catch (error) {
            console.error("Error updating user:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleModalToggle = () => {
        setIsModalOpen(!isModalOpen);
    };

    const handleChange = (e) => {
        setPhoneError(null);
        const { name, value } = e.target;

        // Update formData based on input changes
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value // Update the specific field with the new value
        }));
    };

    return (
        <>
            <input type="checkbox" id="my_modal_1" className="modal-toggle w-5xl" checked={isModalOpen} onChange={handleModalToggle} />
            <div className={`modal ${isModalOpen ? 'open' : ''}`} role="dialog">
                <div className="modal-box md:w-full px-4 card">
                    <h3 className="font-bold text-center text-lg"> Edit Your Profile </h3>
                    <div className="flex font-semiold justify-around mt-5 flex-col sm:flex-row">
                        <div className="flex flex-col">
                            <div className="w-full sm:p-4 p-1">
                                <label htmlFor="firstName" className="block text-sm font-bold text-gray-700 ml-1 tracking-wider"> First Name </label>
                                <input type="text" id="firstName" name="firstName" placeholder="First Name" className="mt-2 p-2 w-full placeholder:text-sm border border-[#C4C4C4] rounded-xl shadow focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300" value={formData.firstName} onChange={handleChange} />
                            </div>
                            <div className="w-full sm:p-4 p-1">
                                <label htmlFor="lastName" className="block text-sm font-bold text-gray-700 ml-1 tracking-wider"> Last Name </label>
                                <input type="text" id="lastName" name="lastName" placeholder="Last Name" className="mt-2 p-2 w-full placeholder:text-sm border border-[#C4C4C4] rounded-xl shadow focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300" value={formData.lastName} onChange={handleChange} />
                            </div>
                            <div className="w-full sm:p-4 p-1">
                                <label htmlFor="phone" className="block text-sm font-bold text-gray-700 ml-1 tracking-wider"> Phone </label>
                                <input type="text" id="phone" name="phone" placeholder="Phone Number" className={`mt-2 p-2 w-full placeholder:text-sm border ${phoneError ? 'border-red-500' : 'border-[#C4C4C4]'}`} value={formData.phone} onChange={handleChange} />
                                {phoneError && (
                                    <p className="text-red-500 text-sm mt-1">{phoneError}</p>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <div className="w-full sm:p-4 p-1">
                                <label htmlFor="email" className="block text-sm font-bold text-gray-700 ml-1 tracking-wider"> Email </label>
                                <p className="ml-1">{userData.email}</p>
                            </div>
                        </div>
                    </div>
                    <div className="modal-action pe-5">
                        <button className={`btn hover:bg-mygreen bg-myyellow ${isSaving && 'opacity-50 cursor-not-allowed'}`} onClick={handleUpdate} disabled={isSaving}>
                            {isSaving ? 'Saving...' : 'Save'}
                        </button>
                        <button className="btn hover:bg-myred bg-myred" onClick={handleCancel}> Cancel </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default EditProfileModal;