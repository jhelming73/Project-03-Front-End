import React from 'react';
import ProductAction from '../ProductAction/ProductAction';
import './Product.css';

const Product = (props) => {   

   console.log("Inside Product, props=", props);

   let description = props.product.description;
   let imageURL = props.product.imageURL;
   let price = Number(props.product.price.$numberDecimal).toFixed(2);
      
   return (
      <div className="ProductContainer">
         <div className="ProductImageContainer">
            <img src={imageURL} alt=""></img>
         </div>
         <div className="ProductDetails">
            <label className="Description">{description}</label>
            <label className="Price">${price}</label>
         </div>
         <ProductAction {...props}/>
      </div>
   );

};

export default Product;