import React, { Component } from "react";
import { Grid, Row, Col } from "react-bootstrap";
import { Card } from "components/Card/Card.jsx";
import { Line } from "react-chartjs-2";
import Loader from "../common/Loader";
import { getDateFilter } from "../common";
import axios from 'axios'
import {
  toTitleCase
} from "../helpers"


export default class InventoryRework extends Component {
  
  state = {
    baseURL:process.env.REACT_APP_SERVER_ENDPOINT,
    loading: true,
    currentScreen: "p2",
    view_category: "purchases",// purchases and productions
    currentView: "dailyPurchase",
    pkcAccumulated: {},
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    endDate: new Date(),
    currentDateFilter: "currentWeek",
    graphView: "day",
    currency: "naira",
    server_data:[],
    purchase_data:[],
    production_data:[],
    chart_object:{
      labels: [],
      datasets: []
    },
  };

  async componentDidMount() {
    await this.handleSubmit();
  }


  setCurrentScreen = e => {
    const currentScreen = e.target.value;
    let view_category = "purchases";
    if(currentScreen.toUpperCase() !== "P2"){
      view_category = "productions"
    }
    this.setState({
      currentScreen,
      view_category
    },()=>this.handleSubmit());
  }

  setCurrentView = async e => {
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

    let query = `currency=${this.state.currency}&graphView=${this.getGraphView()}&startDate=${this.getStartDate()}&endDate=${this.getEndDate()}&currentScreen=${this.state.currentScreen}&currentView=${this.state.currentView}&viewCategory=${this.state.view_category}`;
    return query;
  }

  processViewLogics = async () => {
    this.state.view_category === "purchases" ? (await this.processPurchaseViewLogics()) : (await this.processProductionViewLogics())
  }

  processPurchaseViewLogics = async () => {
    let {datasets,labels} = this.state.data;
    const result_keys = Object.keys(datasets);
    const datasetAccumulated = [];
    const currentScreen = this.state.currentScreen.toUpperCase();

    if(this.state.currentView === "dailyPurchase"){
      for(let j=0;j<1;j++){
        const saleQuantity = [];
        const salePrice = [];
        for(let i=0;i<result_keys.length;i++){
          saleQuantity.push(datasets[result_keys[i]][currentScreen].total_quantity_sales)
          salePrice.push(datasets[result_keys[i]][currentScreen].total_price_sales)
        }
        datasetAccumulated.push(
          {
            yAxisID: "A",
            label: `${toTitleCase(currentScreen)} Quantity Purchased`,
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
            data: saleQuantity
          },
          {
            yAxisID: "B",
            label: `${toTitleCase(currentScreen)} Average Unit Cost Price`,
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
            data: salePrice
          }
        )
  
      }
    }
    if(this.state.currentView === "accumulated"){
      for(let j=0;j<1;j++){
        const saleQuantity = [];
        const salePrice = [];
        for(let i=0;i<result_keys.length;i++){
          saleQuantity.push(datasets[result_keys[i]][currentScreen].total_quantity_sales)
          salePrice.push(datasets[result_keys[i]][currentScreen].total_price_sales)
        }
        datasetAccumulated.push(
          {
            yAxisID: "A",
            label: `${toTitleCase(currentScreen)} Current Inventory`,
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
            data: saleQuantity
          },
          {
            yAxisID: "B",
            label: `${toTitleCase(currentScreen)} Current Inventory Value`,
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
            data: salePrice
          }
        )
  
      }
    }
    this.setState(
      {
        loading: false,
        chart_object:{
          labels,
          datasets:datasetAccumulated
        }
      },
    );
  }

  processProductionViewLogics = async () => { 
    let {datasets,labels} = this.state.data;
    const result_keys = Object.keys(datasets);
    const datasetAccumulated = [];
    const currentScreen = this.state.currentScreen.toUpperCase();

    if(this.state.currentView === "dailyPurchase"){
      
      for(let j=0;j<1;j++){
        const productionQuantity = [];
        const marketPrice = [];
  
        for(let i=0;i<result_keys.length;i++){
          productionQuantity.push(datasets[result_keys[i]][currentScreen].total_produced)
          marketPrice.push(datasets[result_keys[i]][currentScreen].market_price)
        }
        datasetAccumulated.push(
          {
            yAxisID: "A",
            label: `${toTitleCase(this.state.currentScreen)} quantity Produced`,
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
            data: productionQuantity
          },
          {
            yAxisID: "B",
            label: `${toTitleCase(this.state.currentScreen)} average market unit price`,
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
            data: marketPrice
          }
        )
  
      }
    }
    if(this.state.currentView === "accumulated"){
      
      for(let j=0;j<1;j++){
        const productionQuantity = [];
        const marketPrice = [];
  
        for(let i=0;i<result_keys.length;i++){
          productionQuantity.push(parseFloat(datasets[result_keys[i]][currentScreen].total_produced))
          marketPrice.push(datasets[result_keys[i]][currentScreen].market_price)
        }
        datasetAccumulated.push(
          {
            yAxisID: "A",
            label: `${toTitleCase(currentScreen)} quantity Produced`,
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
            data: productionQuantity
          },
          {
            yAxisID: "B",
            label: `${toTitleCase(currentScreen)} average market unit price`,
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
            data: marketPrice
          }
        )
  
      }
    }


    this.setState(
      {
        loading: false,
        chart_object:{
          labels,
          datasets:datasetAccumulated
        }
      },
    );
  }
  
  
  handleSubmit = async () => {
   
    const result = await axios.get(`${this.state.baseURL}/v1/supplies/filter?${this.getRequestQueryParams()}`)

    
    this.setState({
        data:result.data.data
      },
      ()=>this.processViewLogics()
    );
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
    });
  };

  handleGraphView = async e => {
    const graphView = e.target.value;
    await this.setState(
      {
        graphView
      },() => this.handleSubmit()
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
      currentScreen,
      loading,
      currentView,
      currentDateFilter,
      graphView,
      currency
    } = this.state;

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
              stepSize: 1
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
              stepSize: 300
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
          value={this.currency}
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
            <option value="dailyPurchase">Daily Purchase/Production</option>
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
                    height={500}
                    width={900}
                    data={this.state.chart_object}
                    options={options}
                  />
              </div>
            )}
            {currentView === "accumulated" && (
              <div>
                <Line
                    data={this.state.chart_object}
                    options={options}
                    height={500}
                    width={900}
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