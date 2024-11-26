import {useSelector } from 'react-redux'
import { Navigate} from 'react-router-dom'



// eslint-disable-next-line react/prop-types
function PrivateRoute({children}) {

    const {userInfo} = useSelector(state => state.auth);
    // console.log(userInfo.role);


    if(userInfo){
        return children
    }else{
        return <Navigate to="/login" />
    }

}

export default PrivateRoute
