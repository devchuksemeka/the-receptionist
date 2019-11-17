import React, { Component } from "react";
import { Grid, Row, Col } from "react-bootstrap";
import { Card } from "components/Card/Card.jsx";
import { 
  // Line, 
  Bar } from "react-chartjs-2";
import Loader from "../common/Loader";
import DatePicker from "react-datepicker";
import { getDateFilter } from "../common";

import axios from 'axios'

export default class Maintenance extends Component {

  state = {
    baseURL:process.env.REACT_APP_SERVER_ENDPOINT,
    maintenance_level_text:"Factory Level",
    maintenance_level:"factory_level",
    maintenance_levels:[
      {key:"factory_level",value:"Factory Level"},
      {key:"machine_level",value:"Machine Level"},
      {key:"maintenance_action_level",value:"Maintenance Action Level"}
    ],
    machine:"all",
    machines:[
      {key:"all",value:"All Machines"},
      {key:"machine_1",value:"Machine 1"},
      {key:"machine_2",value:"Machine 2"},
      {key:"machine_3",value:"Machine 3"},
      {key:"machine_4",value:"Machine 4"},
    ],
    maintenance_action:"all",
    maintenance_actions:[
      {key:"all",value:"All Maintenance Actions"},
      {key:"welded_worms",value:"Welded Worms"},
      {key:"welded_baskets",value:"Welded Baskets"}
    ],
    
    loading: true,
    PkoData: {},
    PkcData: {},
    P2ApiData: {},
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    endDate: new Date(),
    currentDateFilter: "currentWeek",
    graphView: "day",
    accumulatedData: {}
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

  getRandomColor = () =>{
   
      var letters = '0123456789ABCDEF';
      var color = '#';
      for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
  }

  getStartDate = () =>{
    const start_date = this.state.startDate.toISOString();
    // const start_date = '2019-05-05 11:20:12';
    // console.log('state startdate',this.state.startDate)
    return start_date;
  }

  getEndDate = () =>{
    const end_date = this.state.endDate.toISOString();
    // const end_date = '2019-05-10 12:20:12';
    // console.log('state enddate',this.state.endDate)
    return end_date;
  }

  getGraphView = () => {
    let view = this.state.graphView;
    return view
  }

  getRequestQueryParams = () =>{
    let query = `graphView=${this.getGraphView()}&start_date=${this.getStartDate()}&end_date=${this.getEndDate()}`;
    if(this.state.maintenance_level === "machine_level"){
      query = `${query}&machine=${this.state.machine}`
    }
    if(this.state.maintenance_level === "maintenance_action_level"){
      query = `${query}&maintenance_action=${this.state.maintenance_action}`
    }
    return query;
  }

  handleSubmit = async () => {
    try{
      const accumulatedDataResponse = await axios.get(`
        ${this.state.baseURL}/v1/maintenance/filter-query/${this.state.maintenance_level}?${this.getRequestQueryParams()}`)
      const {datasets,machines} = accumulatedDataResponse.data.data

      const result_keys = Object.keys(datasets);
      const datasetAccumulated = [];

      for(let j=0;j<machines.length;j++){
        const dataScore = [];
        for(let i=0;i<result_keys.length;i++){
          dataScore.push(datasets[result_keys[i]][machines[j]])
        }
        const color = this.getRandomColor()
        datasetAccumulated.push({
          label: machines[j],
          stack: "Stack 0",
          fill: false,
          lineTension: 0.1,
          backgroundColor: color,
          borderColor: color,
          borderCapStyle: "butt",
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: "miter",
          pointBorderColor: color,
          pointBackgroundColor: "#fff",
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: color,
          pointHoverBorderColor: color,
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: dataScore
        })

      }
      
      this.setState(
        {
          accumulatedData:{
            labels:result_keys,
            datasets:datasetAccumulated
          }
        },
        ()=>this.setGraphValues()
      )

    }catch(err){
      console.log(err.response)
    }
    
  };

  setGraphValues = () => {

    this.setState({
      loading: false
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

  handleMaintenanceLevelViewChange = e => {
    const maintenance_level = e.target.value;

    this.setState({
      maintenance_level,
      maintenance_level_text:this.getText(maintenance_level)
    },
    ()=> this.handleSubmit()
    );
  };
  
  handleMachineViewChange = e => {
    const machine = e.target.value;
    this.setState(
      {
        machine
      },
      ()=> this.handleSubmit()
    );
  };

  handleMaintenanceViewChange = e => {
    const maintenance_action = e.target.value;
    this.setState(
      {
        maintenance_action
      },
      ()=> this.handleSubmit()
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

    const maintenance_levels_options = this.state.maintenance_levels.map((maintenance_level,index)=>{
      return  <option key={index} value={maintenance_level.key}>{maintenance_level.value}</option>
    });
    
    const machines_options = this.state.machines.map((equipment,index)=>{
      return  <option key={index} value={equipment.key}>{equipment.value}</option>
    });
    

    const maintenance_options = this.state.maintenance_actions.map((maintenance,index)=>{
      return  <option key={index} value={maintenance.key}>{maintenance.value}</option>
    });


    const stackedBarOptions = {
      tooltips: {
        mode: "label",
        callbacks: {
          label: function(tooltipItem, data) {
            const key = data.datasets[tooltipItem.datasetIndex].label;
            const val =
              data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
             
              return `${key}: ${val.toLocaleString()} ${val > 1 ? "Hours":"Hour"}`;
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
              },
              beginAtZero: true,
              stepSize: 1
            }
          }
        ]
      }
    };

    if (this.state.loading) {
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
          value={this.state.currentDateFilter}
          onChange={this.handleDateFilter}>
            <option value="currentWeek">Current Week</option>
            <option value="lastWeek">Last Week</option>
            <option value="last2Weeks">Last 2 Weeks</option>
            <option value="lastMonth">Last Month</option>
            <option value="custom">Custom</option>
        </select>
        {this.state.currentDateFilter === "custom" && (
            <span className="custom-date-container">
              <span className="dp-cnt">
                <span className="date-picker-text">From</span>
                <DatePicker
                  selected={this.state.startDate}
                  onChange={this.handleStartDateChange}
                />
              </span>
              <span>
                <span className="date-picker-text">To</span>
                <DatePicker
                  selected={this.state.endDate}
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
          value={this.state.graphView}
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
          onChange={this.handleMaintenanceLevelViewChange}>{maintenance_levels_options}</select>
      </div>
      {this.state.maintenance_level === "maintenance_action_level"  && (<div className="col-md-3 block">
        <select 
          className="form-control form-control-lg"
          value={this.state.maintenance_action}
          onChange={this.handleMaintenanceViewChange}>{maintenance_options}</select>
      </div>
      )}
      {this.state.maintenance_level === "machine_level"  && (<div className="col-md-3 block">
        <select 
          className="form-control form-control-lg"
          value={this.state.machine}
          onChange={this.handleMachineViewChange}>{machines_options}</select>
      </div>
      )}

    </div>

    <Row>
      <Col md={12} lg={12}>
        <Card
          statsIcon="fa fa-history"
          id="chartHours"
          title={`${this.state.maintenance_level_text}`}
          category={`System Downtime ${this.state.maintenance_level_text}`}
          stats={`${this.state.maintenance_level_text}`}
          content={
            <div className="ct-chart" style={{height:"100%",width:"100%"}}>
              <div>
                <Bar
                    data={this.state.accumulatedData}
                    options={stackedBarOptions}
                    height={400}
                    width={800}
                  />
              </div>
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