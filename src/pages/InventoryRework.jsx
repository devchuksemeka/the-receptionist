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


export default class InventoryRework extends Component {
  
  state = {
    baseURL:process.env.REACT_APP_SERVER_ENDPOINT,
    loading: true,
    currentScreen: "p2",
    view_category: "purchases",// purchases and productions
    currentView: "dailySales",
    pkcAccumulated: {},
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    endDate: new Date(),
    currentDateFilter: "currentWeek",
    graphView: "day",
    currency: "naira",
    server_data:[],
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
    let view_category = "purchases";
    if(currentScreen.toUpperCase() !== "P2"){
      view_category = "productions"
    }
    this.setState({
      currentScreen,
      view_category
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

  getRequestUrl = () => {
   
    return `${this.state.view_category}/filter?${this.getRequestQueryParams()}`;
  }

  processViewLogics = async () => {
    let data = this.state.server_data;
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
        label: `${toTitleCase(this.state.currentScreen)} Quantity ${this.state.view_category === "purchases" ? "Purchased":"Production"}`,
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
        label: `${toTitleCase(this.state.currentScreen)} Average ${this.state.view_category === "purchases" ?"Unit Cost" : "Market Unit"} Price`,
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

  processProductionViewLogics = async () => {
    let data = this.state.server_data.productions;
    let market_prices = this.state.server_data.market_prices;
    let rangeSpan = 0;
    const accumulated = {}
    const market_price_accumulated = {}
    const resData = {};
    const market_price_res_data = {};
    let set_date = this.state.startDate;
    

    if(this.state.graphView === "day"){
      rangeSpan = numberOfDays(this.state.startDate,this.state.endDate);
      for(let i=0; i<=rangeSpan;i++){
          const date = dateAddDays(set_date,i>0 ? 1:0);
          const show_date = getDate(date);
          set_date = date;
          
          const new_array = data.map(record => {
            let total_produced = this.state.currentScreen === "pko" ? record.pko_produced : record.pkc_produced
              if(getDate(record.date) === show_date) {
                  return {
                    total_produced: total_produced || 0,
                    product:this.state.currentScreen
                  }
              }
              return {}
          })
          const marketPricesArray = market_prices.map(record => {
              if(getDate(record.date) === show_date && this.state.currentScreen.toUpperCase() === record.commodity) {
                  return {
                    price:this.state.currency === "naira" ? record.price_per_ton : record.price_per_ton/CONSTANT.USD_TO_NAIRA_CONV_RATE,
                    product:record.commodity
                  }
              }
              return {}
          })
          accumulated[`${show_date}`] = new_array;
          market_price_accumulated[`${show_date}`] = marketPricesArray;
      }
    }

    if(this.state.graphView === "week"){
      rangeSpan = numberOfWeeks(this.state.startDate,this.state.endDate);
      
      for(let i=0; i<=rangeSpan;i++){
        const date = dateAddWeeks(set_date,i>0 ? 1:0);

        set_date = date;

        const new_array = data.map(record => {
          if(getWeek(record.date) === getWeek(date)) {
            let total_produced = this.state.currentScreen === "pko" ? record.pko_produced : record.pkc_produced
              return {
                  total_produced: total_produced || 0,
                  product:this.state.currentScreen
              }
          }
          return {}
        })
        const marketPricesArray = market_prices.map(record => {
          if(getWeek(record.date) === getWeek(date) && this.state.currentScreen.toUpperCase() === record.commodity) {
              return {
                price:this.state.currency === "naira" ? record.price_per_ton : record.price_per_ton/CONSTANT.USD_TO_NAIRA_CONV_RATE,
                product:record.commodity
              }
          }
          return {}
        })
        accumulated[`${getWeekInMonth(date)}`] = new_array;
        market_price_accumulated[`${getWeekInMonth(date)}`] = marketPricesArray;
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
            let total_produced = this.state.currentScreen === "pko" ? record.pko_produced : record.pkc_produced
            return {
              total_produced: total_produced || 0,
              product:this.state.currentScreen
            }
          }
          return {}
        })
        const marketPricesArray = market_prices.map(record => {
          if(getMonth(record.date) === get_month && this.state.currentScreen.toUpperCase() === record.commodity) {
              return {
                price:this.state.currency === "naira" ? record.price_per_ton : record.price_per_ton/CONSTANT.USD_TO_NAIRA_CONV_RATE,
                product:record.commodity
              }
          }
          return {}
        })
        accumulated[`${get_month}`] = new_array;
        market_price_accumulated[`${get_month}`] = marketPricesArray;
      }
    }

    console.log("market_price_accumulated",market_price_accumulated)


    const accumulated_keys  = Object.keys(accumulated);
    // const market_price_accumulated_keys  = Object.keys(market_price_accumulated);
    const accumulated_keys_length = accumulated_keys.length;

    for(let i=0;i<accumulated_keys_length;i++){
      const all_accu = accumulated[accumulated_keys[i]];
      const market_prices = market_price_accumulated[accumulated_keys[i]];
      const all_accu_length = all_accu.length;
      const every = {};
      const every_market_price = {};

      for(let j=0;j<all_accu_length; j++){
          const size = Object.keys(all_accu[j]).length;
          
          if(size > 0){
              const key = this.state.currentScreen;
              // const key = all_accu[j].product;
              if(every[key] !== undefined){
                  every[key] = {
                    total_produced: every[key].total_produced + all_accu[j].total_produced,
                    // total_price_sales: every[key].total_price_sales + all_accu[j].total_price_sales,
                  }

              }else{
                  every[key] = {
                    total_produced: all_accu[j].total_produced,
                    // total_price_sales: all_accu[j].total_price_sales,
                  }
              }
              
          }
      }
      if(every[this.state.currentScreen] === undefined){
          every[this.state.currentScreen] = {
            total_produced: 0,
            // total_price_sales: 0,
          }
      }

      for(let j=0;j<market_prices.length; j++){
        const size = Object.keys(market_prices[j]).length;
        
        if(size > 0){
            const key = this.state.currentScreen;
          if(every_market_price[key] !== undefined){
            every_market_price[key] = {
              price: every_market_price[key].price + market_prices[j].price,
              occurrence: every_market_price[key].occurrence + 1
              // total_price_sales: every[key].total_price_sales + all_accu[j].total_price_sales,
            }

          }else{
            every_market_price[key] = {
              price: market_prices[j].price,
              occurrence:1
            }
          }
        }
      }

    if(every_market_price[this.state.currentScreen] === undefined){
      every_market_price[this.state.currentScreen] = {
        price: 0,
        occurrence:0
      }
    }

      resData[accumulated_keys[i]] = every
      market_price_res_data[accumulated_keys[i]] = every_market_price

    }

  const datasetAccumulated = [];

  for(let j=0;j<1;j++){
    const productionQuantity = [];
    const marketPrice = [];

    for(let i=0;i<accumulated_keys_length;i++){
      const {price,occurrence} = market_price_res_data[accumulated_keys[i]][this.state.currentScreen];
      let division = price/occurrence
      division = isNaN(division) ? 0 : division
      productionQuantity.push(resData[accumulated_keys[i]][this.state.currentScreen].total_produced)
      marketPrice.push(parseFloat(division))
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
   
    const result = await axios.get(`${this.state.baseURL}/v1/supplies/${this.getRequestUrl()}`)
    // console.log("result",result.data.data);
  
    this.setState({
      server_data:result.data.data
    },
    ()=> this.state.view_category === "purchases" ? this.processViewLogics() : this.processProductionViewLogics()
    )
    
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

    await this.state.view_category === "purchases" ? this.processViewLogics() : this.processProductionViewLogics()
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
      () => this.state.view_category === "purchases" ? this.processViewLogics() : this.processProductionViewLogics()
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