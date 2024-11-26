/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

function OpenRoute({children}) {
    const {userInfo} = useSelector((state) => state.auth);
    console.log(userInfo);

    if(userInfo){
        return <Navigate to="/" />
    }else{
        return children
    }
}

export default OpenRoute
