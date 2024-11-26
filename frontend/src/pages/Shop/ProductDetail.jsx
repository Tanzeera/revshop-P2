/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//components
import Head from "../../components/common/Head";
import Button from "../../components/common/Button";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import ProductReview from "./ProductReview";

function ProductDetail() {
  const {userInfo} = useSelector(state => state.auth);
  const userId = userInfo.userId;
  const availableSizes = ["XS", "S", "M", "L", "XL"];
  const availableColors = [
    { name: "Red", code: "#FF0000" },
    { name: "Green", code: "#00FF00" },
    { name: "Blue", code: "#0000FF" },
    { name: "Yellow", code: "#FFFF00" },
    { name: "Black", code: "#000000" }
  ];

  const [size, setSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const navigate = useNavigate();
  const { state } = useLocation();
  // console.log(state);
  const data = state;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const dispatch = useDispatch();
  const product = {
    name: data.name,
    image: data.image,
    price: data.price,
    disPrice: data.disPrice,
    desc: data.desc,
    quantity: data.quantity || 1,
    ratings: data.rating,
    size,
    color: selectedColor
  };

  const handleSize = (sizeValue) => setSize(sizeValue);
  const handleColor = (colorCode) => setSelectedColor(colorCode);

  const addToCart = async () => {
    if (!size || !selectedColor) {
      toast.error("Please select a size and color");
      return;
    }

    const cartItem = {
      userId,
      cartItems: [
        {
          productId: data.id, // Assuming `data` contains the product ID
          productName: data.name,
          quantity: 1,
          price: data.disPrice,
          image: data.image,
          color: selectedColor,
          size
        }
      ]
    };

    try {
      const response = await axios.post("http://localhost:8090/cart/add", cartItem);
      if (response.status === 200) {
        toast.success("Product added to cart successfully!");
      }
    } catch (error) {
      console.error("Failed to add product to cart:", error);
      toast.error("Failed to add product to cart.");
    }
  };

  return (
    <>
      <div className="mx-auto max-w-screen-xl px-4 py-12 flex justify-between items-center">
        <Head h1="Product" h2="Detail" />
      </div>

      <section className="overflow-hidden bg-white py-11 font-poppins">
        <div className="max-w-6xl px-4 py-4 mx-auto lg:py-8 md:px-6">
          <div className="flex flex-wrap -mx-4">
            <div className="w-full px-4 md:w-1/2">
              <div
                className={`sticky top-0 z-50 overflow-hidden`}
                style={{ backgroundColor: selectedColor,
                  border: selectedColor ? `5px solid ${selectedColor}` : "none"
                 }}
                
              >
                <img
                  src={data.image || data.imageUrl}
                  alt=""
                  className="object-cover w-full lg:h-full"
                />
              </div>
            </div>
            <div className="w-full px-4 md:w-1/2">
              <div className="lg:pl-20">
                <div className="mb-8">
                  <span className="text-lg font-medium text-rose-500 ">
                    Buy Today
                  </span>
                  <h2 className="max-w-xl mt-2 mb-6 text-2xl font-bold md:text-4xl">
                    {data.name}
                  </h2>
                  <p className="max-w-md mb-8 text-gray-700">
                    {data.desc}
                  </p>
                  <p className="inline-block mb-8 text-4xl font-bold text-gray-700 ">
                    <span>₹{data.disPrice}</span>
                    <span className="text-base font-normal text-gray-500 line-through ml-2">
                      ₹{data.price}
                    </span>
                  </p>
                  <p className="text-green-600 ">
                    {data.quantity} in stock
                  </p>
                </div>
                <div className="flex items-center mb-8">
                  <h2 className="w-16 text-xl font-bold ">
                    Size:
                  </h2>
                  <div className="flex flex-wrap -mx-2 -mb-2">
                    {availableSizes.map((value) => (
                      <button
                        key={value}
                        className={`py-1 mb-2 mr-1 border w-11 hover:border-blue-400  hover:text-blue-600 ${
                          value === size ? "bg-mygreen" : ""
                        }`}
                        onClick={() => handleSize(value)}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center mb-8 gap-2">
                  <h2 className="w-16 text-xl font-bold">
                    Color:
                  </h2>
                  <div className="flex flex-wrap -mx-2 -mb-2">
                    {availableColors.map((color) => (
                      <button
                        key={color.name}
                        className={`w-11 h-11 rounded-lg border border-gray-100 mr-2`}
                        style={{
                          backgroundColor: color.code,
                          borderColor:
                            selectedColor === color.code ? "blue" : "gray",
                        }}
                        onClick={() => handleColor(color.code)}
                      />
                    ))}
                  </div>
                </div>
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-800 ">
                    Rating:{" "}
                    <span className="bg-mygreen p-1 px-3 text-mywhite rounded-md">
                      {product.ratings.toFixed(1)} ⭐
                    </span>
                  </h2>
                </div>
                <div className="flex flex-wrap items-center gap-10">
                  <Button
                    text="Add to Cart"
                    color="mygreen"
                    hover="myred"
                    onClick={addToCart}
                  />
                  <Button
                    text="Buy Now"
                    color="myyellow"
                    hover="myred"
                    onClick={() =>
                      navigate("/home/shop/checkout", {
                        state: { directPurchase: product },
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>
          {/* Product Review Section */}
          <ProductReview productId={data.id} userID={userId}/> {/* Add ProductReview here */}
        </div>
      </section>
    </>
  );
}

export default ProductDetail;
