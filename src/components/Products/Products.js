import React from 'react';
import {Link} from 'react-router-dom';
import "./Products.css";
import Product from '../Product/Product';

const Products = (props) => {

    console.log("Inside Products, props =", props);
    
    let products = [];
    let pageInfo = '';
    let productsAction = '';
    let productsInfo = '';
    let orderId = props.orderId;
    let orderTotal = props.currentOrderTotal.toFixed(2);    
    let numProducts = 0;
    
    switch(props.location.pathname) {
        
        case '/':
            pageInfo = <h2>Products</h2>;
            productsAction =  <Link to='/order-details'>Order Details</Link>;
            numProducts = props.currentOrder.length;
            productsInfo   = <p>${orderTotal} ({numProducts} items)</p>;
            products = getAvailableProducts();
            break;

        case '/order-details':
            pageInfo = <h2>Order Details</h2>;
            productsAction = <Link to='/submit-order' 
                onClick={(event) => props.handleSubmitOrder(event, props.currentOrder)}>Submit Order</Link>;
            numProducts = props.currentOrder.length;
            productsInfo   = <p>${orderTotal} ({numProducts} items)</p>;
            products = getOrderedProducts();
            break;

        case '/manage-products':
        case '/delete-product':
            pageInfo = <h2>Administration - Manage Products</h2>;    
            productsAction = <Link to='/add-product'>Add Product</Link>;
            products = getAvailableProducts();
            break;

        case '/order-confirmation':
            console.log("inside Products.case.order-confirmation, props = ", props);
            pageInfo = <h2>Order Receipt</h2>;
            numProducts = props.currentOrder.length;
            productsInfo =  
                <span className="OrderSubmission">
                    <p>Thank you for your order!</p>
                    <p>Order #{orderId}</p>
                    <p>Order Total: ${orderTotal} ({numProducts} items)</p>
                </span>;
            products = getOrderedProducts();
            break;

        default: productsAction = 'There is no default - this is a dummy';
    }
    
    function getAvailableProducts() {
        // Create a mapped array of available products
        return props.dbProducts.map( (product) => {
            let randomKey = Math.round(Math.random() * 1000000000);
            return (
                <Product key={randomKey} product={product} {...props}/>
            );
        });
    };

    function getOrderedProducts() {
        // Create a mapped array of order items
        return props.currentOrder.map( (product) => {
            let randomKey = Math.round(Math.random() * 1000000000);
            return (
                <Product key={randomKey} product={product} {...props}/>
            );
        });
    };    

    // Return the array of Product components
    return (
        <div className="ProductsContainer">            
            <div className="ProductsActionInfo">
                <div className="PageInfo">
                    {pageInfo}
                </div>
                <div className="DetailsInfo">
                    {productsAction}{productsInfo}
                </div>
            </div>
            <div className="Products">
                {products}
            </div>
        </div>
    );
};

export default Products;