import React, { Component } from "react";
import { Grid, Row, Col } from "react-bootstrap";
import { Card } from "components/Card/Card.jsx";
import { Line, } from "react-chartjs-2";
import Loader from "../common/Loader";
import { getDateFilter } from "../common";
import { graph_A_B_YAxisDatasets } from "../helpers";
import { StatsCard } from "components/StatsCard/StatsCard.jsx";
import axios from 'axios'

export default class Inventory extends Component {
  state = {
    baseURL:process.env.REACT_APP_SERVER_ENDPOINT,
    extra_tooltip_data: {},
    loading: true,
    currentScreen: "p2",
    currentView: "dailyPurchase",
    currentViewMessage: "Daily Purchase",
    dataWarehouse: {},
    PkoData: {},
    PkcData: {},
    P2Accumulated: {},
    productionAndSalesAnalysis: {},
    pkcAccumulated: {},
    P2AvgProduction: {},
    PkoAvgProduction: {},
    PkcAvgProduction: {},
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    endDate: new Date(),
    P2ApiData: [],
    PkoApiData: [],
    PkcApiData: [],
    avg_production_rate_per_hour:0,
    extras: {
      total_p2_remaining:0,
      total_pkc_remaining:0,
      total_pko_remaining:0,
    },
    total_p2_remaining: 0,
    currentDateFilter: "currentWeek",
    graphView: "day",
    currency: "naira",
  };

  async componentDidMount() {
    await this.handleSubmit();
  }

  getStartDate = () =>{
    const start_date = this.state.startDate.toISOString();
    return start_date;
  }

  getEndDate = () =>{
    const end_date = this.state.endDate.toISOString();
    return end_date;
  }

  getGraphView = () => {
    let view = this.state.graphView;
    return view
  }

  getRequestQueryParams = () =>{
    let query = `graphView=${this.getGraphView()}&startDate=${this.getStartDate()}&endDate=${this.getEndDate()}&product=${this.state.currentScreen}&currency=${this.state.currency}&currentView=${this.state.currentView}`;
    return query;
  }

  setGraphValues = async () => {
    let P2Accumulated = {};
    let productionAndSalesAnalysis = {};
    let dataWarehouse = {};
    let extra_tooltip_data = {};
    let avg_production_rate_per_hour = 0;
    let avg_crushing_rate_per_hour = 0;

    if(this.state.currentView === "accumulated"){
      if(this.state.currentScreen === "p2"){
        const purchase_and_crushing_analysis = await axios.get(`${this.state.baseURL}/v1/supplies/purchasing-and-crushing-analysis?${this.getRequestQueryParams()}`)
        const {datasets,labels} = purchase_and_crushing_analysis.data;
        const quantity_remaining = [];
        const inventory_value = [];
        labels.forEach(element=>{
          quantity_remaining.push(datasets[element].total_p2_remaining)
          inventory_value.push(datasets[element].inventory_value)
        })
        P2Accumulated = {
          labels,
          datasets: [
            {
              yAxisID: "A",
              label: "P2 current inventory",
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
              data: quantity_remaining
            },
            {
              yAxisID: "B",
              label: "P2 current inventory value",
              fill: false,
              lineTension: 0.1,
              backgroundColor: "#de6866",
              borderColor: "#de6866",
              borderCapStyle: "butt",
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: "miter",
              pointBorderColor: "#de6866",
              pointBackgroundColor: "#fff",
              pointBorderWidth: 1,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: "#de6866",
              pointHoverBorderColor: "#fe6866",
              pointHoverBorderWidth: 2,
              pointRadius: 1,
              pointHitRadius: 10,
              data: inventory_value
            }
          ]
        };
      }else{
        const production_and_sales_analysis = await axios.get(`${this.state.baseURL}/v1/supplies/production-and-sales-analysis?${this.getRequestQueryParams()}&currentScreen=${this.state.currentScreen}`)
        const {datasets,labels} = production_and_sales_analysis.data;

        const quantity_remaining = [];
        const inventory_values = [];
        labels.forEach(element=>{
          quantity_remaining.push(datasets[element].total_product_produced_remaining)
          inventory_values.push(datasets[element].inventory_value)
        })
        productionAndSalesAnalysis = {
          labels,
          datasets: [
            {
              yAxisID: "A",
              label: `${this.state.currentScreen === "pko" ? "Pko":"Pkc"} current inventory`,
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
              data: quantity_remaining
            },
            {
              yAxisID: "B",
              label: `${this.state.currentScreen === "pko" ? "Pko":"Pkc"} current inventory value`,
              fill: false,
              lineTension: 0.1,
              backgroundColor: "#de6866",
              borderColor: "#de6866",
              borderCapStyle: "butt",
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: "miter",
              pointBorderColor: "#de6866",
              pointBackgroundColor: "#fff",
              pointBorderWidth: 1,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: "#de6866",
              pointHoverBorderColor: "#fe6866",
              pointHoverBorderWidth: 2,
              pointRadius: 1,
              pointHitRadius: 10,
              data: inventory_values
            }
          ]
        };
      }
    }
    else if(this.state.currentView === "dailyPurchase"){
      if(this.state.currentScreen === "p2"){
        const product_purchases = await axios.get(`${this.state.baseURL}/v1/supplies/purchases?${this.getRequestQueryParams()}`)
        const {datasets,labels} = product_purchases.data;
        avg_crushing_rate_per_hour = product_purchases.data.extras.avg_crushing_rate_per_hour
        extra_tooltip_data = datasets;
        const quantity_purchased = [];
        const avg_product_unit_price = [];
        labels.forEach(element=>{
          quantity_purchased.push(datasets[element].total_quantity)
          avg_product_unit_price.push(datasets[element].avg_product_unit_price)
        })
        dataWarehouse = graph_A_B_YAxisDatasets(labels,
          {
            label:"P2 Purchased",
            data:quantity_purchased,
          },{
            label:"Average P2 Price",
            data:avg_product_unit_price,
          }
        )
      }
      else if(this.state.currentScreen === "pkc" || this.state.currentScreen === "pko"){
        const product_purchases = await axios.get(`${this.state.baseURL}/v1/supplies/productions?${this.getRequestQueryParams()}`)
        const {datasets,labels} = product_purchases.data;
        avg_production_rate_per_hour = product_purchases.data.extras.avg_production_rate_per_hour
        extra_tooltip_data = datasets;
        const quantity_produced = [];
        const avg_market_unit_price = [];
        labels.forEach(element=>{
          quantity_produced.push(datasets[element].total_quantity_produced)
          avg_market_unit_price.push(datasets[element].avg_market_unit_price)
        })
        dataWarehouse = graph_A_B_YAxisDatasets(labels,
          {
            label:`${this.state.currentScreen.toUpperCase()}  Produced`,
            data:quantity_produced,
          },{
            label:`Average ${this.state.currentScreen.toUpperCase()} Price`,
            data:avg_market_unit_price,
          }
        )
      }
    }
    this.setState({
      P2Accumulated,
      productionAndSalesAnalysis,
      dataWarehouse,
      loading: false,
      extra_tooltip_data,
      avg_production_rate_per_hour,
      avg_crushing_rate_per_hour,
    });
  };

  setCurrentScreen = e => {
    const currentScreen = e.target.value;
    let currentViewMessage = "Daily Purchase"
    if(currentScreen !== "p2"){
      currentViewMessage = "Daily Production"
    }
    this.setState({
      currentScreen,
      currentViewMessage,
    },
    () => this.handleSubmit());
  }

  setCurrentView =  e=> {
    const currentView = e.target.value;
    // if(cur)
    this.setState({
      currentView
    },
    () => this.handleSubmit());
  }

  handleStartDateChange = e => {
    const date = e.target.value;
    this.setState({
      startDate: new Date(date)
    });
  };

  handleEndDateChange = e => {
    const date = e.target.value;
    this.setState({
      endDate: new Date(date)
    })
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


  handleGraphView = e => {
    const graphView = e.target.value;
    this.setState(
      {
        graphView
      },
      () => this.handleSubmit()
    );
  };

  handleCurrencyChange = e => {
    const currency = e.target.value;
    this.setState(
      {
        currency
      },
      () => this.handleSubmit()
    );
  };

  handleSubmit = async () => {  
    this.setState({
      loading: true
    });
    this.setState(
      {
        loading: false
      },
      () => this.setGraphValues()
    );
  };

  render() {
    const {
      dataWarehouse,
      currentScreen,
      loading,
      currentView,
      P2Accumulated,
      productionAndSalesAnalysis,
      currentDateFilter,
      graphView,
      currency,
      extra_tooltip_data
    } = this.state;

    const options = { maintainAspectRatio: true, responsive: true };
    options.tooltips = {
        mode: "label",
        callbacks: {
          label: function(tooltipItem, data) {
            const key = data.datasets[tooltipItem.datasetIndex].label;
            const yAxis = data.datasets[tooltipItem.datasetIndex].yAxisID;
            const val = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
           
            if (val && yAxis === "A") return key + ": " +val.toLocaleString() +" ton";
            if (val && yAxis === "B") return key + ` : ${currency === "naira" ? "₦":"$"}`+ val.toLocaleString();
        
          },
          afterBody: function(tooltipItem, d) {
            if((currentScreen === "pko" || currentScreen === "pkc") && currentView === "dailyPurchase") {
              return `Production rate: ${extra_tooltip_data[tooltipItem[0].label].production_rate_per_hour}T/hr\nShift hours: ${extra_tooltip_data[tooltipItem[0].label].shift_hours}hrs`;
            }
            if((currentScreen === "p2") && currentView === "dailyPurchase") {
              return `Crushing rate: ${extra_tooltip_data[tooltipItem[0].label].crushing_rate_hr}T/hr\nShift hours: ${extra_tooltip_data[tooltipItem[0].label].shift_hours}hrs`
            };
         }
        }
    }
    options.scales = {};
    options.scales.xAxes = [
      {
        scaleLabel: {
          display: true,
          labelString: ""
        }
      }
    ];
    options.scales.yAxes = [
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
          callback: value => value + " tons",
          beginAtZero: true,
          stepSize: 1
        },
      },
      {
        type: "linear",
        display: true,
        position: "right",
        id: "B",
        scaleLabel: {
          display: true
        },
        ticks: {
          callback: value => `${currency === "naira" ? "₦":"$"}` + value.toLocaleString(),
          beginAtZero: true,
          stepSize: 100000
        },
      }
    ];
    if (loading) {
      return <Loader />;
    }

    return (
      <React.Fragment>
         <div className="content">
            <Grid fluid>
              <div className="row" style={{marginBottom:"0.5rem"}}>
                <div className="col-md-3 block">
                  <select 
                    className="form-control form-control-lg"
                    value={currentDateFilter}
                    onChange={this.handleDateFilter}>
                      <option value="currentWeek">Current Week</option>
                      <option value="lastWeek">Last Week</option>
                      <option value="last2Weeks">Last 2 Weeks</option>
                      <option value="lastMonth">Last Month</option>
                      <option value="custom">Custom</option>
                  </select>
                </div>

                <div className="col-md-2 block">
                  <select 
                    className="form-control form-control-lg"
                    value={currentScreen}
                    onChange={this.setCurrentScreen}
                  >
                  <option value="p2">P2</option>
                    <option value="pko">PKO</option>
                    <option value="pkc">PKC</option>
                  </select>
                </div>
                <div className="col-md-2 block">
                  <select 
                    className="form-control form-control-lg"
                    value={graphView}
                    onChange={this.handleGraphView}>
                  <option value="day">Day</option>
                    <option value="week">Week</option>
                    <option value="month">Month</option>
                  </select>
                </div>
                <div className="col-md-2 block">
                  <select 
                    value={currency}
                    onChange={this.handleCurrencyChange}
                    className="form-control form-control-lg">
                  <option value="naira">Naira</option>
                    <option value="usd">US Dollar</option>
                  </select>
                </div>
                <div className="col-md-3 block">
                  <select 
                    className="form-control form-control-lg"
                    value={currentView}
                    onChange={this.setCurrentView}>
                  <option value="dailyPurchase">{this.state.currentViewMessage}</option>
                    <option value="accumulated">Accumulated</option>
                  </select>
                </div>

              </div>
              <div className="row" style={{marginBottom:"0.5rem"}}>
                {currentDateFilter === "custom"  && (<React.Fragment>
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
              {currentView === "dailyPurchase" && (
                <Row>
                <Col lg={3} sm={6}>
                  <StatsCard
                    bigIcon={<i className="pe-7s-up-arrow text-secondary" />}
                    statsText={`${currentScreen === "p2" ? 'Crushing':'Production'} Rate (Ton/hr)`}
                    statsValue={currentScreen === "p2" ? this.state.avg_crushing_rate_per_hour: this.state.avg_production_rate_per_hour}
                    statsIconText={`Avg ${currentScreen === "p2" ? 'Crushing':'Production'} Rate (Ton/hr)`}
                  />
                </Col>
              </Row>
              )}
              
              <Row>
                <Col md={12} lg={12}>
                  <Card
                    statsIcon="fa fa-history"
                    id="chartHours"
                    title="Inventory Metrics"
                    category="All Products Inventory Metrics Breakdown"
                    stats="Inventory Metrics"
                    content={
                      <div className="ct-chart" style={{height:"100%",width:"100%"}}>
                        {currentView === "dailyPurchase" && (
                        <div>
                            <Line
                              height={400}
                              width={800}
                              data={dataWarehouse}
                              options={options}
                            />
                        </div>
                      )}
                      {currentView === "accumulated" && (
                        <div>
                          
                          {currentScreen === "p2" && (
                            <Line
                              data={P2Accumulated}
                              options={options}
                              height={400}
                              width={800}
                            />
                          )}
                          {(currentScreen === "pkc" ||  currentScreen === "pko") && (
                            <Line
                              data={productionAndSalesAnalysis}
                              options={options}
                              height={400}
                              width={800}
                            />
                          )}
                        </div>
                      )}
                      </div>
                    }
                  />
                </Col>
              </Row>
            </Grid>
          </div>
      </React.Fragment>
      
    );
  }
  
 
}