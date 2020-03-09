import React, { Component } from "react";
import FormHeader from 'components/MultiForm/FormHeader'

export default class VisitationPurpose extends Component {
    render() {
      if (this.props.currentStep !== 3) { // Prop: The current step
        return null
      }
      // The markup for the Step 1 UI
      return(
        <>
           <FormHeader
              {...this.props}
            />

          <div className="form-group">

            <label htmlFor="purporse_of_visitation">Purpose Of Visitation</label>
            <input
              className="form-control"
              id="purporse_of_visitation"
              name="purporse_of_visitation"
              type="text"
              placeholder="Enter Purpose of visitation"
              value={this.props.purporse_of_visitation} 
              onChange={this.props.handleChange} 
            />
          </div>
        </>
        
      )
    }
  }