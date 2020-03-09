import React, { Component } from "react";
import FormHeader from 'components/MultiForm/FormHeader'
import Webcam from "react-webcam";

export default class FacialCapture extends Component {
    render() {
      const videoConstraints = {
        width: 700,
        height: 600,
        facingMode: "user"
      };

      if (this.props.currentStep !== 5) { // Prop: The current step
        return null
      }
      return(
        <>
           <FormHeader
              {...this.props}
            />
          <div className="col-md-12">
            <strong>Capture Face</strong>
          </div>
          <div className="row">
            <div className="col-lg-6 col-md-12" style={{marginBottom:"5.5rem",borderStyle:"dashed"}}>
              <Webcam
                audio={false}
                height={480}
                ref={this.props.webCamRef}
                screenshotFormat="image/png"
                width={480}
                videoConstraints={videoConstraints}
              />
            </div>

            {this.props.facial_capture ? <div className="col-lg-6 col-md-12" style={{marginBottom:"5.5rem",borderStyle:"dotted",borderColor:"green"}}>
              <img src={this.props.facial_capture} style={{height:"487px",width:"480px"}} />
            </div> : null}
          
            
          </div>
          <div className="row">
           
            <div className="col-lg-6 col-md-6" style={{marginBottom:"5.5rem"}}>
              <button type="button"  className="btn btn-primary btn-block" onClick={this.props.handleCaptureFaceChangeRef}>Take Image </button>
            </div> 
            {this.props.facial_capture ? <div className="col-lg-6 col-md-6" style={{marginBottom:"5.5rem"}}>
              <button type="button" className="btn btn-danger btn-block" onClick={this.props.handleResetCaptureFaceChangeRef}>Clear Image</button>
            </div> : null }
          </div>
          
          {/* <div className="col-md-12" style={{marginBottom:"5.5rem"}}>
            <button type="button" className="btn btn-danger btn-block" onClick={this.props.resetSignInSignature}>Reset Signature</button>
      </div> */}
        </>

       
      )
    }
  }