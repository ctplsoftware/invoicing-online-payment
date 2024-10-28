import { Navigate } from "react-router-dom";
import React from "react";

const ProtectPage = ({ Child}) => {

        let x = localStorage.getItem("userDetails");

    function verify(){
        if(x!=null){
            return true;
        }
        else{
            return false;
        }
    }

    return (
        <div className="protectpage">
            {verify() ? <Child /> : <Navigate to="/" />}
        </div>
    );
}

export default ProtectPage;