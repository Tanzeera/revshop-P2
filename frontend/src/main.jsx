import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import store from "./store/store.js";
import PrivateRoute from "./components/Auth/PrivateRoute.jsx";
import Home from "./pages/Home.jsx";
import OpenRoute from "./components/Auth/OpenRoute.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Shop from "./pages/Shop/Shop.jsx";
import Dashboard from "./admin/Dashboard.jsx";
import Profile from "./pages/Profile/Profile.jsx";
import ProductDetail from "./pages/Shop/ProductDetail.jsx";
import Contact from "./pages/Contact/Contact.jsx";
import AdminRoute from "./components/Auth/AdminRoute.jsx";
import AddProduct from "./admin/AddProduct.jsx";
import Order from "./admin/Order.jsx";
import Transactions from "./admin/Transactions.jsx";
import ProductList from "./admin/ProductList.jsx";
import Cart from "./pages/Cart/Cart.jsx";
import Liked from "./pages/Favourite/liked.jsx";
import Checkout from "./pages/Checkout/Checkout.jsx";
import MyOrders from "./pages/Orders/MyOrders.jsx";
import AllUser from "./admin/AllUser.jsx";
// import { AddCategory } from "./admin/AddCategory.jsx";
import Category from "./admin/Category.jsx";
import Review from "./admin/Review.jsx";
import OrderDetails from "./pages/Orders/OrderDetails.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/login",
        element: (
          <OpenRoute>
            <Login />
          </OpenRoute>
        ),
      },
      {
        path: "/signup",
        element: (
          <OpenRoute>
            <Signup />
          </OpenRoute>
        ),
      },
      {
        path: "/admin",
        element: (
          <AdminRoute>
            <Dashboard />
          </AdminRoute>
        ),
      },
      {
        path: "/home/shop",
        element: (
          <PrivateRoute>
            <Shop />
          </PrivateRoute>
        ),
      },
      {
        path: "/home/profile",
        element: (
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        ),
      },
      {
        path: "/home/shop/product",
        element: (
          <PrivateRoute>
            <ProductDetail />
          </PrivateRoute>
        ),
      },
      {
        path: "/home/contact",
        element: (
          <PrivateRoute>
            <Contact />
          </PrivateRoute>
        ),
      },
      {
        path: "admin/add-product",
        element: (
          <AdminRoute>
            <AddProduct />
          </AdminRoute>
        ),
      },
      {
        path: "admin/add-category",
        element: (
          <AdminRoute>
            <Category />
          </AdminRoute>
        ),
      },
      {
        path: "/admin/orders",
        element: (
          <AdminRoute>
            <Order />
          </AdminRoute>
        ),
      },
      {
        path: "/home/shop/cart",
        element: (
          <PrivateRoute>
            <Cart />
          </PrivateRoute>
        ),
      },
      {
        path: "/admin/transaction",
        element: (
          <AdminRoute>
            <Transactions />
          </AdminRoute>
        ),
      },
      {
        path: "/admin/product-list",
        element: (
          <AdminRoute>
            <ProductList />
          </AdminRoute>
        ),
      },
      {
        path: "/admin/all-users",
        element: (
          <AdminRoute>
            <AllUser />
          </AdminRoute>
        ),
      }, 
      {
        path: "/admin/reviews",
        element: (
          <AdminRoute>
            <Review />
          </AdminRoute>
        ),
      }, 
      {
        path: "/home/favorite",
        element: (
          <PrivateRoute>
            <Liked/>
          </PrivateRoute>
        ),
      },
      {
        path: "/home/shop/checkout",
        element: (
          <PrivateRoute>
            <Checkout/>
          </PrivateRoute>
        ),
      },
      {
        path: "/home/my-orders",
        element: (
          <PrivateRoute>
            <MyOrders/>
          </PrivateRoute>
        ),
      },      {
        path: "/orders/:orderId",
        element: (
          <PrivateRoute>
            <OrderDetails/>
          </PrivateRoute>
        ),
      },
    ],
  },
]);

// /admin/transaction

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  //   <App />
  // </StrictMode>,

  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
