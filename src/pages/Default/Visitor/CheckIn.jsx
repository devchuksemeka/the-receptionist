import React, { Component } from "react";
import ContactInfo from 'components/MultiForm/Vistors/ContactInfo'
import VisitationPurpose from 'components/MultiForm/Vistors/VisitationPurpose'
import EntranceSignage from 'components/MultiForm/Vistors/EntranceSignage'
import { 
  Grid, 
  // Row, 
  // Col 
} from "react-bootstrap";
import WhomToSee from "components/MultiForm/Vistors/WhomToSee";
import FacialCapture from "components/MultiForm/Vistors/FacialCapture";
import Preview from "components/MultiForm/Vistors/Preview";




export default class CheckIn extends Component {
  constructor(props) {
    super(props);
    this.webCamRef = React.createRef();
    // Set the initial input values
    this.state = {
      currentStep: 1, // Default is Step 1
      lastStep: 6, // last step number
      name: '',
      email: '',
      phone_number:"",
      address:"",
      whom_to_see_search_param:"",
      purporse_of_visitation:"",
      sign_in_signature_img_url:null,
      facial_capture:""
    }
    // Bind the submission to handleChange() 
    this.handleChange = this.handleChange.bind(this);
    this.handleSetSignInRefChange = this.handleSetSignInRefChange.bind(this);
    this.handleSignInSignatureChange = this.handleSignInSignatureChange.bind(this);
    // Bind new functions for next and previous
    this._next = this._next.bind(this)
    this._prev = this._prev.bind(this)
  }


  state = {
    baseURL:process.env.REACT_APP_SERVER_ENDPOINT,
    loading: true,
  };
  
  handleSetSignInRefChange = (ref) =>{
    this.signInPad = ref
  }

  handleResetSignInSignature = () =>{
    this.signInPad.clear()
    this.setState({
      sign_in_signature_img_url:""
    })
  }

  // Use the submitted data to set the state
  handleChange(event) {
    const {name, value} = event.target
    this.setState({
      [name]: value
    })    
  }
  // Use the submitted data to set the state
  handleSignInSignatureChange = () => this.setState({
    sign_in_signature_img_url: this.signInPad.getTrimmedCanvas().toDataURL('image/png')
  })
  
  handleCaptureFaceChange = () => {
    let facial_capture = this.webCamRef.current.getScreenshot();
    console.log(facial_capture)    
    this.setState({
      facial_capture
    })
  }
  handleResetCaptureFaceChange = () => {
    this.setState({
      facial_capture:null
    })
  }

  signInPad = {}

  
  
  // Trigger an alert on form submission
  handleSubmit = (event) => {
    event.preventDefault()
    const { email, username, password } = this.state
    alert(`Your registration detail: \n 
      Email: ${email} \n 
      Username: ${username} \n
      Password: ${password}`)
  }

  // Test current step with ternary
  // _next and _previous functions will be called on button click
  _next() {
    let currentStep = this.state.currentStep
    // If the current step is 1 or 2, then add one on "next" button click
    currentStep = currentStep + 1
    this.setState({
      currentStep: currentStep
    })
  }
    
  _prev() {
    let currentStep = this.state.currentStep
    // If the current step is 2 or 3, then subtract one on "previous" button click
    currentStep = currentStep - 1
    this.setState({
      currentStep: currentStep
    })
  }

  // The "next" and "previous" button functions
get previousButton(){
  let currentStep = this.state.currentStep;
  // If the current step is not 1, then render the "previous" button
  if(currentStep !==1){
    return (
      <button 
        className="btn btn-secondary" 
        type="button" onClick={this._prev}>
      Previous
      </button>
    )
  }
  // ...else return nothing
  return null;
}

get nextButton(){
  let {currentStep,lastStep} = this.state;
  // If the current step is not 3, then render the "next" button
  if(currentStep < lastStep){
    return (
      <button 
        className="btn btn-primary float-right" 
        type="button" onClick={this._next}>
      Next
      </button>        
    )
  }
  // ...else render nothing
  return null;
}

  render() {
    return (
      <div className="content"> 
        <Grid fluid>
          
            <div className="row" style={{margin:"0.5rem 3.5rem 3.5rem 3.5rem"}}>
            
              <form onSubmit={this.handleSubmit}>
                <ContactInfo 
                  {...this.state}
                  title={'Contact Detail'}
                  currentStep={this.state.currentStep} 
                  handleChange={this.handleChange}
                />
                <WhomToSee 
                  {...this.state}
                  title={'Whom To See'}
                  currentStep={this.state.currentStep} 
                  handleChange={this.handleChange}
                />
                <VisitationPurpose 
                  {...this.state}
                  title={'Purpose Of Visitation'}
                  currentStep={this.state.currentStep} 
                  handleChange={this.handleChange}
                />
                <EntranceSignage 
                  {...this.state}
                  title={'Entrance Signage'}
                  handleSetSignInRefChange={this.handleSetSignInRefChange}
                  handleSignInSignatureChange={this.handleSignInSignatureChange}
                  resetSignInSignature={this.handleResetSignInSignature}
                  currentStep={this.state.currentStep} 
                />   
                <FacialCapture 
                  {...this.state}
                  title={'Facial Capture'}
                  webCamRef={this.webCamRef}
                  handleCaptureFaceChangeRef={this.handleCaptureFaceChange}
                  handleResetCaptureFaceChangeRef={this.handleResetCaptureFaceChange}
                  currentStep={this.state.currentStep} 
                /> 
                <Preview 
                  {...this.state}
                  title={'Preview Details'}
                  currentStep={this.state.currentStep} 
                  handleChange={this.handleChange}
                /> 

                {this.previousButton}
                {this.nextButton}
              </form>
            </div>
            
        </Grid>
      </div>
    );
  }
}
