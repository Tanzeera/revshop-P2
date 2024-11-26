/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiHeart } from "react-icons/hi";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";



function Product({id, name, quantity, image, price, disPrice, desc, rating }) {
  const {userInfo} = useSelector(state => state.auth);
  const userId = userInfo?.userId;
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);

  useEffect(()=> {
    const getProductRating = async () => {
      try {
        const res = await axios.get(`http://localhost:8082/reviews/average-rating/${id}`);
        // console.log("product Rating : ", res.data);
        rating = res.data;
      } catch (error) {
        console.error("Failed to get product Rating", error);
        toast.error("Failed to get Product Rating");
      }
    }
    getProductRating();
  }, []);

  const handleNavigate = () => {
    navigate("/home/shop/product", {
      state: {id, name, quantity, image, price, disPrice, desc, rating }
    });
    // console.log("Product rating ", rating);
  };

  const handleLike = async () => {
    try {
      const res = await axios.post(`http://localhost:8086/wishlist/addProduct/${userId}/${id}`)
      toast.success("Product added to wishList successfully");
      setLiked(!liked);
    } catch (error) {
      console.error("Failed to add product to wishlist", error);
      toast.error("Failed to add product to wishlist");
    }
  };

  return (
    <div className="flex flex-col">
      <div
        className={`relative top-[10%] left-[75%] p-2 z-10 rounded-full ${
          liked ? "text-red-500" : "text-gray-500"
        } hover:text-red-500 transition-colors duration-300 cursor-pointer`}
        onClick={handleLike}
      >
        <HiHeart size={24} color={liked ? "red" : "white"} />
      </div>
      <button onClick={handleNavigate}>
        <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
          <img
            src={image}
            alt={name}
            className="h-[500px] w-full object-fill object-center"
          />
        </div>
        <h3 className="mt-4 text-sm text-gray-700">{name}</h3>
        <p className="mt-1 text-lg font-medium text-gray-900">₹{price}</p>
      </button>
    </div>
  );
}

export default Product;
