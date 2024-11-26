/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
// import { supabase } from "../../utils/client";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Head from "../../components/common/Head";
import Loader from "../../components/Loader/Loader";
import EditProfileModal from "./EditProfileModal";
import Liked from "../Favourite/liked"
import axios from "axios";

function Profile() {
  const [userData, setUserData] = useState(null);
  const {userInfo} = useSelector((state) => state.auth);
  const username = userInfo.username;
  // console.log("profile : ", userInfo);
  let date = new Date();
  
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fetchData = async () => {
    try {
      // Get user ID from Redux state
      const userId = userInfo.userId;
      
      if (!userId) {
        console.error("User ID not found in Redux state");
        return;
      }
  
      // Fetch user data from the API using Axios
      const response = await axios.get(`http://localhost:8081/auth/users/${userId}`);
      
      // Set user data if the response is successful
      setUserData(response.data);
      console.log( " profile data : ", response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFetchUpdate = () => {
    fetchData();
  };

  if (!userData) {
    return <Loader />;
  }

  return (
    <div className="flex relative flex-col gap-5 items-center justify-center px-8">
      <div className="absolute profile-background -z-20 w-full h-[250px] sm:h-[350px] md:top-[-150px] top-[-200px]"></div>

      <div className="avatar">
        <div className="w-24 sm:w-80 rounded-full">
          <img
            src={
              userData.profilepicture
                ? userData.profilepicture
                : "/images/winter2.jpg"
            }
            alt=""
          />
        </div>
      </div>
      <div className="w-full text-center">
        <Head h2={username} />
      </div>
      <div className="flex gap-5">
        <div className="card">
          <label
            htmlFor="my_modal_1"
            className="btn bg-myyellow hover:bg-mygreen"
          >
            Edit Profile
          </label>
        </div>
      </div>
      <div className="card flex w-full mb-28 rounded-xl shadow-2xl">
        <EditProfileModal userData={userData} onUpdate={handleFetchUpdate} />


        <div className="flex p-5 sm:p-0 flex-col sm:flex-row w-full md:items-center">
          <div className="flex-1 md:p-8 text-justify">
            <div className="flex sm:flex-row flex-col items-start sm:items-center text-sm md:text-xl justify-start">
              <div className="label">
                <span className="label-text md:text-xl text-sm">
                  First Name : <b>{userData.firstName}</b>
                </span>
              </div>
            </div>
            <div className="flex sm:flex-row flex-col items-start sm:items-center text-sm md:text-xl justify-start">
              <div className="label">
                <span className="label-text md:text-xl text-sm">
                  Last Name : <b>{userData.lastName}</b>
                </span>
              </div>
            </div>
            <div className="flex sm:flex-row flex-col items-start sm:items-center text-sm md:text-xl justify-start">
              <div className="label">
                <span className="label-text md:text-xl text-sm">
                  Role :{" "}
                  <b>
                    {userData.role}
                  </b>
                </span>
              </div>
            </div>
          </div>

          <div className="flex-1 md:p-8 text-justify">
            <div className="flex sm:flex-row flex-col items-start sm:items-center text-sm md:text-xl justify-start">
              <div className="label">
                <span className="label-text md:text-xl text-sm">
                  Email : <b>{userData.email}</b>{" "}
                </span>
              </div>
            </div>
            <div className="flex sm:flex-row flex-col items-start sm:items-center text-sm md:text-xl justify-start">
              <div className="label">
                <span className="label-text md:text-xl text-sm">
                  Phone Number : <b>{userData.phone}</b>
                </span>
              </div>
            </div>
            <div className="flex sm:flex-row flex-col items-start sm:items-center text-sm md:text-xl justify-start">
              <div className="label">
                <span className="label-text md:text-xl text-sm">
                  Account Creation Date :{" "}
                  <b>
                    {new Date(userData.createdAt ? userData.createdAt : new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)).toLocaleDateString()}
                  </b>
                </span>
              </div>
            </div>
          </div>
        </div>
        <Liked />
      </div>
    </div>
  );
}

export default Profile;
