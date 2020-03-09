import React, { Component } from "react";
export default class FormHeader extends Component {
    render() {
      return(
          <>
            <h1>{this.props.title}</h1>
            <p>Step {this.props.currentStep} of {this.props.lastStep} </p>
          </>
        
      )
    }
  }