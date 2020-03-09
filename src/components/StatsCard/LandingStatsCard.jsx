import React, { Component } from "react";
import { Row, Col } from "react-bootstrap";

export default class LandingStatsCard extends Component {
  render() {
    return (
      <div className="card card-stats">
        <div className="content" style={{backgroundColor:"#ededed"}}>
        {/* <div className="content" style={{backgroundColor:"#dee3e0"}}> */}
          <Row>
            <Col xs={12}>
              <div className="icon-big text-center icon-warning" style={{fontSize:"20rem",color:"#212ea3"}}>
                {this.props.bigIcon}
              </div>
            </Col>
          </Row>
          <div className="footer">
              <hr style={{fontSize:"2.7rem",color:"#170a0a",border:"2px solid black",borderRadius: "5px"}}/>
              <div className="stats" style={{fontSize:"2.7rem",color:"#170a0a",fontWeight:"bold"}}>
                {this.props.statsIconText}
              </div>
            </div>
        </div>
      </div>
    );
  }
}
