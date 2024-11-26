/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Head from "../../components/common/Head";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

function Liked() {
  const { userInfo } = useSelector(state => state.auth);
  const [likedProducts, setLikedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const userId = userInfo.userId;

  const handleRemoveFromWishList = async (product) => {
    try {
      await axios.delete(`http://localhost:8086/wishlist/removeProduct/${userId}/${product.id}`);
      toast.success("Product removed successfully!");

      setWishlist((prevWishlist) => prevWishlist.filter((id) => id !== product.id));
      setLikedProducts((prevProducts) => prevProducts.filter((item) => item.id !== product.id));
    } catch (error) {
      toast.error("Failed to remove liked product");
      console.error("Error removing liked product:", error);
    }
  };

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const wishlistResponse = await axios.get(`http://localhost:8086/wishlist/user/${userId}`);
        setWishlist(wishlistResponse.data.productIds);
      } catch (error) {
        setError("Failed to fetch wishlist");
        console.error("Error fetching wishlist:", error);
      }
    };

    fetchWishlist();
  }, [userId]);

  useEffect(() => {
    const fetchLikedProducts = async () => {
      if (wishlist.length === 0) {
        setLikedProducts([]);
        setLoading(false);
        return;
      }

      try {
        const productPromises = wishlist.map((productId) =>
          axios.get(`http://localhost:8082/products/${productId}`)
        );

        const productResponses = await Promise.all(productPromises);
        setLikedProducts(productResponses.map((response) => response.data));
      } catch (error) {
        setError("Failed to fetch liked products");
        console.error("Error fetching liked products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLikedProducts();
  }, [wishlist]);

  const navigate = useNavigate();

  const handleAddToCart = (product) => {
    navigate("/home/shop/product", { state: product });
  };

  return (
    <div className="p-6 flex justify-center items-center flex-col">
      <Head h1="Your" h2="WishList" />

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500 text-xl">Loading your wishlist...</p>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-red-500 text-xl font-semibold">{error}</p>
        </div>
      ) : likedProducts.length === 0 ? (
        <div className="flex flex-col items-center mt-16">
          <h2 className="text-2xl font-semibold text-gray-800">No Liked Products Found</h2>
          <p className="text-gray-600 mt-2">Explore our products and add your favorites to your wishlist!</p>
        </div>
      ) : (
        <div className="mt-10 lg:mx-20 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {likedProducts.map((product) => (
            <div
              key={product.id}
              className="relative bg-white border border-gray-200 rounded-lg shadow-lg transition-transform hover:scale-10"
            >
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-96 object-fit rounded-t-lg"
              />
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                <p className="text-gray-600 mt-2 truncate">{product.description}</p>
                <div className="flex items-center justify-between mt-4">
                  <p className="text-xl font-bold text-gray-900">₹{product.discountedPrice || product.price}</p>
                  {/* <span className="bg-green-500 text-white px-2 py-1 rounded-md text-sm font-semibold">
                    {product.rating || "1"} ⭐
                  </span> */}
                </div>
                <div className="flex justify-between gap-10 mt-6">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-1/2 bg-[#06D6A0] hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition-colors"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => handleRemoveFromWishList(product)}
                    className="w-1/2 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Liked;
