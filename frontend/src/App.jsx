/* eslint-disable no-unused-vars */
import { ToastContainer } from "react-toastify"
import { Outlet } from "react-router-dom"
import "react-toastify/dist/ReactToastify.css";
import Footer from "./components/common/Footer";
import PrivateRoute from "./components/Auth/PrivateRoute";
import Navbar from "./components/common/Navbar";
import { useSelector } from "react-redux";
import AdminRoute from "./components/Auth/AdminRoute";
import AdminNavbar from "./admin/AdminNavbar";

function App() {
  const {userInfo} = useSelector(state => state.auth);



  return (
    <div>
      {
        (userInfo?.role === "ADMIN" || userInfo?.role === "SELLER") ?
        (
          <div>
            <AdminRoute>
              <AdminNavbar/>
            </AdminRoute>
          </div>
        ) : (
          <div>
            {/* <PrivateRoute> */}
              <Navbar />
            {/* </PrivateRoute> */}
          </div>
        )
      }

      <ToastContainer/>
      <main>
        <Outlet/>
      </main>
      
      {/* <PrivateRoute> */}
        <Footer/>
      {/* </PrivateRoute> */}
    </div>
  )
}

export default App
