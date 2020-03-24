import React from 'react';
import { Link } from 'react-router-dom';
import "./Admin.css";
import Product from '../Product/Product';

const Admin = (props) => {
    console.log("Inside Admin props=", props)

    let products = props.products.map(product => {
        return <Product key={product._id} product={product} />
    })

    return (
        <div className="Admin">
            <h1>Adminstration Products Page</h1>
            <nav>
                <Link to='/ManageProduct'>Add Product</Link>
                <Link to='/'>Home</Link>
            </nav>
            <div className="ProductsContainer">
                {products}
            </div>
        </div>
    )
}

export default Admin