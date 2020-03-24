import React, { Component } from 'react';
import "./AddProduct.css"
import axios from 'axios';

const backendUrl = "http://localhost:8080/api/products/";

class AddProduct extends Component {
    constructor(props) {        
        super(props)
        this.state = {
            description: "",
            imageURL: "",
            price: 0.0
        }
        console.log("Inside AddProduct.contructor()", this.props)
    }
    
    handleChange = (event) => {
        this.setState({
          [event.target.name]: event.target.value
        })
        console.log("Inside AddProduct.handleChange()", this.state)
      }

      handleSubmit = event => {
        event.preventDefault()
        this.createProduct()
        this.props.history.push('/Admin')
      }

      createProduct() {
        axios({
          method: "POST",
          url: backendUrl,
          data: {
            description: this.state.description,
            imageURL: this.state.imageURL,
            price: this.state.price
          }
        })  .then(product => {
            console.log(product)
        }) 
    }


    render() {
        return (
            <div className="AddProduct">
                <h1>Adminstration Add Product page</h1>
                <form onChange={this.handleChange} onSubmit={this.handleSubmit}>
                    <div>
                        <label>Description:</label>
                        <input type="text" name="description" />
                    </div>

                    <div>
                        <label>Image URL:</label>
                        <input type="text" name="imageURL" />
                        <img src={this.state.imageURL}></img>
                    </div>
                    <div>
                        <label>Price:</label>
                        <input type="text" name="price" />
                    </div>
                    <input type="submit" />
                </form>
            </div>
        )
    }
}

export default AddProduct