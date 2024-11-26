/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Slide, toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

function Signup() {
    const navigate = useNavigate();
    const [isLogin, setLogin] = useState(true);
    const [isForgotPassword, setForgotPassword] = useState(false);
    const [isPasswordVisible, setPasswordVisible] = useState(false);
  
    const togglePasswordVisibility = () => {
      setPasswordVisible(!isPasswordVisible);
    };
  
    // const [email, setEmail] = useState("");
    const [userData, setUserData] = useState({
      username: "admin",
      email: "",
      pass: "Admin@123",
      firstname: "",
      lastname: "",
      phone: "",
      role: "",
    });
  
    const [errors, setErrors] = useState({});
    const formRef = useRef(null);
  
    const handleAuthRequest = () => setLogin(!isLogin);
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
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.post("http://localhost:8081/auth/register", {
          username: userData.username,
          email: userData.email,
          role: userData.role ? "SELLER" : "BUYER",
          firstName: userData.firstname,
          lastName: userData.lastname,
          phone: userData.phone,
          password: userData.pass,
        });
        toastNotification("Registration successful!", "success");
        navigate("/login");
      } catch (error) {
        toastNotification("Registration failed! Check your details.", "error");
        if (error.response && error.response.data && error.response.data.errors) {
          setErrors(error.response.data.errors);
        }
      }
    };

  return (
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
      <div className="w-full bg-[#ffff] lg:w-1/2 flex items-center justify-center px-6">
        <div className="max-w-md w-full">
          <h1 className="text-3xl font-bold mb-1 text-black text-center tracking-wider">
            Sign Up
          </h1>
          <div className="text-md text-[#636364] mb-4 text-center tracking-wider">
            <p>Please enter your details</p>
          </div>
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-1 w-full">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-bold text-gray-700 ml-1 tracking-wider"
              >
                Email
              </label>
              <input
                required
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                className="mt-2 p-2 w-full placeholder:text-sm shadow border border-[#C4C4C4] rounded-xl focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300 mb-6"
                value={userData.email}
                onChange={handleInputChange}
              />
              {errors.email && (
                <ul className="px-2 text-xs mt-1" style={{ color: "red" }}>
                  {errors.email.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              )}
            </div>
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
                {errors.username && (
                    <ul
                    className="px-2 text-xs mt-1"
                    style={{ color: "red" }}
                    >
                    {errors.username.map((error, index) => (
                        <li key={index}>{error}</li>
                    ))}
                    </ul>
                )}
                </div>
            <div className="w-full flex gap-2">
              <div className="w-1/2">
                <label
                  htmlFor="firstname"
                  className="block text-sm font-bold text-gray-700 ml-1 tracking-wider"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="firstname"
                  name="firstname"
                  placeholder="first name"
                  className="mt-2 p-2 w-full placeholder:text-sm border border-[#C4C4C4] rounded-xl shadow focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
                  value={userData.firstname}
                  onChange={handleInputChange}
                />
                {errors.firstname && (
                  <ul className="px-2 text-xs mt-1" style={{ color: "red" }}>
                    {errors.firstname.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="w-1/2">
                <label
                  htmlFor="lastname"
                  className="block text-sm font-bold text-gray-700 ml-1 tracking-wider"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastname"
                  name="lastname"
                  placeholder="last name"
                  className="mt-2 p-2 w-full placeholder:text-sm border border-[#C4C4C4] rounded-xl shadow focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
                  value={userData.lastname}
                  onChange={handleInputChange}
                />
                {errors.lastname && (
                  <ul className="px-2 text-xs mt-1" style={{ color: "red" }}>
                    {errors.lastname.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <div className="w-full flex gap-2 mt-5">
              <div className="w-1/2">
                <label htmlFor="role" className="block text-sm font-bold text-gray-700 ml-1 tracking-wider">
                  Role
                </label>
                <select
                  id="role"
                  className="select w-full border-[#C4C4C4] rounded-xl shadow p-2 mt-2"
                  value={userData.role ? 1 : 0}
                  onChange={(e) => {
                    const roleBoolean = e.target.value === "1";
                    setUserData({ ...userData, role: roleBoolean });
                  }}
                >
                  <option disabled value={-1}>
                    role
                  </option>
                  <option value={0}>Buyer</option>
                  <option value={1}>Seller</option>
                </select>
                {errors.role && (
                  <ul className="px-2 text-xs mt-1" style={{ color: "red" }}>
                    {errors.role.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="w-1/2">
                <label
                  htmlFor="phone"
                  className="block text-sm font-bold text-gray-700 ml-1 tracking-wider"
                >
                  Phone
                </label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  placeholder="9546897889"
                  className="mt-2 p-2 w-full placeholder:text-sm border border-[#C4C4C4] rounded-xl shadow focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
                  value={userData.phone}
                  onChange={handleInputChange}
                />
                {errors.phone && (
                  <ul className="px-2 text-xs mt-1" style={{ color: "red" }}>
                    {errors.phone.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <div className="relative">
                    <label
                      htmlFor="pass"
                      className="block text-sm font-bold text-gray-700 ml-1 tracking-wider"
                    >
                      Password
                    </label>
                    <input
                      type={isPasswordVisible ? "text" : "password"}
                      id="pass"
                      name="pass"
                      placeholder="Enter password"
                      className="mt-2 mb-3 p-2 w-full placeholder:text-sm border border-[#C4C4C4] rounded-xl shadow focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
                      value={userData.pass}
                      onChange={handleInputChange}
                    />
                    <FontAwesomeIcon
                      icon={isPasswordVisible ? faEyeSlash : faEye}
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-10 cursor-pointer"
                    />
                    {errors.password && (
                      <ul
                        className="px-2 text-xs mt-1"
                        style={{ color: "red" }}
                      >
                        {errors.password.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    )}

                    {errors.password && (
                      <ul
                        className="px-2 text-xs mt-1"
                        style={{ color: "red" }}
                      >
                        {errors.password.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    )}
                  </div>
            {/* Additional fields like username and password */}
            <button
                type="submit"
                className="bg-[#06D6A0] w-full font-bold text-[#fff] text-[1rem] shadow-lg rounded-xl py-2.5 px-10 hover:bg-yellow-300 transition-colors duration-300"
            >
                Sign Up
            </button>
            <div className="flex justify-center items-center">
                <span>Already have an account? </span>
                <Link to="/login" className="text-[#06D6A0] px-2 font-bold"> Login here</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
