import React, { Component } from "react";
import { Grid, Row, Col } from "react-bootstrap";
import { Card } from "components/Card/Card.jsx";
import { 
  // Line, 
  Bar } from "react-chartjs-2";
import Loader from "../common/Loader";
import { getDateFilter } from "../common";
import moment from 'moment'

import axios from 'axios'

export default class Maintenance extends Component {

  state = {
    baseURL:process.env.REACT_APP_SERVER_ENDPOINT,
    maintenance_level_text:"Factory Level",
    maintenance_level:"factory_level",
    maintenance_levels:[
      {key:"factory_level",value:"Factory Level"},
      {key:"factory_level_machine",value:"Factory Level Machine Base"},
      {key:"machine_level",value:"Machine Level"},
      {key:"maintenance_action_level",value:"Maintenance Action Level"}
    ],
    machine:"all",
    machines:[],
    maintenance_action:"all",
    maintenance_actions:[],
    
    loading: true,
    PkoData: {},
    PkcData: {},
    P2ApiData: {},
    startDate: moment().startOf("week").toDate(),
    endDate: moment().endOf("week").toDate(),
    currentDateFilter: "currentWeek",
    graphView: "day",
    accumulatedData: {}
  };

  async componentDidMount() {
    this.getMachines();
    this.getMaintenanceActions();
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
    let query = `graphView=${this.getGraphView()}&start_date=${this.getStartDate()}&end_date=${this.getEndDate()}`;
    if(this.state.maintenance_level === "machine_level"){
      query = `${query}&machine=${this.state.machine}`
    }
    if(this.state.maintenance_level === "maintenance_action_level"){
      query = `${query}&maintenance_action=${this.state.maintenance_action}`
    }
    return query;
  }

  getMaintenanceActions = async ()=>{
    try{
      const maintenance_action_response = await axios.get(`${this.state.baseURL}/v1/maintenance-actions`)
      
      let {data} = maintenance_action_response.data
      data = data.filter(element => element.key);
      data.unshift( {key:"all",value:"All Maintenance Actions"})

      this.setState({
        maintenance_actions:data
      })
    }catch(err){
      console.log(err.response)
    }
  }

  getMachines = async () =>{
    try{
      const machinesResponse = await axios.get(`${this.state.baseURL}/v1/machines`)
      let {data} = machinesResponse.data
      data = data.filter(element => element.key)
      
      data.unshift({key:"all",value:"All Machines"})
      this.setState({
        machines:data
      })
    }catch(err){
      console.log(err.response)
    }
  }

  toTitleCase = (str) => str.split(" ").map(item=>item.substring(0,1).toUpperCase()+item.substring(1)).join(" ")


  handleSubmit = async () => {
    try{
      const accumulatedDataResponse = await axios.get(`
        ${this.state.baseURL}/v1/maintenance/filter-query/${this.state.maintenance_level}?${this.getRequestQueryParams()}`)
      const {datasets,labels} = accumulatedDataResponse.data.data

      const result_keys = Object.keys(datasets);
      const datasetAccumulated = [];

      if(this.state.maintenance_level === "factory_level"){
      
        const downtime = [];
        const utilization = [];
        for(let i=0;i<result_keys.length;i++){
          downtime.push(datasets[result_keys[i]].downtime)
          utilization.push(datasets[result_keys[i]].utilization)
        }
        datasetAccumulated.push(
          {
            label: "Downtime",
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
            data: downtime
          },
          {
            label: "Utilization Rate",
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
            data: utilization
          }
        )
        
      }else{
        for(let j=0;j<labels.length;j++){
          const dataScore = [];
          for(let i=0;i<result_keys.length;i++){
            dataScore.push(datasets[result_keys[i]][labels[j]])
          }
          const color = this.getRandomColor()
          datasetAccumulated.push({
            label: this.toTitleCase(labels[j].replace(/_/g," ")),
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
    const {maintenance_level} = this.state;

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
      maintainAspectRatio: true, responsive: true,
      tooltips: {
        mode: "label",
        callbacks: {
          label: function(tooltipItem, data) {
            const key = data.datasets[tooltipItem.datasetIndex].label;
            const val =
              data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];             
              if(val && maintenance_level === "factory_level") 
                return `${key}: ${val.toLocaleString()}%`;
              else if(val) return `${key}: ${val.toLocaleString()} ${val > 1 ? "Hours":"Hour"}`;
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
                if(value && maintenance_level === "factory_level") {
                  return `${value.toLocaleString()}% `
                }else{
                  if(value <= 1) return `${value.toLocaleString()} hour`
                  return `${value.toLocaleString()} hours `
                }
                
              },
              beginAtZero: true,
              stepSize: 1
            }
          }
        ],
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
      {this.state.maintenance_level === "machine_level"  && (<div className="col-md-3 block">
        <select 
          className="form-control form-control-lg"
          value={this.state.machine}
          onChange={this.handleMachineViewChange}>{machines_options}</select>
      </div>
      )}
      
      {this.state.maintenance_level === "maintenance_action_level"  && (<div className="col-md-3 block">
        <select 
          className="form-control form-control-lg"
          value={this.state.maintenance_action}
          onChange={this.handleMaintenanceViewChange}>{maintenance_options}</select>
      </div>
      )}

    </div>
    <div className="row" style={{marginBottom:"0.5rem"}}>
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
        <div className="col-md-3">
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