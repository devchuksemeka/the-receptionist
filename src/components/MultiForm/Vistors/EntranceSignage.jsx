import React, { Component } from "react";
import FormHeader from 'components/MultiForm/FormHeader'
import SignatureCanvas from 'react-signature-canvas'

export default class EntranceSignage extends Component {
    render() {
      if (this.props.currentStep !== 4) { // Prop: The current step
        return null
      }
      return(
        <>
          <FormHeader
              {...this.props}
            />
          <div className="col-md-12">
            <strong>Draw Signature In Container</strong>
          </div>
          <div className="row">
            <div className="col-lg-4 col-md-12" style={{marginBottom:"5.5rem",borderStyle:"dashed"}}>
              <SignatureCanvas 
                penColor='black'
                // backgroundColor="rgb(29, 200, 234)"
                // ref={(ref)=>{this.}}
                ref={this.props.handleSetSignInRefChange}
                canvasProps={{width: 500, height: 200, className: 'sigCanvas'}} 
              />
            </div>
            {this.props.sign_in_signature_img_url ? <div className="col-lg-7 col-md-12" style={{marginBottom:"5.5rem",borderStyle:"dotted",borderColor:"green"}}>
              <img src={this.props.sign_in_signature_img_url} style={{height:"205px",width:"100%"}} />
            </div> : null}
          </div>

          <div className="row">
            <div className="col-lg-4 col-md-12" style={{marginBottom:"5.5rem"}}>
              <button type="button"  className="btn btn-primary btn-block" onClick={this.props.handleSignInSignatureChange}>Grab Signature </button>
            </div> 
            {this.props.sign_in_signature_img_url ? <div className="col-lg-4 col-md-12" style={{marginBottom:"5.5rem"}}>
              <button type="button" className="btn btn-danger btn-block" onClick={this.props.resetSignInSignature}>Reset Signature</button>
            </div> : null }
          </div>
          
          
        </>
      )
    }
  }