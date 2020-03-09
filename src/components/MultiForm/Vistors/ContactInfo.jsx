import React, { Component } from "react";
import FormHeader from 'components/MultiForm/FormHeader'
export default class ContactInfo extends Component {
    render() {
      if (this.props.currentStep !== 1) { // Prop: The current step
        return null
      }
      // The markup for the Step 1 UI
      return(
          <>
            <FormHeader
              {...this.props}
            />
          
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                className="form-control"
                id="name"
                name="name"
                type="text"
                placeholder="Enter Name"
                value={this.props.name}
                onChange={this.props.handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone_number">Phone Number</label>
              <input
                className="form-control"
                id="phone_number"
                name="phone_number"
                type="text"
                placeholder="Enter Phone Number"
                value={this.props.phone_number}
                onChange={this.props.handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input
                className="form-control"
                id="email"
                name="email"
                type="text"
                placeholder="Enter email"
                value={this.props.email} 
                onChange={this.props.handleChange} 
              />
            </div>
            <div className="form-group">
              <label htmlFor="addresss">Address</label>
              <input
                className="form-control"
                id="addresss"
                name="address"
                type="text"
                placeholder="Enter Address"
                value={this.props.address} 
                onChange={this.props.handleChange} 
              />
            </div>
          </>
        
      )
    }
  }