import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

// eslint-disable-next-line react/prop-types
function AdminRoute({ children }) {
    const { userInfo } = useSelector(state => state.auth);

    if (!userInfo) {
        // Redirect to login if userInfo is not defined
        return <Navigate to="/login" />;
    }

    if (userInfo.role === 'ADMIN' || userInfo.role === 'SELLER') {
        return children;
    } else {
        return <Navigate to="/login" />;
    }
}

export default AdminRoute;
