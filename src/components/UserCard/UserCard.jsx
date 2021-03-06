import React, { Component } from "react";
import avatar from "../../assets/img/faces/face-3.jpg";
export class UserCard extends Component {
  render() {
    return (
      <div className="card card-user">
        <div className="image">
          <img src={this.props.bgImage || "https://ununsplash.imgix.net/photo-1431578500526-4d9613015464?fit=crop&fm=jpg&h=300&q=75&w=400"} alt="..." />
        </div>
        <div className="content">
          <div className="author">
            <a href="#pablo">
              <img
                className="avatar border-gray"
                src={this.props.avatar || avatar}
                alt="..."
              />
              <h4 className="title">
                {this.props.name}
                <br />
                <small>{this.props.userName}</small>
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

export default UserCard;
