import React, { Component } from "react";
import axios from 'axios'
import { Line } from "react-chartjs-2";
import { Grid, 
  Row, 
  Col 
} from "react-bootstrap";
import { getDateFilter } from "../common";
// import {toMoneyFormat} from '../helpers/index'

import { Card } from "components/Card/Card.jsx";
import { StatsCard } from "components/StatsCard/StatsCard.jsx";
import moment from 'moment'

class Overview extends Component {
  state = {
    baseURL:process.env.REACT_APP_SERVER_ENDPOINT,
    loading: true,
    currentScreen: "pko",
    currentView: "dailySales",
    pko_all_time_sale:0,
    pkc_all_time_sale:0,
    pksl_all_time_sale:0,
    p2_all_time_purchase:0,
    gross_margin:0,
    total_downtime:0,
    total_utilization_rate:0,
    // total_revenue:0,
    // total_expenses:0,
    revenue_data: {},
    
    startDate: moment().startOf("week").toDate(),
    // startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    endDate: moment().endOf("week").toDate(),
    // endDate: new Date(),
    currentDateFilter: "currentWeek",
    graphView: "day",
    salesCyclesAvg: "N/A",
    currency: "naira",
  };

  async componentDidMount(){
    this.handleSubmit();
  }

  handleSubmit = async () => {
    this.getAllTimePurchases();
    this.getAllTimeSales();
    this.getGrossMargin();
    this.getTotalDownTime();
    this.getTotalUtilizationRate();
    this.getAccumulatedRevenue();
  }

  getStartDate = () =>{
    const start_date = this.state.startDate.toISOString();
    return start_date;
  }

  getEndDate = () =>{
    const end_date = this.state.endDate.toISOString();
    return end_date;
  }

  getRequestQueryParams = () =>{
    let query = `&startDate=${this.getStartDate()}&endDate=${this.getEndDate()}`;
    return query;
  }  
  getRequestQueryParamsForGraph = () =>{
    let query = `${this.getRequestQueryParams()}`;
    return query;
  }

  getGrossMargin = async ()=>{
    try{
      const gross_margin_res = await axios.get(`${this.state.baseURL}/v1/overview/gross-margin?${this.getRequestQueryParams()}`)
      const {gross_margin} = gross_margin_res.data

      this.setState({
        gross_margin
      })
    }catch(err){
      console.log(err.response)
    }
  }
  
  getTotalDownTime = async ()=>{
    try{
      const total_downtime_res = await axios.get(`${this.state.baseURL}/v1/overview/total-downtime?${this.getRequestQueryParams()}`)
      const {total_downtime} = total_downtime_res.data

      this.setState({
        total_downtime
      })
    }catch(err){
      console.log(err.response)
    }
  }

  getTotalUtilizationRate = async ()=>{
    try{
      const total_utilization_rate_res = await axios.get(`${this.state.baseURL}/v1/overview/total-utilization-rate?${this.getRequestQueryParams()}`)
      const {total_utilization_rate} = total_utilization_rate_res.data

      this.setState({
        total_utilization_rate
      })
    }catch(err){
      console.log(err.response)
    }
  }

  getAccumulatedRevenue =  async () => {
    try{
      const result = await axios.get(`${this.state.baseURL}/v1/overview/accumulated-revenue?${this.getRequestQueryParamsForGraph()}`)
      const {datasets,labels} = result.data.data
    

    const result_keys = Object.keys(datasets);
    const datasetAccumulated = [];

    for(let j=0;j<1;j++){
    
      const totalPrice = [];
      for(let i=0;i<result_keys.length;i++){
        totalPrice.push(datasets[result_keys[i]].total_sales)
      }
      datasetAccumulated.push(
        {
          yAxisID: "A",
          label: `Accumulated Revenue`,
          fill: false,
          lineTension: 0.1,
          backgroundColor: "rgba(75,192,192,0.4)",
          borderColor: "rgba(75,192,192,1)",
          borderCapStyle: "butt",
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: "miter",
          pointBorderColor: "rgba(75,192,192,1)",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgba(75,192,192,1)",
          pointHoverBorderColor: "rgba(220,220,220,1)",
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: totalPrice
        }
      )
    }
    this.setState({
      // loading: false,
      revenue_data:{
        labels,
        datasets:datasetAccumulated
      }
    })
    }catch(err){
      console.log(err.response)
    }
  }

  getAllTimeSales = async ()=>{
    try{
      const all_time_sales_response = await axios.get(`${this.state.baseURL}/v1/overview/all-time-sales?${this.getRequestQueryParams()}`)
      const {PKSL,PKO,PKC} = all_time_sales_response.data.data

      this.setState({
        pksl_all_time_sale:PKSL || 0,
        pko_all_time_sale:PKO || 0,
        pkc_all_time_sale:PKC || 0,
      })
    }catch(err){
      console.log(err.response)
    }
  }

  getAllTimePurchases = async ()=>{
    try{
      const all_time_purchases_response = await axios.get(`${this.state.baseURL}/v1/overview/all-time-purchases?${this.getRequestQueryParams()}`)
      const {P2} = all_time_purchases_response.data.data
      this.setState({
        p2_all_time_purchase:P2 || 0,
      })
    }catch(err){
      console.log(err.response)
    }
  }

  handleStartDateChange = e => {
    const date = e.target.value;
    console.log("date",date);
    this.setState({
      startDate: new Date(date)
    });
  };

  handleEndDateChange = e => {
    const date = e.target.value;
    this.setState({
      endDate: new Date(date)
    });
  };

  handleDateFilter = e => {
    const currentDateFilter = e.target.value;
    if (currentDateFilter === "custom") {
      return this.setState({
        currentDateFilter
      });
    }
    const { startDate, endDate } = getDateFilter(currentDateFilter);
    this.setState(
      {
        currentDateFilter,
        startDate,
        endDate
      },
      () => this.handleSubmit()
    );
  }; 

  render() {

    const options = { 
      maintainAspectRatio: true, 
      responsive: true,
      tooltips : {
        mode: "label",
        callbacks: {
          label: function(tooltipItem, data) {
            const key = data.datasets[tooltipItem.datasetIndex].label;
            const val =
              data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
            if (val) return key + ` :  ₦` + val.toLocaleString();
            // if (val && yAxis === "B") return key + ` : ${currency === "naira" ? "₦":"$"}` + val.toLocaleString();
          }
        }
      },
      scales:{
        yAxes :[
          {
            type: "linear",
            display: true,
            position: "left",
            id: "A",
            scaleLabel: {
              display: true,
              labelString: ""
            },
            ticks: {
              callback: value => ` ₦ ` + value.toLocaleString(),
              beginAtZero: true,
              stepSize: 1000000
              // callback: value => ` ${currency === "naira" ? "₦":"$"} ` + value.toLocaleString()
            }
          }
        ]
      }
    };
    return (
      <div className="content">
        <Grid fluid>
          <div className="row" style={{marginBottom:"0.5rem"}}>
            <div className="col-md-3 block">
              <select 
                className="form-control form-control-lg"
                value={this.state.currentDateFilter}
                onChange={this.handleDateFilter}>
                  <option value="currentWeek">Current Week</option>
                  <option value="lastWeek">Last Week</option>
                  <option value="last2Weeks">Last 2 Weeks</option>
                  <option value="lastMonth">Last Month</option>
                  <option value="custom">Custom</option>
              </select>
            </div>
            {this.state.currentDateFilter === "custom"  && (<React.Fragment>
              <div className="col-md-3 block">
                <div className="form-group row">
                  <label htmlFor="custom_date_from" className="col-sm-2 col-form-label">From</label>
                  <div className="col-sm-10">
                    <input type="date" onChange={this.handleStartDateChange} className="form-control" id="custom_date_from"></input>
                  </div>
                </div>
              </div>
              <div className="col-md-3 block">
                <div className="form-group row">
                  <label htmlFor="custom_date_to" className="col-sm-2 col-form-label">To</label>
                  <div className="col-sm-10">
                    <input type="date" onChange={this.handleEndDateChange} className="form-control" id="custom_date_to"></input>
                  </div>
                </div>
              </div>
              <div className="col-md-2">
                <button className="btn btn-primary" onClick={this.handleSubmit}>Go</button>
              </div>
            </React.Fragment> 
            )}
          </div>
        
          <Row>
            <Col lg={3} sm={6}>
              <StatsCard
                bigIcon={<i className="pe-7s-server text-warning" />}
                statsText="Utilization Rate"
                statsValue={`${this.state.total_utilization_rate}%`}
                statsIcon={<i className="pe-7s-server" />}
                statsIconText="Utilization Rate"
              />
            </Col>
            <Col lg={3} sm={6}>
              <StatsCard
                bigIcon={<i className="pe-7s-graph1 text-danger" />}
                statsText="Downtime"
                statsValue={`${this.state.total_downtime}%`}
                statsIcon={<i className="fa fa-clock-o" />}
                statsIconText="Total Downtime"
              />
            </Col>
            <Col lg={3} sm={6}>
              <StatsCard
                bigIcon={<i className="pe-7s-note2 text-info" />}
                statsText="Gross Margin"
                statsValue={`${this.state.gross_margin}%`}
                statsIcon={<i className="fa fa-refresh" />}
                statsIconText="Gross Margin"
              />
            </Col>
            <Col lg={3} sm={6} >
                <StatsCard
                  bigIcon={<i className="pe-7s-attention text-warning" />}
                  statsText="P2 (Tons)"
                  statsValue={this.state.p2_all_time_purchase}
                  statsIcon={<i className="pe-7s-server" />}
                  statsIconText="P2 purchase (ATP)"
                />
              </Col>
            
          </Row>
          <Row>
            <Col md={9}>
              <Card
                statsIcon="fa fa-history"
                id="chartHours"
                title="Revenue"
                category="Accumulated Revenue"
                stats="Revenue Chart"
                content={
                  <div className="ct-chart" style={{height:"100%",width:"100%"}}>
                    <Line
                      height={400}
                      width={800}
                      data={this.state.revenue_data}
                      options={options}
                    />
                  </div>
                }
              />
            </Col>
            <Col md={3}>
              <Row>
                <Col lg={12} sm={6}>
                  <StatsCard
                    bigIcon={<i className="pe-7s-star text-danger" />}
                    statsText="PKC (Tons)"
                    statsValue={this.state.pkc_all_time_sale}
                    statsIcon={<i className="fa fa-clock-o" />}
                    statsIconText="PKC Sales (ATS)"
                  />
                </Col>
                <Col lg={12} sm={6}>
                  <StatsCard
                    bigIcon={<i className="pe-7s-paper-plane text-info" />}
                    statsText="PKO (Tons)"
                    statsValue={this.state.pko_all_time_sale}
                    statsIcon={<i className="fa fa-refresh" />}
                    statsIconText="PKO Sales (ATS)"
                  />
                </Col>
                <Col lg={12} sm={12}>
                  <StatsCard
                    bigIcon={<i className="pe-7s-refresh-cloud text-warning" />}
                    statsText="PKSL (Tons)"
                    statsValue={this.state.pksl_all_time_sale}
                    statsIcon={<i className="fa fa-refresh" />}
                    statsIconText="PKSL Sales (ATS)"
                  />
                </Col>
              </Row>
            </Col>
          </Row>

          {/* <Row>
            <Col md={6}>
              <Card
                id="chartActivity"
                title="2014 Sales"
                category="All products including Taxes"
                stats="Data information certified"
                statsIcon="fa fa-check"
                content={
                  <div className="ct-chart">
                    <ChartistGraph
                      data={dataBar}
                      type="Bar"
                      options={optionsBar}
                      responsiveOptions={responsiveBar}
                    />
                  </div>
                }
                legend={
                  <div className="legend">{this.createLegend(legendBar)}</div>
                }
              />
            </Col>

            <Col md={6}>
              <Card
                title="Tasks"
                category="Backend development"
                stats="Updated 3 minutes ago"
                statsIcon="fa fa-history"
                content={
                  <div className="table-full-width">
                    <table className="table">
                      <Tasks />
                    </table>
                  </div>
                }
              />
            </Col>
          </Row> */}
        </Grid>
      </div>
    );
  }
}

export default Overview;
