import React, { Component } from "react";
// import axios from 'axios';
import { Grid, 
  // Row, 
  // Col 
} from "react-bootstrap";

import LandingStatsCard from "components/StatsCard/LandingStatsCard";
import logo from "assets/img/reactlogo.png";


export default class Landing extends Component {
  // constructor(props){
  //   super(props);
  // }

  state = {
    baseURL:process.env.REACT_APP_SERVER_ENDPOINT,
    loading: true,
    currentScreen: "pko",
    currentView: "dailySales",
    pkc_product_sales:{
      pkc_total_sales:0,
      pkc_total_left:0,
    },
    pko_product_sales:{
      pko_total_sales:0,
      pko_total_left:0
    },
    p2_product:{
      p2_total_purchased:0,
      p2_total_crushed:0
    },
    pksl_all_time_sale:0,
    extraction_rate:0,
    gross_margin:0,
    gross_margin_computation:{},
    arr_computation:{},
    total_downtime:0,
    annual_run_rate:0,
    downtime_computation:{},
    total_utilization_rate:0,
    utilization_rate_computation:{},
    revenue_data: {},
    
    currentDateFilter: "lastMonth",
    graphView: "day",
    salesCyclesAvg: "N/A",
    currency: "usd",

    target_info:{},
    target_loading:false,
    target_setting:{}
  };

  async componentDidMount(){
  }


  render() {
    return (
      <div className="content"> 
        <Grid fluid>
          <div className="row" style={{marginBottom:"1.5rem"}}>
            <div className="col-md-12 block text-center" style={{marginBottom:"10.5rem"}}>
              <h2>Welcome to <strong>Client Name</strong></h2>
            </div>
            <div className="row" style={{margin:"3.5rem"}}>
              <div className="col-md-3 block text-center">
                <div onClick={()=> this.props.history.push("/visitors/check-in")}>
                  
                </div>
                
              </div>
              <div className="col-md-6 block text-center">
                <div onClick={()=> this.props.history.push("/visitors/check-in")}>
                  <LandingStatsCard
                    bigIcon={<i className="pe-7s-user"/>}
                    statsIconText={`Visitor`}
                  />
                </div>
                
              </div>
              <div className="ol-md-3 block text-center">
                <div onClick={()=> this.props.history.push("/visitors/check-in")}>
                  
                </div>
                
              </div>
            </div>
          </div>
        </Grid>
      </div>
    );
  }
}
