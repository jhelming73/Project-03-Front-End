import React from 'react';
import {Link} from 'react-router-dom';
import './ProductAction.css';

const ProductAction = (props) => {
    console.log("Inside ProductAction props=", props);

    let productActions = '';

    switch(props.location.pathname) {
        
        case '/':
            productActions = <Link to='/add-to-order' 
                onClick={() => props.handleAddProductToOrder(props.product)}>Add To Order</Link>;
            break;

        case '/order-details':
            productActions = <Link to='/order-details' 
                onClick={(event) => props.handleRemoveProductFromOrder(event, props.product)}>Remove</Link>;
            break;

        case '/submit-order':            
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
