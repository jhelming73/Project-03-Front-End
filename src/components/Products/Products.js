import React from 'react';
import {Link} from 'react-router-dom';
import "./Products.css";
import Product from '../Product/Product';

const Products = (props) => {

    console.log("Inside Products, props =", props);
    
    let products = [];
    let productsAction = '';
    let productsInfo = '';
    let orderId = '';
    let orderTotal = 0.00;
    let numProducts = 0;
    
    switch(props.location.pathname) {
        
        case '/':
            productsAction =  <Link to='/order-details'>Order Details</Link>;
            orderTotal = Number(getOrderTotal()).toFixed(2);
            numProducts = props.currentOrder.length;
            productsInfo   = <p>${orderTotal} ({numProducts} items)</p>;
            products = getAvailableProducts();
            break;

        case '/order-details':
            productsAction = <Link to='/submit-order'>Submit Order</Link>;
            orderTotal = Number(getOrderTotal()).toFixed(2);
            numProducts = props.currentOrder.length;
            productsInfo   = <p>${orderTotal} ({numProducts} items)</p>;
            products = getOrderedProducts();
            break;

        case '/submit-order':
            orderTotal = Number(getOrderTotal()).toFixed(2);
            numProducts = props.currentOrder.length;
            productsInfo =  
                <span className="OrderSubmission">
                    <p>Thank you for your order!</p>
                    <p>Order # </p>
                    <p>Order Total: ${orderTotal} ({numProducts} items)</p>
                </span>;
            products = getOrderedProducts();
            break;

        default: productsAction = 'There is no default - this is a dummy';
    }
    
    function getAvailableProducts() {
        // Create a mapped array of available products
        return props.dbProducts.map( (product) => {
            return (
                <Product key={product._id} product={product} {...props}/>
            );
        });
    };

    function getOrderedProducts() {
        // Create a mapped array of order items
        return props.currentOrder.map( (product) => {
            return (
                <Product key={product._id} product={product} {...props}/>
            );
        });
    };

    function getOrderTotal() {
        let total = 0;
        props.currentOrder.forEach( (product) => {
            total += parseFloat(product.price.$numberDecimal);
        });  
       return total;      
    }

    // Return the array of Product components
    return (
        <div className="ProductsContainer">            
            <div className="ProductsActionInfo">
                {productsAction}{productsInfo}
            </div>
            <div className="Products">
                {products}
            </div>
        </div>
    );
};

export default Products;