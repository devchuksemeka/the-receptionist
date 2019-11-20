import React, { Component } from "react";
import { Grid, Row, Col } from "react-bootstrap";
import { Card } from "components/Card/Card.jsx";
import { Line, Bar } from "react-chartjs-2";
import Loader from "../common/Loader";
import { getDateFilter } from "../common";
import { getChartData } from "../helpers/SalesHelper";
import {
  getP2Inventory,
  getPkoInventory,
  getPkcInventory
} from "../actions/sheetActions";
import {
  // legendSales
} from "variables/Variables.jsx";

export default class Sales extends Component {
  
  state = {
    loading: true,
    currentScreen: "pko",
    currentView: "dailySales",
    PkoData: {},
    PkcData: {},
    P2ApiData: {},
    pkcAccumulated: {},
    accumulatedData: {},
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    endDate: new Date(),
    currentDateFilter: "currentWeek",
    graphView: "day",
    salesCyclesAvg: "N/A",
    currency: "naira",
  };

  async componentDidMount() {
    await this.handleSubmit();
  }

  setCurrentScreen = e => {
    const currentScreen = e.target.value;
    this.setState({
      currentScreen
    });
  }

  setCurrentView = e => {
    const currentView = e.target.value;
    this.setState({
      currentView
    });
  }

  handleSubmit = async () => {
    const { startDate, endDate, graphView } = this.state;
    const PkoApiData = (await getPkoInventory(
      startDate.toISOString(),
      endDate.toISOString(),
      graphView,
      this.state.currency
    )).pkoData;

    const PkcApiData = (await getPkcInventory(
      startDate.toISOString(),
      endDate.toISOString(),
      graphView,
      this.state.currency
    )).pkcData;

    const P2ApiData = (await getP2Inventory(
      startDate.toISOString(),
      endDate.toISOString(),
      graphView,
      this.state.currency
    )).p2Data;

    this.setState(
      {
        PkoApiData,
        PkcApiData,
        P2ApiData
      },
      () => this.setGraphValues()
    );
  };

  setGraphValues = () => {
    const { PkoApiData, PkcApiData, P2ApiData } = this.state;
    const { PkoData, PkcData, accumulatedData, salesCyclesAvg } = getChartData(
      PkoApiData,
      PkcApiData,
      P2ApiData
    );
    
    this.setState({
      PkoData,
      PkcData,
      loading: false,
      PkoApiData,
      PkcApiData,
      accumulatedData,
      P2ApiData,
      salesCyclesAvg
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
      PkoData,
      currentScreen,
      PkcData,
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
              callback: value => `${currency === "naira" ? "₦":"$"}` + value.toLocaleString()
            }
          }
        ]
      }
    };

    const options = { maintainAspectRatio: false, responsive: true,
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
              callback: value => value + " tons"
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
              callback: value => ` ${currency === "naira" ? "₦":"$"} ` + value.toLocaleString()
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
                {currentScreen === "pko" && (
                  <Line
                    height={400}
                    width={800}
                    data={PkoData}
                    options={options}
                  />
                )}
                {currentScreen === "pkc" && (
                  <Line
                    height={400}
                    width={800}
                    data={PkcData}
                    options={options}
                  />
                )}
                
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