import React from 'react';
import "./ManageProduct.css";

const ManageProduct = (props) => {

    console.log("Inside ManageProduct, props =", props);

    let description = '';
    let imageURL = '';
    let price = 0.0;
    
    console.log(props.currentProduct);
    if(props.currentProduct.length !== 0) {
        description = props.currentProduct.description;
        imageURL = props.currentProduct.imageURL;   
        price = props.currentProduct.price.$numberDecimal;
    }
    
    switch (props.location.pathname) {

        case '/add-product':
            return (
                <div className="ManageProduct">
                    <form                 
                         onChange={(event) => props.handleOnChange(event)}  
                         onSubmit={(event) => props.handleCreateProduct(event)} >                    
                        <div>
                            <label>Description:</label>
                            <input type="text" name="description" />
                        </div>
                        <div>
                            <label>Image URL:</label>
                            <input type="text" name="imageURL" />
                            <div className="ProductImageContainer">
                                <img src={props.imageURL} alt=""></img>
                            </div>                        
                        </div>
                        <div>
                            <label>Price:</label>
                            <input type="text" name="price" />
                        </div>
                        <input type="submit" />
                    </form>
                </div>
            );
            
        case '/update-product':

            return (
                <div className="ManageProduct">
                    <form                 
                         onChange={(event) => props.handleOnChange(event)}  
                         onSubmit={(event) => props.handleUpdateProduct(event)} >                    
                        <div>
                            <label>Description:</label>
                            <input type="text" name="description" 
                                defaultValue={description}/>
                        </div>
                        <div>
                            <label>Image URL:</label>
                            <input type="text" name="imageURL" defaultValue={imageURL}/>
                            <div className="ProductImageContainer">
                                <img src={imageURL} alt=""></img>
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
        case '/delete-product':
            break;

        default: return 'There is no default - this is a dummy';
    }     
};

export default ManageProduct;