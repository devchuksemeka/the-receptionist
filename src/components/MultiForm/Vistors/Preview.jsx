import React, { Component } from "react";
import FormHeader from 'components/MultiForm/FormHeader'
import CheckInSlip  from "../CheckInSlip";
export default class Preview extends Component {
    render() {
      if (this.props.currentStep !== this.props.lastStep) { // Prop: The current step
        return null
      }
      // The markup for the Step 1 UI
      return(
          <>
            <FormHeader
              {...this.props}
            />
            <CheckInSlip
            // bgImage={""}
              avatar={this.props.facial_capture}
              name={this.props.name}
              phone_number={this.props.phone_number}
              description={
              <span>
                <h5>Whom To See</h5>
                <h6>Keneth Mark</h6>
                <h5>Purpose Of Visit</h5>
                <h6>{this.props.purporse_of_visitation}</h6>
                
                <br />
                <img
                  className="border-gray"
                  style={{height:"70px",width:"110px"}}
                  src={this.props.sign_in_signature_img_url}
                  alt="signage"
                />
              </span>
              }
            />
          </>
        
      )
    }
  }