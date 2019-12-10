import React, { Component } from "react";
import axios from 'axios'
import { Line } from "react-chartjs-2";
import { Grid, 
  Row, 
  Col
} from "react-bootstrap";
import Button from "components/CustomButton/CustomButton.jsx";
import { getDateFilter } from "../common";
import {toTitleCase} from '../helpers/index'

import { Card } from "components/Card/Card.jsx";
import { StatsCard } from "components/StatsCard/StatsCard.jsx";
import moment from 'moment'


class Overview extends Component {
  constructor(props){
    super(props);
    this.utitlizationRateEl = React.createRef();
    this.downtimeEl = React.createRef();
    this.grossMarginEL = React.createRef();
    this.pkoEL = React.createRef();
}

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
    gross_margin:0,
    gross_margin_computation:{},
    total_downtime:0,
    downtime_computation:{},
    total_utilization_rate:0,
    utilization_rate_computation:{},
    revenue_data: {},
    
    startDate: moment().subtract(1,"months").startOf("month").toDate(),
    endDate: moment().subtract(1,"months").endOf("month").toDate(),
    currentDateFilter: "lastMonth",
    // currentDateFilter: "currentWeek",
    graphView: "day",
    salesCyclesAvg: "N/A",
    currency: "naira",
    target_info:{},
    target_loading:false,
    target_setting:{}
  };

  async componentDidMount(){
    this.handleSubmit();
    this.getTargetSetting();
  }

  handleUpdateTarget = async (e) => {
    e.preventDefault()
    this.setState({
      target_loading:true
    })
    const form_data = {
      utilization_rate:this.utitlizationRateEl.current.value || this.state.target_setting.utilization_rate || 0,
      downtime:this.downtimeEl.current.value  || this.state.target_setting.downtime || 0,
      gross_margin:this.grossMarginEL.current.value || this.state.target_setting.gross_margin || 0,
      pko:this.pkoEL.current.value || this.state.target_setting.pko || 0,
    }
    try{
      const response = await axios.post(`${this.state.baseURL}/v1/settings/update-target`, form_data);
      this.setState({
        target_info:response.data,
        target_loading:false,
        target_setting:form_data
      },()=>alert("Target Update Successful"))
    }catch(err){
      console.log(err.message)
    }
   
  }

  getTargetSetting = async () => {
    try{
      const target_setting_res = await axios.get(`${this.state.baseURL}/v1/settings/type/target`);
      let target_setting = target_setting_res.data.data
      
      this.setState({
        target_setting
      });
      

    }catch(err){
      console.log(err.message);
    }
    
  }

  handleSubmit = async () => {
    this.getAllTimePurchases();
    this.getGrossMargin();
    this.getTotalDownTime();
    this.getTotalUtilizationRate();
    this.getAccumulatedRevenue();
    this.getProductSales("PKO");
    this.getProductSales("PKC");
    this.getProductSales("PKSL");
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
      const {gross_margin,target_setting} = gross_margin_res.data

      this.setState({
        gross_margin,
        gross_margin_computation:target_setting
      })
    }catch(err){
      console.log(err.response)
    }
  }
  
  getTotalDownTime = async ()=>{
    try{
      const total_downtime_res = await axios.get(`${this.state.baseURL}/v1/overview/total-downtime?${this.getRequestQueryParams()}`)
      const {total_downtime,target_setting} = total_downtime_res.data

      this.setState({
        total_downtime,
        downtime_computation:target_setting
      })
    }catch(err){
      console.log(err.response)
    }
  }

  getTotalUtilizationRate = async ()=>{
    try{
      const total_utilization_rate_res = await axios.get(`${this.state.baseURL}/v1/overview/total-utilization-rate?${this.getRequestQueryParams()}`)
      const {total_utilization_rate,target_setting} = total_utilization_rate_res.data

      this.setState({
        total_utilization_rate,
        utilization_rate_computation:target_setting
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

  getProductSales = async (product="PKO")=>{
    try{
      const product_sales = await axios.get(`${this.state.baseURL}/v1/overview/product-sales-info?product=${product}${this.getRequestQueryParams()}`)
      const {total_produced,total_sales} = product_sales.data.data

      if(product === "PKO"){
        this.setState({
          pko_product_sales:{
            pko_total_sales: total_sales || 0,
            pko_total_left:total_produced || 0,
          }
        })
      }

      else if(product === "PKC"){
        this.setState({
          pkc_product_sales:{
            pkc_total_sales:total_sales || 0,
            pkc_total_left: total_produced || 0,
          }
        })
      }

      else if(product === "PKSL"){
        this.setState({
          pksl_all_time_sale: total_sales || 0
        })
      }
      
    }catch(err){
      console.log(err.response)
    }
  }

  getAllTimePurchases = async ()=>{
    try{
      const all_time_purchases_response = await axios.get(`${this.state.baseURL}/v1/overview/product-purchases-info?${this.getRequestQueryParams()}`)
      const {p2,total_crushed} = all_time_purchases_response.data.data
      // console.log({p2,total_crushed})

      this.setState({
        p2_product:{
          p2_total_purchased:p2 || 0,
          p2_total_crushed: total_crushed || 0
        }
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
    const getProgressiveLabelStatIcon = (value,status) => {
      console.log(value,status)
        if(status === "above") return "fa fa-arrow-up text-success";
        else if(status === "below" && value < 60) return "fa fa-arrow-down text-warning";
        else if(status === "below" && value >= 60) return "fa fa-arrow-down text-danger";
      
    }

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
                bigIcon={<i className="fa fa-wrench text-primary" />}
                statsText="Utilization Rate"
                statsValue={`${this.state.total_utilization_rate}%`}
                statsIcon={<i className={getProgressiveLabelStatIcon(this.state.utilization_rate_computation.percentage,this.state.utilization_rate_computation.status)} />}
                statsIconText={`${this.state.utilization_rate_computation.percentage}% 
                  ${toTitleCase(this.state.utilization_rate_computation.status || "")} target`}
                progressLabel={<i className={getProgressiveLabelStatIcon(this.state.utilization_rate_computation.percentage,this.state.utilization_rate_computation.status)}></i>}
              />
            </Col>
            <Col lg={3} sm={6}>
              <StatsCard
                bigIcon={<i className="pe-7s-graph1 text-danger" />}
                statsText="Downtime"
                statsValue={`${this.state.total_downtime}%`}
                statsIcon={<i className={getProgressiveLabelStatIcon(this.state.downtime_computation.percentage,this.state.downtime_computation.status)} />}
                statsIconText={`${this.state.downtime_computation.percentage}% 
                  ${toTitleCase(this.state.downtime_computation.status || "")} target`}
                  progressLabel={<i className={getProgressiveLabelStatIcon(this.state.downtime_computation.percentage,this.state.downtime_computation.status)}></i>}
              />
            </Col>
            <Col lg={3} sm={6}>
              <StatsCard
                bigIcon={<i className="pe-7s-note2 text-info" />}
                statsText="Gross Margin"
                statsValue={`${this.state.gross_margin}%`}
                statsIcon={<i className={getProgressiveLabelStatIcon(this.state.gross_margin_computation.percentage,this.state.gross_margin_computation.status)} />}
                statsIconText={`${this.state.gross_margin_computation.percentage}% 
                  ${toTitleCase(this.state.gross_margin_computation.status || "")} target`}
                progressLabel={<i className={getProgressiveLabelStatIcon(this.state.gross_margin_computation.percentage,this.state.gross_margin_computation.status)}></i>}
              />
            </Col>
            <Col lg={3} sm={6} >
                <StatsCard
                  bigIcon={<i className="pe-7s-attention text-warning" />}
                  statsText="P2 Purchased (Tons)"
                  statsValue={this.state.p2_product.p2_total_purchased}
                  statsIcon={<i className="pe-7s-server" />}
                  statsIconText={`P2 Crushed ${this.state.p2_product.p2_total_crushed} (tons)`}
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
                <Col lg={12} sm={12}>
                  <StatsCard
                    bigIcon={<i className="pe-7s-star text-danger" />}
                    statsText="PKC Sold (Tons)"
                    statsValue={this.state.pkc_product_sales.pkc_total_sales}
                    statsIcon={<i className="fa fa-clock-o" />}
                    statsIconText={`PKC produced ${this.state.pkc_product_sales.pkc_total_left} (tons)`}
                  />
                </Col>
                <Col lg={12} sm={12}>
                  <StatsCard
                    bigIcon={<i className="pe-7s-paper-plane text-info" />}
                    statsText="PKO Sold (Tons)"
                    statsValue={this.state.pko_product_sales.pko_total_sales}
                    statsIcon={<i className="fa fa-refresh" />}
                    statsIconText={`PKO produced ${this.state.pko_product_sales.pko_total_left} (tons)`}
                  />
                </Col>
                <Col lg={12} sm={12}>
                  <StatsCard
                    bigIcon={<i className="pe-7s-refresh-cloud text-warning" />}
                    statsText="PKSL Sold (Tons)"
                    statsValue={this.state.pksl_all_time_sale}
                    statsIcon={<i className="fa fa-refresh" />}
                    statsIconText="PKSL Sales"
                  />
                </Col>
              </Row>
            </Col>
          </Row>

          <Row>
          <Col md={8}>
              <Card
                title="Production Targets"
                content={
                  <form onSubmit={this.handleUpdateTarget} >
                    <div className="form-group">
                      <div className="col-md-6 col-xs-12">
                        <label htmlFor="utilization_rate">Utilization Rate (%) | <strong>Current Value: {this.state.target_setting.utilization_rate}%</strong></label>
                        <input 
                          type="number" 
                          className="form-control" 
                          id="exampleInputEmail1" 
                          ref={this.utitlizationRateEl}
                          placeholder="Utilization Rate"
                          >
                        </input>
                      </div>
                      <div className="col-md-6 col-xs-12">
                        <label htmlFor="downtime">Downtime (%) | <strong>Current Value: {this.state.target_setting.downtime}%</strong></label>
                        <input 
                          type="number" 
                          className="form-control" 
                          id="downtime" 
                          ref={this.downtimeEl}
                          placeholder="Downtime"
                          >
                        </input>
                      </div>
                    </div>
                    <div className="form-group">
                      <div className="col-md-6 col-xs-12">
                        <label htmlFor="gross_margin">Gross Margin (%) | <strong>Current Value: {this.state.target_setting.gross_margin}%</strong></label>
                        <input 
                          type="number" 
                          className="form-control" 
                          id="gross_margin" 
                          ref={this.grossMarginEL}
                          placeholder="Gross Margin"
                          >
                        </input>
                      </div>
                      <div className="col-md-6 col-xs-12">
                        <label htmlFor="pko">PKO (tons) | <strong>Current Value: {this.state.target_setting.pko} (tons)</strong></label>
                        <input 
                          type="number" 
                          className="form-control" 
                          id="pko" 
                          ref={this.pkoEL}
                          placeholder="PKO"
                          >
                        </input>
                      </div>
                    </div>
                    <div className="form-group">
                      <div className="col-md-6 col-xs-12 pull-right">
                      {!this.state.target_loading && (<Button bsStyle="info" pullRight fill type="submit">
                          Update Targets
                        </Button>)}
                        {this.state.target_loading && (<Button bsStyle="info" pullRight fill >
                          Updating .....
                        </Button>)}
                      </div>
                      
                    </div>
                    <div className="clearfix" />
                  </form>
                }
              />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default Overview;
