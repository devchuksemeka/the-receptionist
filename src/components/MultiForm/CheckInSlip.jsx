import React, { Component } from "react";
import avatar from "../../assets/img/faces/face-3.jpg";
export default class CheckInSlip extends Component {
  render() {
    return (
      <div className="card card-user">
        <div className="image" style={{backgroundColor:"gray"}}></div>
        <div className="content">
          <div className="author">
            <a href="#pablo">
              <img
                className="avatar border-gray"
                src={this.props.avatar || avatar}
                style={{height:"300px",width:"300px"}}
                alt="..."
              />
              <h4 className="title">
                {this.props.name}
                <br />
                <small>{this.props.phone_number}</small>
              </h4>
            </a>
          </div>
          <p className="description text-center">{this.props.description}</p>
        </div>
        <hr />
        <div className="text-center">{this.props.socials}</div>
      </div>
    );
  }
}
