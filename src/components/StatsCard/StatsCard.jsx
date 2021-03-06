import React, { Component } from "react";
import { Row, Col } from "react-bootstrap";

export class StatsCard extends Component {
  render() {
    return (
      <div className="card card-stats">
        <div className="content">
          <Row>
            {/* {
              this.props.flipStats === "up" && (<div className="footer">
              
              <div className="stats">
                {this.props.statsIcon} {this.props.statsIconText}
              </div>
              <hr />
            </div>)
            } */}
            <Col xs={2}>
              <div className="icon-big text-center icon-warning">
                {this.props.bigIcon}
              </div>
            </Col>
            <Col xs={10}>
              <div className="numbers">
                <p>{this.props.statsText}</p>
                <div>
                  <span style={{fontSize:"2rem"}}>{this.props.statsValue}</span>
                  <span style={{fontSize:"1.7rem"}}>{this.props.progressLabel}</span>
                </div>
              </div>
            </Col>
          </Row>
          <div className="footer">
              <hr />
              <div className="stats">
                {this.props.statsIcon} {this.props.statsIconText}
              </div>
            </div>
            {/* {
                this.props.flipStats === "down" && (<div className="footer">
                <hr />
                <div className="stats">
                  {this.props.statsIcon} {this.props.statsIconText}
                </div>
              </div>)
              } */}
        </div>
      </div>
    );
  }
}

export default StatsCard;
