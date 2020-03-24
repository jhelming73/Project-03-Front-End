import React from 'react';
import {Link} from 'react-router-dom';
import "./Product.css"

const Product = (props) => {
    console.log("Inside Product props=", props)
           return (
            <div className="Product">
               <img src={props.product.imageURL}></img>
               <div>     
                    <label className="Description">{props.product.description}</label>
                    <label className="Price">${props.product.price.$numberDecimal}</label>
                    <footer>
                    <Link to='/ManageProduct'>Update</Link> 
                    <Link to=''>Delete</Link>
                    </footer>
               </div>
            </div>
       )
   }

export default Product