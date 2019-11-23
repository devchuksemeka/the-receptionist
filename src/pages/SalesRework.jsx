import React, { Component } from "react";
import { Grid, Row, Col } from "react-bootstrap";
import { Card } from "components/Card/Card.jsx";
import { Line, Bar } from "react-chartjs-2";
import Loader from "../common/Loader";
import { getDateFilter } from "../common";
import axios from 'axios'
import {
  getMonth,
  numberOfDays,
  numberOfWeeks,
  numberOfMonths,
  dateAddDays,
  dateAddMonths,
  dateAddWeeks,
  getDate,
  getWeek,
  getWeekInMonth, 
  toTitleCase,
  CONSTANT
} from "../helpers"


export default class SalesRework extends Component {
  
  state = {
    baseURL:process.env.REACT_APP_SERVER_ENDPOINT,
    loading: true,
    currentScreen: "pko",
    currentView: "dailySales",
    pkcAccumulated: {},
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    endDate: new Date(),
    currentDateFilter: "currentWeek",
    graphView: "day",
    salesCyclesAvg: "N/A",
    currency: "naira",
    sales:[],
    chart_object:{
      labels: [],
      datasets: []
    },
    accumulatedData:{}
  };

  async componentDidMount() {
    await this.handleSubmit();
  }


  setCurrentScreen = e => {
    const currentScreen = e.target.value;
    this.setState({
      currentScreen
    },()=>this.handleSubmit());
  }

  setCurrentView = e => {
    const currentView = e.target.value;
    this.setState({
      currentView
    });
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
    let query = `graphView=${this.getGraphView()}&startDate=${this.getStartDate()}&endDate=${this.getEndDate()}&product=${this.state.currentScreen}`;
    return query;
  }
  processViewLogics = async () => {
    let data = this.state.sales;
    let rangeSpan = 0;
    const accumulated = {}
    const resData = {};
    let set_date = this.state.startDate;
    

    if(this.state.graphView === "day"){
      rangeSpan = numberOfDays(this.state.startDate,this.state.endDate);
      
      
      for(let i=0; i<=rangeSpan;i++){
          const date = dateAddDays(set_date,i>0 ? 1:0);
          const show_date = getDate(date);
          set_date = date;
          
          const new_array = data.map(record => {
              if(getDate(record.date) === show_date) {
                  return {
                      total_quantity_sales:record.quantity_in_ton,
                      // total_price_sales:this.state.currency === "naira" ? record.price_total : record.price_total/CONSTANT.USD_TO_NAIRA_CONV_RATE,
                      total_price_sales:this.state.currency === "naira" ? record.price_per_ton : record.price_per_ton/CONSTANT.USD_TO_NAIRA_CONV_RATE,
                      product:record.product
                  }
              }
              return {}
          })
          accumulated[`${show_date}`] = new_array;
        
      }
    }

    if(this.state.graphView === "week"){
      rangeSpan = numberOfWeeks(this.state.startDate,this.state.endDate);
      
      for(let i=0; i<=rangeSpan;i++){
        const date = dateAddWeeks(set_date,i>0 ? 1:0);

        set_date = date;

        const new_array = data.map(record => {
          if(getWeek(record.date) === getWeek(date)) {
              return {
                  total_quantity_sales:record.quantity_in_ton,
                  total_price_sales:this.state.currency === "naira" ? record.price_per_ton : record.price_per_ton/CONSTANT.USD_TO_NAIRA_CONV_RATE,
                  // total_price_sales:this.state.currency === "naira" ? record.price_total : record.price_total/CONSTANT.USD_TO_NAIRA_CONV_RATE,
                  product:record.product
              }
          }
          return {}
        })
        accumulated[`${getWeekInMonth(date)}`] = new_array;
      }
    }

    if(this.state.graphView === "month"){
      rangeSpan = numberOfMonths(this.state.startDate,this.state.endDate);
      for(let i=0; i<=rangeSpan;i++){
        const date = dateAddMonths(set_date,i>0 ? 1:0);
        let get_month = getMonth(date)
        set_date = date;

        const new_array = data.map(record => {
          if(getMonth(record.date) === get_month) {
              return {
                  total_quantity_sales:record.quantity_in_ton,
                  total_price_sales:this.state.currency === "naira" ? record.price_per_ton : record.price_per_ton/CONSTANT.USD_TO_NAIRA_CONV_RATE,
                  // total_price_sales:this.state.currency === "naira" ? record.price_total : record.price_total/CONSTANT.USD_TO_NAIRA_CONV_RATE,
                  product:record.product
              }
          }
          return {}
        })
        accumulated[`${get_month}`] = new_array;
      }
    }

  console.log("accumulated",accumulated)

    const accumulated_keys  = Object.keys(accumulated);
    const accumulated_keys_length = accumulated_keys.length;

    for(let i=0;i<accumulated_keys_length;i++){
      const all_accu = accumulated[accumulated_keys[i]];
      const all_accu_length = all_accu.length;
      const every = {};

      for(let j=0;j<all_accu_length; j++){
          const size = Object.keys(all_accu[j]).length;
          
          if(size > 0){
              const key = this.state.currentScreen;
              // const key = all_accu[j].product;
              if(every[key] !== undefined){
                  every[key] = {
                    total_quantity_sales: every[key].total_quantity_sales + all_accu[j].total_quantity_sales,
                    total_price_sales: every[key].total_price_sales + all_accu[j].total_price_sales,
                  }

              }else{
                  every[key] = {
                    total_quantity_sales: all_accu[j].total_quantity_sales,
                    total_price_sales: all_accu[j].total_price_sales,
                  }
              }
              
          }
      }
      if(every[this.state.currentScreen] === undefined){
          every[this.state.currentScreen] = {
            total_quantity_sales: 0,
            total_price_sales: 0,
          }
      }

      resData[accumulated_keys[i]] = every


  }


  const datasetAccumulated = [];

  for(let j=0;j<1;j++){
    const saleQuantity = [];
    const salePrice = [];
    for(let i=0;i<accumulated_keys_length;i++){
      saleQuantity.push(resData[accumulated_keys[i]][this.state.currentScreen].total_quantity_sales)
      salePrice.push(resData[accumulated_keys[i]][this.state.currentScreen].total_price_sales)
    }
    datasetAccumulated.push(
      {
        yAxisID: "A",
        label: `${toTitleCase(this.state.currentScreen)} Quantity Sold`,
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
        label: `${toTitleCase(this.state.currentScreen)} Average Unit Selling Price`,
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




    this.setState(
      {
        loading: false,
        chart_object:{
          labels:accumulated_keys,
          datasets:datasetAccumulated
        }
      },
    );
  }
  
  handleSubmit = async () => {
   
    const result = await axios.get(`${this.state.baseURL}/v1/sales/filter?${this.getRequestQueryParams()}`)
    this.setState({
      sales:result.data.data
    },()=>this.processViewLogics())
    
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

  handleGraphView = async e => {
    const graphView = e.target.value;
    await this.setState(
      {
        graphView
      }
    );

    await this.processViewLogics();
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
      () => this.processViewLogics()
    );
  };

  render() {
    const {
      currentScreen,
      loading,
      currentView,
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
            stacked: true,
            ticks:{
              beginAtZero: true,
              stepSize: 1
            }
            
          }
        ],
        yAxes: [
          {
            stacked: true,
            ticks: {
              callback: value => `${currency === "naira" ? "₦":"$"}` + value.toLocaleString(),
              beginAtZero: true,
              stepSize: 1
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
              stepSize: 100
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
         <option value="dailySales">Daily Sales</option>
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
          title="Sales Metrics"
          category="All Products Sales Metrics Breakdown"
          stats="Sales Metrics"
          avg_sale_cycle={salesCyclesAvg}

          content={
            <div className="ct-chart" style={{height:"100%",width:"100%"}}>
               {currentView === "dailySales" && (
              <div>
                  <Line
                    height={400}
                    width={800}
                    data={this.state.chart_object}
                    options={options}
                  />
              </div>
            )}
            {currentView === "accumulated" && (
              <div>
                <Bar
                    data={this.state.chart_object}
                    options={stackedBarOptions}
                    height={400}
                    width={800}
                  />
              </div>
            )}
            </div>
          }
          // legend={
          //   <div className="legend">{this.createLegend(legendSales)}</div>
          // }
        />
      </Col>
    </Row>
  </Grid>
</div>
      </React.Fragment>
      
    );
  }
  
 
}