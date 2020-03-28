import React from 'react';
import "./ManageProduct.css";

const ManageProduct = (props) => {

    console.log("Inside ManageProduct, props =", props);

    let description = '';
    let imageURL = '';
    let imageAlt = '';
    let price = '';
    
    switch (props.location.pathname) {

        case '/add-product':
            
            if(props.imageURL) imageURL = props.imageURL;

            return (
                <div className="ManageProduct">
                    <form
                        onChange={(event) => props.handleOnChange(event)}
                        onSubmit={(event) => props.handleCreateProduct(event)} >
                        <div>
                            <label>Description:</label>
                            <input type="text" name="description" defaultValue={description}/>
                        </div>
                        <div>
                            <label>Image URL:</label>
                            <input type="text" name="imageURL" defaultValue={imageURL}/>
                            <div className="ProductImageContainer">
                                <img src={imageURL} alt={imageAlt}></img>
                            </div>
                        </div>
                        <div>
                            <label>Price:</label>
                            <input type="text" name="price" defaultValue={price}/>
                        </div>
                        <input type="submit" />
                    </form>
                </div>
            );

        case '/update-product':
            console.log("Inside ManageProduct.case./update-product");

            let updatedProduct = {};
            let currentProduct = props.location.state.product;

            // Initialize the existing product values in the manage-products route
            description = props.location.state.product.description;
            imageURL = props.location.state.product.imageURL;
            imageAlt = props.location.state.product.description;
            price = props.location.state.product.price.$numberDecimal;

            updatedProduct = {
                _id: props.location.state.product._id
                , description: props.description ? props.description : description
                , imageURL: props.imageURL ? props.imageURL : imageURL
                , price: props.price ? props.price : price
            }; 
            
            console.log("currentProduct =",currentProduct, "updatedProduct =", updatedProduct);

            return (
                <div className="ManageProduct">
                    <form
                        onChange={(event) => props.handleOnChange(event)}
                        onSubmit={(event) => props.handleUpdateProductSubmit(event, currentProduct, updatedProduct)}>
                        <div>
                            <label>Description:</label>
                            <input type="text" name="description" defaultValue={description} />
                        </div>
                        <div>
                            <label>Image URL:</label>
                            <input type="text" name="imageURL" defaultValue={imageURL} />
                            <div className="ProductImageContainer">
                                <img src={updatedProduct.imageURL} alt={imageAlt}></img>
                            </div>
                        </div>
                        <div>
                            <label>Price:</label>
                            <input type="text" name="price" defaultValue={price} />
                        </div>
                        <input type="submit" />
                    </form>
                </div>
            );

        default: return 'There is no default - this is a dummy';
    }
};

export default ManageProduct;