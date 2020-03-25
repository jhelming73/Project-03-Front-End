import React, { Component } from 'react';
import "./ManageProduct.css";
import axios from 'axios';

const backendUrl = "http://localhost:8080/api/products/";

class ManageProduct extends Component {
    
    constructor(props) {        
        super(props);
        
        this.state = {
            description: "",
            imageURL: "",
            price: 0.0
        };
        console.log("Inside ManageProduct.contructor(), props =", this.props, "state =", this.state);
    }
    
    componentDidMount() {
        console.log("Inside ManageProduct.componentDidMount(), props =", this.props, "state =", this.state);
        this.props.handleLinkUpdate();
      }
   
    handleChange = (event) => {
        this.setState({
          [event.target.name]: event.target.value
        });
        console.log("Inside ManageProduct.handleChange(), props =", this.props, "state =", this.state);
      }

      handleSubmit = event => {
        event.preventDefault();
        this.createProduct();
        this.props.history.push('/Admin');
      }

      createProduct() {
        axios({
          method: "post",
          url: backendUrl,
          data: {
            description: this.state.description,
            imageURL: this.state.imageURL,
            price: this.state.price
          }
        }).then(product => {
            console.log(product);
        });
    }

    render() {
        return (
            <div className="ManageProduct">
                <h2>Adminstration - Add Product</h2>
                <form onChange={this.handleChange} onSubmit={this.handleSubmit}>
                    <div>
                        <label>Description:</label>
                        <input type="text" name="description" />
                    </div>

                    <div>
                        <label>Image URL:</label>
                        <input type="text" name="imageURL" />
                        <img src={this.state.imageURL} alt=""></img>
                    </div>
                    <div>
                        <label>Price:</label>
                        <input type="text" name="price" />
                    </div>
                    <input type="submit" />
                </form>
            </div>
        );
    }
}

export default ManageProduct;