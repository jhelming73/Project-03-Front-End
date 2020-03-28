import React from 'react';
import {Link} from 'react-router-dom';
import './ProductAction.css';

const ProductAction = (props) => {
    console.log("Inside ProductAction props=", props);

    let productActions = '';

    switch(props.location.pathname) {
        
        case '/':
            productActions = <Link to='/add-to-order' 
                onClick={(event) => props.handleAddProductToOrder(event, props.product)}>Add To Order</Link>;
            break;

        case '/order-details':
            productActions = <Link to='/order-details' 
                onClick={(event) => 
                    props.handleRemoveProductFromOrder(event, props.product)}>Remove</Link>;
            break;

        case '/manage-products':
            productActions = 
                <span>
                    <Link to='/update-product' id={props.product._id} onClick={(event) =>
                        props.handleUpdateProductRoute(event, props.product)}>Update</Link>
                    <Link to='/delete-product' id={props.product._id} onClick={(event) =>
                        props.handleDeleteProduct(event, props.product)}>Delete</Link>
                </span>;
            break;          
 
        default: productActions = 'There is no default - this is a dummy';
    }
    
    return (       
        <div className="ProductAction">
            {productActions}    
        </div> 
    );
};

export default ProductAction;
