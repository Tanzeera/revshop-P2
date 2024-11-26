/* eslint-disable no-unused-vars */
import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setCredentials } from "../slices/authSlice";
import { Slide, toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isForgotPassword, setForgotPassword] = useState(false);
    const [isPasswordVisible, setPasswordVisible] = useState(false);
    const togglePasswordVisibility = () => {
        setPasswordVisible(!isPasswordVisible);
    };
    const [email, setEmail] = useState("");
    const [userData, setUserData] = useState({
        username: "",
        pass: "",
    });
    const [errors, setErrors] = useState({});

    const formRef = useRef(null);

    const handleForgotPasswordRequest = () => setForgotPassword(!isForgotPassword);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: [] }));
    };

    const toastNotification = (message, type) => {
        toast(message, {
            type: type,
            position: "top-right",
            autoClose: 5000,
            closeOnClick: true,
            pauseOnHover: false,
            transition: Slide,
        });
    };

    const handleLogin = async () => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_GATEWAY_URL}/auth/login`, {
                username: userData.username,
                password: userData.pass,
            });
            const user = response.data;
            console.log("login user details : ", user);
            

            dispatch(setCredentials(user)); // Store user data in Redux
            toastNotification("Login successful!", "success");
            // toast.success("Login successful!");
            // navigate("/")
            if(user.role === "BUYER"){
                navigate("/"); // Redirect to the homepage or desired page
            }
            else{
                navigate("/admin");
            }

        } catch (error) {
            toastNotification("Login failed. Please check your credentials.", "error");
            console.error("Login error:", error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isForgotPassword) {
            // handleResetPassword(); // Uncomment this if you have implemented forgot password functionality
        } else {
            handleLogin();
        }
    };

    return (
        <>
            <div className="text-mynavy flex md:flex-row-reverse flex-col my-12">
                <div className="flex items-center justify-center flex-1 bg-white text-black">
                    <div className="text-center flex justify-center">
                        <img
                            src="https://pop-shop-github.vercel.app/images/winter1.jpg"
                            className="rounded-[4rem] md:block md:h-[38rem] hidden transition-transform duration-300 ease-in-out hover:scale-105"
                            alt="image"
                        />
                        <img
                            src="/logo.png"
                            className="md:hidden block w-1/2 transition-transform duration-300 ease-in-out hover:scale-105"
                            alt="image"
                        />
                    </div>
                </div>

                <div className="w-full lg:w-1/2 flex items-center justify-center px-6">
                    <div className="max-w-md w-full">
                        <h1 className="text-3xl font-bold mb-1 text-black text-center tracking-wider">
                            {isForgotPassword ? "Reset Password" : "Login"}
                        </h1>
                        <div className="text-md text-[#636364] mb-4 text-center tracking-wider">
                            <p>Please enter your details</p>
                        </div>
                        <form
                            ref={formRef}
                            onSubmit={handleSubmit}
                            className="space-y-4 w-full"
                        >
                            {/* Form content here */}
                            <div>
                                <label
                                    htmlFor="username"
                                    className="block text-sm font-bold text-gray-700 ml-1 tracking-wider"
                                >
                                    Username
                                </label>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    placeholder="Enter your username"
                                    className="mt-2 p-2 w-full placeholder:text-sm  border border-[#C4C4C4] rounded-xl shadow focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
                                    value={userData.username}
                                    onChange={handleInputChange}
                                />
                                {/* Error handling here */}
                            </div>
                            <div className="relative">
                                <label
                                    htmlFor="pass"
                                    className="block text-sm font-bold text-gray-700 ml-1 tracking-wider"
                                >
                                    Password
                                </label>
                                <input
                                    required
                                    type={isPasswordVisible ? "text" : "password"}
                                    id="pass"
                                    name="pass"
                                    placeholder="Enter your password"
                                    className="mt-2 p-2 w-full placeholder:text-sm border border-[#C4C4C4] rounded-xl shadow focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
                                    value={userData.pass}
                                    onChange={handleInputChange}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-2/3 transform -translate-y-1/2 text-gray-400"
                                    onClick={togglePasswordVisibility}
                                >
                                    <FontAwesomeIcon
                                        icon={isPasswordVisible ? faEyeSlash : faEye}
                                    />
                                </button>
                            </div>
                            <button
                                type="submit"
                                className="bg-[#06D6A0] w-full font-bold text-[#fff] text-[1rem] shadow-lg rounded-xl py-2.5 px-10 hover:bg-yellow-300 transition-colors duration-300"
                            >
                                Log In
                            </button>
                            <div className="flex justify-center items-center">
                                <span>Don&apos;t have an account? </span>
                                <Link to="/signup" className="text-[#06D6A0] px-2 font-bold"> Signup here</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Login;
