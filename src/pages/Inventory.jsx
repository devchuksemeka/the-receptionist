import React, { Component } from "react";
import ChartistGraph from "react-chartist";
import { Grid, Row, Col } from "react-bootstrap";
import { Card } from "components/Card/Card.jsx";
import { Line, Bar } from "react-chartjs-2";
import Loader from "../common/Loader";
import DatePicker from "react-datepicker";
import { getDateFilter } from "../common";
import { getGraphValues } from "../helpers/InventoryHelper";
import {
  getP2Inventory,
  getPkoInventory,
  getPkcInventory
} from "../actions/sheetActions";
import {
  dataSales,
  optionsSales,
  responsiveSales,
  legendSales
} from "variables/Variables.jsx";

export default class Inventory extends Component {
  createLegend(json) {
    var legend = [];
    for (var i = 0; i < json["names"].length; i++) {
      var type = "fa fa-circle text-" + json["types"][i];
      legend.push(<i className={type} key={i} />);
      legend.push(" ");
      legend.push(json["names"][i]);
    }
    return legend;
  }
  state = {
    loading: true,
    currentScreen: "p2",
    currentView: "dailyPurchase",
    P2Data: {},
    PkoData: {},
    PkcData: {},
    P2Accumulated: {},
    pkcAccumulated: {},
    P2AvgProduction: {},
    PkoAvgProduction: {},
    PkcAvgProduction: {},
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    endDate: new Date(),
    P2ApiData: [],
    PkoApiData: [],
    PkcApiData: [],
    currentDateFilter: "currentWeek",
    graphView: "day"
  };

  async componentDidMount() {
    await this.handleSubmit();
  }

  setGraphValues = () => {
    const { P2ApiData, PkoApiData, PkcApiData } = this.state;
    const {
      P2Data,
      P2Accumulated,
      PkoData,
      PkoAccumulated,
      PkcData,
      PkcAccumulated,
      P2AvgProduction,
      PkoAvgProduction,
      PkcAvgProduction
    } = getGraphValues(P2ApiData, PkoApiData, PkcApiData);
    this.setState({
      P2Data,
      P2Accumulated,
      PkoData,
      PkoAccumulated,
      PkcData,
      PkcAccumulated,
      P2AvgProduction,
      PkoAvgProduction,
      PkcAvgProduction,
      loading: false
    });
  };

  setCurrentScreen = e => {
    const currentScreen = e.target.value;
    this.setState({
      currentScreen
    });
  }

  setCurrentView =  e=> {
    const currentView = e.target.value;
    this.setState({
      currentView
    });
  }

  handleStartDateChange = date => {
    if (date > Date.now()) {
      return;
    }
    this.setState({
      startDate: date
    });
  };

  handleEndDateChange = date => {
    if (date > Date.now()) {
      return;
    }
    this.setState({
      endDate: date
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

  handleGraphView = e => {
    const graphView = e.target.value;
    this.setState(
      {
        graphView
      },
      () => this.handleSubmit()
    );
  };

  handleSubmit = async () => {
    const { startDate, endDate, graphView } = this.state;
    this.setState({
      loading: true
    });
    const P2ApiData = (await getP2Inventory(
      startDate.toISOString(),
      endDate.toISOString(),
      graphView
    )).p2Data;
    const PkoApiData = (await getPkoInventory(
      startDate.toISOString(),
      endDate.toISOString(),
      graphView
    )).pkoData;
    const PkcApiData = (await getPkcInventory(
      startDate.toISOString(),
      endDate.toISOString(),
      graphView
    )).pkcData;
    this.setState(
      {
        P2ApiData,
        PkoApiData,
        PkcApiData,
        loading: false
      },
      () => this.setGraphValues()
    );
  };

  render() {
    const {
      P2Data,
      PkoData,
      currentScreen,
      PkcData,
      loading,
      currentView,
      P2Accumulated,
      PkoAccumulated,
      PkcAccumulated,
      P2AvgProduction,
      PkcAvgProduction,
      PkoAvgProduction,
      startDate,
      endDate,
      P2ApiData,
      PkoApiData,
      PkcApiData,
      currentDateFilter,
      graphView
    } = this.state;

    const options = { maintainAspectRatio: true, responsive: true };
    options.tooltips = {
        mode: "label",
        callbacks: {
          label: function(tooltipItem, data) {
            // console.log(`datasets`,data.datasets);
            const key = data.datasets[tooltipItem.datasetIndex].label;
            const yAxis = data.datasets[tooltipItem.datasetIndex].yAxisID;
            const val =
              data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
            if (val && yAxis === "A") return key + ": " +val.toLocaleString() +" tons";
            if (val && yAxis === "B") return key + " : ₦" + val.toLocaleString();
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
          callback: value => value + " tons"
        }
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
          callback: value => "₦" + value.toLocaleString()
        }
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
        {currentDateFilter === "custom" && (
            <span className="custom-date-container">
              <span className="dp-cnt">
                <span className="date-picker-text">From</span>
                <DatePicker
                  selected={startDate}
                  onChange={this.handleStartDateChange}
                />
              </span>
              <span>
                <span className="date-picker-text">To</span>
                <DatePicker
                  selected={endDate}
                  onChange={this.handleEndDateChange}
                />
              </span>
              <span>
                <button className="date-picker-btn" onClick={this.handleSubmit}>
                  Go
                </button>
              </span>
            </span>
          )}
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
                {currentScreen === "pko" && (
                  <Line
                    height={400}
                    width={800}
                    data={PkoData}
                    options={options}
                  />
                )}
                {currentScreen === "p2" && (
                  <Line
                    height={400}
                    width={800}
                    data={P2Data}
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
                {currentScreen === "pko" &&(
                  <Line
                    data={PkoAccumulated}
                    options={options}
                    height={400}
                    width={800}
                  />
                )}
                {currentScreen === "p2" && (
                  <Line
                    data={P2Accumulated}
                    options={options}
                    height={400}
                    width={800}
                  />
                )}
                {currentScreen === "pkc" && (
                  <Line
                    data={PkcAccumulated}
                    options={options}
                    height={400}
                    width={800}
                  />
                )}
              </div>
            )}
            </div>
          }
          // legend={
          //   <div className="legend">{this.createLegend(legendSales)}</div>
          // }
        />
      </Col>
      {/* <Col md={12} lg={12}>
        <Card
          statsIcon="fa fa-history"
          id="chartHours"
          title="Average Crushed Per Hour"
          category="Average Crushed Per Hour Inventory Metrics Breakdown"
          stats="Averaged Crushed Inventory Metrics"
          content={
            <div className="ct-chart" style={{height:"100%",width:"100%"}}>
               {currentScreen === "p2" && <Bar data={P2AvgProduction} />
                }
                {currentScreen === "pko" && <Bar data={PkoAvgProduction} />
                }
                {currentScreen === "pkc" && <Bar data={PkcAvgProduction} />}
            </div>
          }
          // legend={
          //   <div className="legend">{this.createLegend(legendSales)}</div>
          // }
        />
      </Col> */}
    </Row>
  </Grid>
</div>
      </React.Fragment>
      
    );
  }
  
 
}