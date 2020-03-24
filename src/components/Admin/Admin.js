import React from 'react';
import { Link } from 'react-router-dom';
import "./Admin.css";

const Admin = (props) => {
    console.log("Inside Admin.return", props)
    return (
        <div className="Admin">
            <h1>Adminstration main page</h1>
            <nav>
                <Link to='/AddProduct'>Add Product</Link>
                <Link to='/'>Home</Link>
            </nav>
        </div>
    )
}

export default Admin