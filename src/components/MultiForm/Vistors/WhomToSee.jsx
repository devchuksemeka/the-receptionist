import React, { Component } from "react";
import FormHeader from 'components/MultiForm/FormHeader'
import UserCard from "components/UserCard/UserCard";
// import UserCard from 'components/MultiForm/FormHeader'

export default class WhomToSee extends Component {
    render() {
      if (this.props.currentStep !== 2) { // Prop: The current step
        return null
      }
      // The markup for the Step 1 UI
      return(
        <>
           <FormHeader
              {...this.props}
            />
          <div className="form-group">
            <input
              className="form-control"
              id="username"
              name="username"
              type="text"
              placeholder="Enter Name Or Phone number to search"
              value={this.props.whom_to_see_search_param} // Prop: The email input data
              onChange={this.props.handleChange} // Prop: Puts data into state
            />
          </div>
          <hr/>
          <UserCard
            // bgImage={""}
            // avatar={avatar}
            name={`Chukwuemeka Miracle Okafor`}
            username={`chuksemeka`}
            description={
            <span>
              <strong>Lead Software Developer</strong> (UOE DOMOS)
              <br />
              +234 701 669 4767
              <br />
            </span>
            }
          />

          {/* <div className="form-group">

            <label htmlFor="username">Username</label>
            <input
              className="form-control"
              id="username"
              name="username"
              type="text"
              placeholder="Enter Username"
              value={this.props.username} // Prop: The email input data
              onChange={this.props.handleChange} // Prop: Puts data into state
            />
          </div> */}
        </>
        
      )
    }
  }