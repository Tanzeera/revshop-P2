/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { MdOutlineShoppingCart } from "react-icons/md";
import { Slide, toast } from "react-toastify";
import Glassnav from "./Floating_Nav";
import Button from "./Button";
import { logout } from "../../slices/authSlice";
import axios from "axios";

function Screensize() {
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize.width;
}

function Floatingnav() {
  if (Screensize() > 1024) {
    return <Glassnav />;
  }
}

function Navbar() {
  const userName = useSelector((state) => state.auth.userInfo?.username);
  const userId = useSelector((state) => state.auth.userInfo?.userId);
  const dispatch = useDispatch();

  const [items, setItems] = useState([]);
  const [itemsInCart, setItemsInCart] = useState(0);
  const [total, setTotal] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [showHamburgerMenu, setShowHamburgerMenu] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const fetchCartData = async () => {
      try {
        const response = await axios.get(`http://localhost:8090/cart/user/${userId}`);
        const data = response.data;

        // Combine cart items from all objects and calculate total
        const allCartItems = data.flatMap((item) => item.cartItems);
        setItems(allCartItems);

        const cartTotal = allCartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
        setTotal(cartTotal);
        setItemsInCart(allCartItems.length);
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    };

    fetchCartData();
  }, [userId]);

  const toastNotification = (message) => {
    toast(message, {
      position: "top-right",
      autoClose: 5000,
      closeOnClick: true,
      pauseOnHover: false,
      transition: Slide,
    });
  };

  const handleToggleMenu = () => {
    setShowMenu((prev) => !prev);
  };

  const handleCloseMenu = () => {
    setShowMenu(false);
  };

  const handleToggleHamburgerMenu = () => {
    setShowHamburgerMenu((prev) => !prev);
  };

  return (
    <>
      <div className="navbar flex justify-between bg-base-100 p-4">
        <div className="flex md:ml-16 ml-2">
          <Link to="/home">
            <img
              src="/logo.png"
              alt="PopShop Logo"
              className="md:w-36 w-20 duration-100"
            />
          </Link>
        </div>

        <div className="hidden lg:flex justify-center z-[100]">{Floatingnav()}</div>

        <div className="flex-none gap-6 md:mr-16 mr-2">
          <div className="dropdown dropdown-end relative">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle"
            >
              <div className="indicator">
                <MdOutlineShoppingCart className="h-5 w-5" />
                <span className="badge badge-sm indicator-item">
                  {itemsInCart}
                </span>
              </div>
            </div>
            <div
              tabIndex={0}
              className="mt-3 z-[1] right-[2px] card card-compact dropdown-content w-[250px] sm:w-80 bg-base-100 shadow-2xl"
            >
              <div className="card-body">
                <span className="font-bold text-lg text-mynavy">
                  {itemsInCart} Items.
                </span>
                {items.slice(0, 3).map((item, index) => (
                  <div key={`${item.productName}-${index}`} className="flex gap-3 mt-4">
                    <div className="w-20 h-16">
                      <img
                        src={item.image}
                        alt="product-image"
                        className="object-cover w-full h-full rounded"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold dark:text-gray-400">
                        {item.productName}
                      </h4>
                      <p className="font-medium dark:text-gray-400">
                        Price: ₹{item.price}
                      </p>
                    </div>
                  </div>
                ))}

                <span className="text-mynavy mt-3">
                  subtotal ₹{total}
                </span>

                <Link
                  to="/home/shop/cart"
                  className="card-actions w-full flex items-center justify-center mt-3"
                >
                  <Button text="View All" color="myyellow" hover="mygreen" />
                </Link>
              </div>
            </div>
          </div>

          {/* Conditionally render profile or login */}
          {userId ? (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
                onClick={handleToggleMenu}
              >
                <div className="w-10 rounded-full">
                  <img
                    src={userInfo.profilepicture || "/images/winter2.jpg"}
                    alt="User profile"
                  />
                </div>
              </div>
              {showMenu && (
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content mt-3 z-[1] p-2 bg-base-100 rounded-box w-52 shadow-2xl"
                >
                  <li onClick={handleCloseMenu}>
                    <Link to={"/home/profile"}>
                      {userName || <p>Profile</p>}
                    </Link>
                  </li>
                  <li onClick={handleCloseMenu}>
                    <Link to={"/home/shop"}><p>Shop</p></Link>
                  </li>
                  <li onClick={handleCloseMenu}>
                    <Link to={"/home/favorite"}><p>Favorite</p></Link>
                  </li>
                  <li onClick={handleCloseMenu}>
                    <Link to={"/home/shop/cart"}><p>Cart</p></Link>
                  </li>
                  <li onClick={handleCloseMenu}>
                    <Link to="/home/my-orders"><p>My Orders</p></Link>
                  </li>
                  <li onClick={() => {
                    dispatch(logout());
                    handleCloseMenu();
                    toastNotification("Logged out successfully!");
                  }}>
                    <Link to={"/"}><p>Logout</p></Link>
                  </li>
                </ul>
              )}
            </div>
          ) : (
            <Link to="/login">
              <Button text="Login" color="myyellow" hover="mygreen" />
            </Link>
          )}

          <div className="lg:hidden">
            <button
              className={`btn btn-ghost btn-circle fa ${showHamburgerMenu ? 'fa-times' : 'fa-bars'}`}
              onClick={handleToggleHamburgerMenu}
            ></button>
          </div>
        </div>
      </div>
      {showHamburgerMenu && (
        <div className="lg:hidden bg-base-100 p-4 shadow-2xl absolute top-16 right-0 w-full">
          <ul className="menu menu-compact">
            <li>
              <Link to={"/home#Collections"} onClick={() => setShowHamburgerMenu(false)}>Collections</Link>
            </li>
            <li>
              <Link to={"/home#Products"} onClick={() => setShowHamburgerMenu(false)}>Product</Link>
            </li>
            <li>
              <Link to={"/home/contact"} onClick={() => setShowHamburgerMenu(false)}>Contact Us</Link>
            </li>
            <li>
              <button
                onClick={() => {
                  dispatch(logout());
                  setShowHamburgerMenu(false);
                  toastNotification("Logged out successfully!");
                }}
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </>
  );
}

export default Navbar;
