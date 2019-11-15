import React, { Component } from "react";
import { Grid, Row, Col } from "react-bootstrap";
import { Card } from "components/Card/Card.jsx";
import { Line, Bar } from "react-chartjs-2";
import Loader from "../common/Loader";
import DatePicker from "react-datepicker";
import { getDateFilter } from "../common";
import { getChartData } from "../helpers/SalesHelper";
import {
  getP2Inventory,
  getPkoInventory,
  getPkcInventory
} from "../actions/sheetActions";
import {
  legendSales
} from "variables/Variables.jsx";

export default class Maintenance extends Component {
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
    maintenance_level_text:"Factory Level",
    maintenance_level:"factory_level",
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
    salesCyclesAvg: "N/A"
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

  getText = string =>{
    if(string === "machine_level") return "Machine Level";
    if(string === "maintenance_action_level") return "Maintenance Action Level";
    if(string === "factory_level") return "Factory Level";
    return "";
  }

  maintenanceLevel = e => {
    const maintenance_level = e.target.value;
    this.setState({
      maintenance_level,
      maintenance_level_text:this.getText(maintenance_level)
    });
  }

  handleSubmit = async () => {
    const { startDate, endDate, graphView } = this.state;
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

    const P2ApiData = (await getP2Inventory(
      startDate.toISOString(),
      endDate.toISOString(),
      graphView
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

  render() {
    const {
      PkoData,
      currentScreen,
      PkcData,
      loading,
      currentView,
      startDate,
      endDate,
      accumulatedData,
      PkoApiData,
      PkcApiData,
      currentDateFilter,
      graphView,
      salesCyclesAvg
    } = this.state;

    const stackedBarOptions = {
      tooltips: {
        mode: "label",
        callbacks: {
          label: function(tooltipItem, data) {
            const key = data.datasets[tooltipItem.datasetIndex].label;
            const val =
              data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
            if (val) return key + " : ₦" + val.toLocaleString();
          }
        }
      },
      scales: {
        xAxes: [
          {
            stacked: true,
            ticks: {
              callback: value => value.toLocaleString()
            }
          }
        ],
        yAxes: [
          {
            stacked: true,
            ticks: {
              callback: value => {
                if(value <= 1) return `${value.toLocaleString()} hour`
                return `${value.toLocaleString()} hours `
              }
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
          value={graphView}
          onChange={this.handleGraphView}>
         <option value="day">Day</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
        </select>
      </div>
      <div className="col-md-3 block">
        <select 
          className="form-control form-control-lg"
          value={this.maintenance_level}
          onChange={this.maintenanceLevel}>
         <option value="factory_level">Factory Level</option>
          <option value="machine_level">Machine Level</option>
          <option value="maintenance_action_level">Maintenance Action Level</option>
        </select>
      </div>

    </div>

    <Row>
      <Col md={12} lg={12}>
        <Card
          statsIcon="fa fa-history"
          id="chartHours"
          title={`${this.state.maintenance_level_text} Metrics`}
          category={`System Downtime ${this.state.maintenance_level_text} Metrics`}
          stats="Sales Metrics"
          content={
            <div className="ct-chart" style={{height:"100%",width:"100%"}}>
              <div>
                <Bar
                    data={accumulatedData}
                    options={stackedBarOptions}
                    height={400}
                    width={800}
                  />
              </div>
            </div>
          }
          legend={
            <div className="legend">{this.createLegend(legendSales)}</div>
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