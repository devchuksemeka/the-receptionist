import React, { Component } from "react";
import { Grid, Row, Col } from "react-bootstrap";
import { Card } from "components/Card/Card.jsx";
import { Line, Bar } from "react-chartjs-2";
import Loader from "../common/Loader";
import { getDateFilter } from "../common";
import { graph_A_B_YAxisDatasets,toMoneyFormatDynamic } from "../helpers";
import { StatsCard } from "components/StatsCard/StatsCard.jsx";
import moment from 'moment'
import axios from 'axios'

export default class Sales extends Component {
  
  state = {
    baseURL:process.env.REACT_APP_SERVER_ENDPOINT,
    loading: true,
    currentScreen: "pko",
    currentView: "dailySales",
    PkoData: {},
    extras:{},
    PkcData: {},
    dataWarehouse:{},
    P2ApiData: {},
    pkcAccumulated: {},
    accumulatedData: {},
    startDate: moment().startOf("week").toDate(),
    endDate: moment().endOf("week").toDate(),
    currentDateFilter: "currentWeek",
    graphView: "day",
    salesCyclesAvg: "N/A",
    currency: "usd",
    sales:[],
    
  };

  async componentDidMount() {
    await this.handleSubmit();
  }


  setCurrentScreen = e => {
    const currentScreen = e.target.value;
    this.setState({
      currentScreen
    },() => this.handleSubmit());
  }

  setCurrentView = e => {
    const currentView = e.target.value;
    this.setState({
      currentView
    },() => this.handleSubmit());
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
    let query = `graphView=${this.getGraphView()}&startDate=${this.getStartDate()}&endDate=${this.getEndDate()}&product=${this.state.currentScreen}&currency=${this.state.currency}`;
    return query;
  }

  
  handleSubmit = async () => {
    this.setGraphValues()
  };

  setGraphValues = async () => {

    let accumulatedData = {};
    let dataWarehouse = {};
    let extras = {};
    
    if(this.state.currentView === "accumulated"){
      const combined_sale_res = await axios.get(`${this.state.baseURL}/v1/sales/combined-sales?${this.getRequestQueryParams()}`)
      const {datasets,labels} = combined_sale_res.data;
  
      const pkoAccumulated = [];
      const pkcAccumulated = [];
      const p2CrushedValue = [];
  
      labels.forEach((element)=>{
        pkoAccumulated.push(datasets[element].PKO.total_price)
        pkcAccumulated.push(datasets[element].PKC.total_price)
        p2CrushedValue.push(datasets[element].crushed_payload.total_cost_price)
      })
  
      accumulatedData = {
        labels,
        datasets: [
          {
            label: "Pko sales",
            stack: "Stack 0",
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
            data: pkoAccumulated
          },
          {
            label: "Pkc sales",
            stack: "Stack 0",
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
            data: pkcAccumulated
          },
          {
            label: "P2 crushed till date value",
            stack: "Stack 1",
            fill: false,
            lineTension: 0.1,
            backgroundColor: "#ffaa1d",
            borderColor: "#ffaa1d",
            borderCapStyle: "butt",
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: "miter",
            pointBorderColor: "#ffaa1d",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "#ffaa1d",
            pointHoverBorderColor: "#ffaa1d",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: p2CrushedValue
          }
        ]
      };
    }
   else if(this.state.currentView === "dailySales"){
    const combined_sale_res = await axios.get(`${this.state.baseURL}/v1/sales/daily-sales?${this.getRequestQueryParams()}`)
    const {datasets,labels} = combined_sale_res.data;
    extras = combined_sale_res.data.extras;

    const total_quantity = [];
    const avg_product_unit_price = [];

    labels.forEach((element)=>{
      total_quantity.push(datasets[element].total_quantity)
      avg_product_unit_price.push(datasets[element].avg_product_unit_price)
    })

    dataWarehouse = graph_A_B_YAxisDatasets(labels,
      {
        label:`${this.state.currentScreen.toUpperCase()} Sold`,
        data:total_quantity,
      },{
        label:"Average Sales Price",
        data:avg_product_unit_price,
      }
    )
   }

    this.setState({
      loading: false,
      accumulatedData,
      salesCyclesAvg:10,
      dataWarehouse,
      extras
    });
  };

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
    });
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

  handleCurrencyChange = e => {
    const currency = e.target.value;
    this.setState(
      {
        currency
      },
      () => this.handleSubmit()
    );
  };

  render() {
    const {
      dataWarehouse,
      currentScreen,
      loading,
      currentView,
      accumulatedData,
      currentDateFilter,
      graphView,
      salesCyclesAvg,
      currency
    } = this.state;

    const stackedBarOptions = {
      tooltips: {
        mode: "label",
        callbacks: {
          label: function(tooltipItem, data) {
            const key = data.datasets[tooltipItem.datasetIndex].label;
            const val =
              data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
            if (val) return key + ` : ${currency === "naira" ? "₦":"$"}` + val.toLocaleString();
          }
        }
      },
      scales: {
        xAxes: [
          {
            stacked: true
          }
        ],
        yAxes: [
          {
            stacked: true,
            ticks: {
              callback: value => `${currency === "naira" ? "₦":"$"}` + value.toLocaleString(),
            }
          }
        ]
      }
    };

    const options = { maintainAspectRatio: true, responsive: true,
      tooltips : {
        mode: "label",
        callbacks: {
          label: function(tooltipItem, data) {
            const key = data.datasets[tooltipItem.datasetIndex].label;
            const yAxis = data.datasets[tooltipItem.datasetIndex].yAxisID;
            const val =
              data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
            if (val && yAxis === "A") return key + ": " +val.toLocaleString() +" tons";
            if (val && yAxis === "B") return key + ` : ${currency === "naira" ? "₦":"$"}` + val.toLocaleString();
          }
        }
      },
      scales:{
        xAxes:[
          {
            scaleLabel: {
              display: true,
              labelString: ""
            }
          }
        ],
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
              callback: value => value + " tons",
              beginAtZero: true,
              stepSize: 2
            }
          },
          {
            type: "linear",
            display: true,
            position: "right",
            id: "B",
            scaleLabel: {
              display: true,
              labelString: ""
            },
            ticks: {
              callback: value => ` ${currency === "naira" ? "₦":"$"} ` + value.toLocaleString(),
              beginAtZero: true,
              stepSize: 100000
            }
          }
        ]
      }
    };
    

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

      {currentView === "dailySales" && (
        <div className="col-md-2 block">
        <select 
          className="form-control form-control-lg"
          value={currentScreen}
          onChange={this.setCurrentScreen}
        >
          <option value="pko">PKO</option>
          <option value="pkc">PKC</option>
        </select>
      </div>
      )}
      
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
         <option value="dailySales">Daily Sales</option>
          <option value="accumulated">Combined Sales</option>
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
    <Row> 
      {/* <Col lg={3} sm={6}>
        <StatsCard
          bigIcon={<i className="pe-7s-magnet text-warning" />}
          statsText="Average Sales Circle"
          statsValue={salesCyclesAvg || 0}
          statsIconText={`Average Sales Circle`}
        />
      </Col> */}
      {currentView === "dailySales" && (
          <React.Fragment>
            <Col lg={3} sm={6}>
              <StatsCard
                bigIcon={<i className="pe-7s-bookmarks text-info" />}
                statsText={`Total ${currentScreen.toUpperCase()} Sold (Ton)`}
                statsValue={this.state.extras.total_product_sold || 0}
                statsIconText={`Total ${currentScreen.toUpperCase()} Quantity Sold (Ton)`}
              />
            </Col>
            <Col lg={3} sm={6}>
              <StatsCard
                bigIcon={<i className="pe-7s-bell text-danger" />}
                statsText={`Total ${currentScreen.toUpperCase()} Sold Price`}
                statsValue={toMoneyFormatDynamic(this.state.extras.total_product_sold_price,this.state.currency === "naira"? "NGN":"USD") || 0}
                statsIconText={`Total ${currentScreen.toUpperCase()} Sold Price`}
              />
            </Col>
          </React.Fragment>
      )}
    </Row> 
    <Row>
      <Col md={12} lg={12}>
        <Card
          statsIcon="fa fa-history"
          id="chartHours"
          title="Sales Metrics"
          category="All Products Sales Metrics Breakdown"
          stats="Sales Metrics"
          content={
            <div className="ct-chart" style={{height:"100%",width:"100%"}}>
               {currentView === "dailySales" && (
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
                <Bar
                    data={accumulatedData}
                    options={stackedBarOptions}
                    height={400}
                    width={800}
                  />
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