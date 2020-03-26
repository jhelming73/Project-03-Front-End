import React, { Component } from 'react';
import axios from 'axios';
import "./ManageProduct.css";

const backendURL = "http://localhost:8080/api";

class ManageProduct extends Component {

    constructor(props) {
        super(props);

        this.state = {
              description: '' 
            , imageURL:    ''
            , price:       ''
        };
        console.log("Inside ManageProduct.contructor(), props =", this.props, "state =", this.state);
    }

    componentDidMount() {
        console.log("Inside ManageProduct.componentDidMount(), props =", this.props, "state =", this.state);
    }

    componentDidUpdate() {
        console.log("Inside ManageProduct.componentDidUpdate(), props =", this.props, "state =", this.state);
    }

    handleChange = (event) => {
        console.log("Inside ManageProduct.handleChange(), event.target =", event.target);
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    manageProduct() {
        console.log("Inside App.createProduct(), state = ", this.state);    
        axios({
          method: "post",
          url: `${backendURL}/products`,
          data: {
            product: this.state.product
          }
        })
        .then( product => {
          this.setState( (prevState) => ({
            products: [...prevState.products, product.data]
           })
         );
         console.log("Inside App.createProduct.axios.then(), state = ", this.state, " product = ", product);
        });
      }
    
    render() {
        console.log("Inside ManageProduct.render(), props =", this.props, "state =", this.state); 
        return (
            <div className="ManageProduct">
                <form onChange={this.handleChange} onSubmit={this.props.handleCreateProduct}>
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