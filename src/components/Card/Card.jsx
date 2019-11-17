import React, { Component } from "react";

export class Card extends Component {
  render() {
    return (
      <div className={"card" + (this.props.plain ? " card-plain" : "")}>
          {this.props.avg_sale_cycle >= 0 && (<div className="pull-right" style={{
                  background:"#337ab7",
                  padding:"5px 5px",
                  margin:"3rem 1rem",
                  borderRadius:"0.3rem"
                }}>
                <p className="title" style={{
                  color:"white",
                  fontWeight:"bold",
                  fontFamily:"inherit"
                }}>Average Sale Circle: <span>
                  {this.props.avg_sale_cycle === 0 ? "N/A":this.props.avg_sale_cycle}
                </span></p>
              </div>
              )}
          <div className={"header" + (this.props.hCenter ? " text-center" : "")}>
            <h4 className="title">{this.props.title}</h4>
            <p className="category">{this.props.category}</p>
          </div>
          
          
          
      
        <div
          className={
            "content" +
            (this.props.ctAllIcons ? " all-icons" : "") +
            (this.props.ctTableFullWidth ? " table-full-width" : "") +
            (this.props.ctTableResponsive ? " table-responsive" : "") +
            (this.props.ctTableUpgrade ? " table-upgrade" : "")
          }
        >
          {this.props.content}

          <div className="footer">
            {this.props.legend}
            {this.props.stats != null ? <hr /> : ""}
            <div className="stats">
              <i className={this.props.statsIcon} /> {this.props.stats}
            </div>
                
          </div>
        </div>
      </div>
    );
  }
}

export default Card;
