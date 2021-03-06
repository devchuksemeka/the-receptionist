import React, { Component } from "react";
import { Grid, Row, Col } from "react-bootstrap";
import { Card } from "components/Card/Card.jsx";
import { Bar} from "react-chartjs-2";
import Loader from "../common/Loader";
import { getDateFilter } from "../common";
import { StatsCard } from "components/StatsCard/StatsCard.jsx";
import { graph_A_B_YAxisDatasets,CONSTANT } from "../helpers";
import moment from 'moment'

import axios from 'axios'


export default class MachineData extends Component {

  state = {
    baseURL:process.env.REACT_APP_SERVER_ENDPOINT,
    machine_stats_level:CONSTANT.MACHINE_DATA_MAINTENANCE,
    machine_raw_material:CONSTANT.MACHINE_ALL_RM,
    machine_health_level:CONSTANT.MACHINE_SERVICE_HEALTH,
    machine_data:[],
    extra_tooltip_data:{},
    extras:{},
    loading: true,
    startDate: moment().startOf("week").toDate(),
    endDate: moment().endOf("week").toDate(),
    currentDateFilter: "currentWeek",
    graphView: "day",
    currency: "naira",
    shift: "0",
    expeller_number: "__ALL__",
  };

  async componentDidMount() {
    // this.getProcurementCost();
    // this.getMaintenanceActions();
    await this.handleSubmit();
  }



  setCurrentScreen = e => {
    const currentScreen = e.target.value;
    this.setState({
      currentScreen
    });
  }

  getText = () =>{
    if(this.state.machine_stats_level === CONSTANT.MACHINE_DATA_MAINTENANCE) return "Maintenance";
    if(this.state.machine_stats_level  === CONSTANT.MACHINE_DATA_RM_CRUSHING) return "Raw Material Crushing";
    if(this.state.machine_stats_level  === CONSTANT.MACHINE_DATA_UPTIME_AND_DOWNTIME) return "Uptime/Downtime";
    if(this.state.machine_stats_level  === CONSTANT.MACHINE_DATA_CRUSHING_EFFICIENCY) return "Crushing Efficiency";
    return "";
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
    let query = `graphView=${this.getGraphView()}&startDate=${this.getStartDate()}&endDate=${this.getEndDate()}&currency=${this.state.currency}&expeller_number=${this.state.expeller_number}&shift=${this.state.shift}&raw_material=${this.state.machine_raw_material}`;
    return query;
  }

  toTitleCase = (str) => str.split(" ").map(item=>item.substring(0,1).toUpperCase()+item.substring(1)).join(" ")


  handleSubmit = async () => {
    let extra_tooltip_data = {};
    let extras = {};
    try{
      const res_data = await axios.get(`
        ${this.state.baseURL}/v1/supplies/machine-data/${this.state.machine_stats_level}?${this.getRequestQueryParams()}`)
      const {datasets,labels} = res_data.data
      extra_tooltip_data = datasets;
      extras = res_data.data.extras;

      // const result_keys = Object.keys(datasets);
      let datasetAccumulated = {};

      if(this.state.machine_stats_level === CONSTANT.MACHINE_DATA_RM_CRUSHING){
      
        const total_p2 = [];
        const total_pkc1 = [];
        const pkc1_uptimes = [];
        const p2_uptimes = [];
        labels.forEach(date => {
          total_p2.push(datasets[date].P2.rm_crushed_in_ton)
          p2_uptimes.push(datasets[date].P2.uptime)
          total_pkc1.push(datasets[date].PKC1.rm_crushed_in_ton)
          pkc1_uptimes.push(datasets[date].PKC1.uptime)
        })

        datasetAccumulated = {
          labels,
          datasets: [
            {
              yAxisID: "A",
              label: `P2 Crushed`,
              stack: "Stack 0",
              fill: false,
              lineTension: 0.1,
              backgroundColor: "#036bfc",
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
              data: total_p2
            },
            {
              yAxisID: "A",
              label: `PKC1 Crushed`,
              stack: "Stack 0",
              fill: false,
              lineTension: 0.1,
              backgroundColor: "#993fb0",
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
              data: total_pkc1
            },
            {
              yAxisID: "B",
              label: `P2 ${this.state.expeller_number === CONSTANT.ALL_MACHINES ? "All Expellers":this.state.expeller_number} Uptime`,
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
              data: p2_uptimes
            },
            {
              yAxisID: "B",
              label: `PKC1 ${this.state.expeller_number === CONSTANT.ALL_MACHINES ? "All Expellers":this.state.expeller_number} Uptime`,
              stack: "Stack 1",
              fill: false,
              lineTension: 0.1,
              backgroundColor: "#ba4a1a",
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
              data: pkc1_uptimes
            },
          ]
        };
      }
      if(this.state.machine_stats_level === CONSTANT.MACHINE_DATA_MAINTENANCE){
      
        const total_maintenance_cost = [];
        const total_maintenance_duration_in_hours = [];
        labels.forEach(date => {
          total_maintenance_cost.push(datasets[date].total_maintenance_cost)
          total_maintenance_duration_in_hours.push(datasets[date].total_maintenance_duration_in_hours)
        })

        datasetAccumulated = graph_A_B_YAxisDatasets(labels,
          {
            label:`Maintenance Hours`,
            data:total_maintenance_duration_in_hours,
          },
          {
            label:"Maintenance Cost",
            data:total_maintenance_cost,
          },
        )
      }
      if(this.state.machine_stats_level === CONSTANT.MACHINE_DATA_UPTIME_AND_DOWNTIME){
      
        const uptime = [];
        const downtime = [];
        labels.forEach(date => {
          downtime.push(datasets[date].downtime)
          uptime.push(datasets[date].uptime)
        })

        datasetAccumulated = graph_A_B_YAxisDatasets(labels,
          {
            label:`${this.state.expeller_number === "__ALL__" ? "All Expellers" : this.state.expeller_number} Uptime`,
            data:uptime,
          },
          {
            label:`${this.state.expeller_number === "__ALL__" ? "All Expellers" : this.state.expeller_number} Downtime`,
            data:downtime,
          },
        )
      }

      if(this.state.machine_stats_level === CONSTANT.MACHINE_DATA_CRUSHING_EFFICIENCY){
      
        const crushing_efficiency = [];
        labels.forEach(date => {
          crushing_efficiency.push(datasets[date].crushing_efficiency)
          // uptime.push(datasets[date].uptime)
        })

        datasetAccumulated = {
          labels,
          datasets: [
            {
              label: `${this.state.expeller_number === "__ALL__" ? "All Expellers" : this.state.expeller_number} Crushing Efficiency`,
              stack: "Stack 0",
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
              data: crushing_efficiency
            }
          ]
        };
      }

      if(this.state.machine_stats_level === CONSTANT.MACHINE_DATA_UTILIZATION){
      
        const utilization_rate = [];
        labels.forEach(date => {
          utilization_rate.push(datasets[date].utilization_rate)
          // uptime.push(datasets[date].uptime)
        })

        datasetAccumulated = {
          labels,
          datasets: [
            {
              label: `${this.state.expeller_number === "__ALL__" ? "All Expellers" : this.state.expeller_number} Utilization Efficiency`,
              stack: "Stack 0",
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
              data: utilization_rate
            }
          ]
        };
      }

      const uptime_and_service_alert = await axios.get(`${this.state.baseURL}/v1/machines/get-uptime-and-service-alert?${this.getRequestQueryParams()}`)
      const machine_health= uptime_and_service_alert.data;
      extras = {
        ...extras,
        ...machine_health
      }

      // console.log(extras)

      this.setState(
        {
          accumulatedData:datasetAccumulated,
          extra_tooltip_data,
          extras
        },
        ()=>this.setGraphValues()
      )

    }catch(err){
      console.log(err)
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
  handleExpellerNumberChange = e => {
    const expeller_number = e.target.value;
    this.setState({
      expeller_number
    },
    () => this.handleSubmit());
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
  handleShiftChange = e => {
    const shift = e.target.value;
    this.setState(
      {
        shift
      },
      () => this.handleSubmit()
    );
  };

  handleEndDateChange = e => {
    let date = e.target.value;
    date = moment(date).endOf("day").toDate()
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
    }, ()=> this.handleSubmit()
    );

  };
  
  handleMachineHealthLevelChange = e => {
    const machine_health_level = e.target.value;

    this.setState({
      machine_health_level,
    });

  };

  handleMachineRawMaterialChange = e => {
    const machine_raw_material = e.target.value;

    this.setState({
      machine_raw_material
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

  getMachineDataUptimeDowntimeLabelName = (expeller_number) =>{
    if(expeller_number === CONSTANT.MACHINE_1) return "Expeller 1";
    if(expeller_number === CONSTANT.MACHINE_2) return "Expeller 2";
    if(expeller_number === CONSTANT.MACHINE_3) return "Expeller 3";
    if(expeller_number === CONSTANT.MACHINE_4) return "Expeller 4";
    if(expeller_number === CONSTANT.ALL_MACHINES) return "All Expellers";
    return "";
  };


  handleMachineStatsChange = e => {
    const machine_stats_level = e.target.value;
    this.setState(
      {
        machine_stats_level
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
    const {
      currency,
      machine_stats_level,
      extra_tooltip_data,
      machine_raw_material,
      expeller_number,
      machine_health_level,
      shift,
      extras
    } = this.state;

  const getProgressiveLabelStatTextColor = (status) => {
    if(status === CONSTANT.MACHINE_HEALTH_GOOD) return "text-success";
    if(status === CONSTANT.MACHINE_HEALTH_OK) return "text-warning";
    if(status === CONSTANT.MACHINE_HEALTH_BAD) return "text-danger";
  }

    const rm_crushed_options = { 
      maintainAspectRatio: true, 
      responsive: true,
      tooltips : {
        mode: "label",
        callbacks: {
          label: function(tooltipItem, data) {
            const key = data.datasets[tooltipItem.datasetIndex].label;
            const yAxis = data.datasets[tooltipItem.datasetIndex].yAxisID;
            const val =
              data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
            // return key + ": " +val.toLocaleString() +" hours";
            if (val && yAxis === "B") return key + ": " +val.toLocaleString() +" hours";
            if (val && yAxis === "A") return key + ": " +val.toLocaleString() +" tons";
            // if (val && yAxis === "A") return key + ` : ${currency === "naira" ? "₦":"$"}` + val.toLocaleString();
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
              callback: value => value +`${value > 1 ? " hours": "  hour"}`,
              beginAtZero: true,
              stepSize: 2
            }
          }
        ]
      }
    };

    const maintenance_options = { 
      maintainAspectRatio: true, 
      responsive: true,
      tooltips : {
        mode: "label",
        callbacks: {
          label: function(tooltipItem, data) {
            const key = data.datasets[tooltipItem.datasetIndex].label;
            const yAxis = data.datasets[tooltipItem.datasetIndex].yAxisID;
            const val = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
            if (val && yAxis === "A") return key + ": " +val.toLocaleString() +" hours";
            if (val && yAxis === "B") return key + ` : ${currency === "naira" ? "₦":"$"}` + val.toLocaleString();
          },

          afterBody: function(tooltipItem, d) {
            return `\nEquipment: ${extra_tooltip_data[tooltipItem[0].label].equipment}\nAction Type: ${extra_tooltip_data[tooltipItem[0].label].maintenance_action}\nReporter: ${extra_tooltip_data[tooltipItem[0].label].reporter}\nAuthor: ${extra_tooltip_data[tooltipItem[0].label].author}\nResponsibility Party: ${extra_tooltip_data[tooltipItem[0].label].responsibilty_party}\n\nTime Of Issue: ${extra_tooltip_data[tooltipItem[0].label].time_of_issue}\nTime Of Completion: ${extra_tooltip_data[tooltipItem[0].label].time_of_completion}\nMaintenance Duration: ${extra_tooltip_data[tooltipItem[0].label].total_maintenance_duration}`;
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
              callback: value => value + " hours",
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
              callback: value => `${currency === "naira" ? "₦":"$"}` + value.toLocaleString(),
              beginAtZero: true,
              stepSize: 5000
            }
          }
        ]
      }
    };

    const uptime_and_downtime_options = { 
      maintainAspectRatio: true, 
      responsive: true,
      tooltips : {
        mode: "label",
        callbacks: {
          label: function(tooltipItem, data) {
            const key = data.datasets[tooltipItem.datasetIndex].label;
            const yAxis = data.datasets[tooltipItem.datasetIndex].yAxisID;
            const val =
              data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
            if (val && yAxis === "B") return key + ": " +val.toLocaleString() +" hours";
            if (val && yAxis === "A") return key + ": " +val.toLocaleString() +" hours";
            // if (val && yAxis === "A") return key + ` : ${currency === "naira" ? "₦":"$"}` + val.toLocaleString();
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
              callback: value => value + " hours",
              beginAtZero: true,
              stepSize: 2
            }
          },
          {
            type: "linear",
            display: false,
            position: "right",
            id: "B",
            scaleLabel: {
              display: true,
              labelString: ""
            },
            ticks: {
              callback: value => value + " hours",
              beginAtZero: true,
              stepSize: 2
            }
          }
        ]
      }
    };

    const crushed_efficiency_options = { 
      maintainAspectRatio: true, 
      responsive: true,
      tooltips : {
        mode: "label",
        callbacks: {
          label: function(tooltipItem, data) {
            const key = data.datasets[tooltipItem.datasetIndex].label;
            const val =
              data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
            if (val) return key + ": " +val.toLocaleString() +"%";
           },
           afterBody: function(tooltipItem, d) {
            
            return `Expeller: ${expeller_number === "__ALL__" ? "All Expellers" :extra_tooltip_data[tooltipItem[0].label].expeller_number}\nRaw Material: ${extra_tooltip_data[tooltipItem[0].label].raw_material}\nShift: ${shift === "0" ? "All Shifts" :extra_tooltip_data[tooltipItem[0].label].shift}`;
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
              callback: value => value + "%",
              beginAtZero: true,
              stepSize: 2
            }
          },
          {
            type: "linear",
            display: false,
            position: "right",
            id: "B",
            scaleLabel: {
              display: true,
              labelString: ""
            },
            ticks: {
              callback: value => value + "%",
              beginAtZero: true,
              stepSize: 2
            }
          }
        ]
      }
    };

    const utilization_options = { 
      maintainAspectRatio: true, 
      responsive: true,
      tooltips : {
        mode: "label",
        callbacks: {
          label: function(tooltipItem, data) {
            const key = data.datasets[tooltipItem.datasetIndex].label;
            const val =
              data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
            if (val) return key + ": " +val.toLocaleString() +"%";
           },
           afterBody: function(tooltipItem, d) {
            return `Expeller: ${expeller_number === "__ALL__" ? "All Expellers" :extra_tooltip_data[tooltipItem[0].label].expeller_number}\nRaw Material: ${extra_tooltip_data[tooltipItem[0].label].raw_material}\nShift: ${shift === "0" ? "All Shifts" :extra_tooltip_data[tooltipItem[0].label].shift}`;
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
              callback: value => value + "%",
              beginAtZero: true,
              stepSize: 2
            }
          },
          {
            type: "linear",
            display: false,
            position: "right",
            id: "B",
            scaleLabel: {
              display: true,
              labelString: ""
            },
            ticks: {
              callback: value => value + "%",
              beginAtZero: true,
              stepSize: 2
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
              <div className="col-md-2 block">
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
              {/* <div className="col-md-2 block">
                <select 
                  value={currency}
                  onChange={this.handleCurrencyChange}
                  className="form-control form-control-lg">
                <option value="naira">Naira</option>
                  <option value="usd">US Dollar</option>
                </select>
              </div> */}
              
              <div className="col-md-2 block">
              <select className="form-control form-control-lg"
                  value={this.state.machine_stats_level} onChange={this.handleMachineStatsChange}>
                  <option value="rm_crushing">RM Crushing</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="uptime_and_downtime">Uptime/Downtime</option>
                  <option value={CONSTANT.MACHINE_DATA_CRUSHING_EFFICIENCY}>Crushing Efficiency</option>
                  <option value={CONSTANT.MACHINE_DATA_UTILIZATION}>Utilization Rate</option>
                </select>
              </div>
              {machine_stats_level === CONSTANT.MACHINE_DATA_MAINTENANCE && (
                <div className="col-md-2 block">
                <select className="form-control form-control-lg"
                  value={this.state.machine_health_level} onChange={this.handleMachineHealthLevelChange}
                  >
                  <option value={CONSTANT.MACHINE_SERVICE_HEALTH}>Machine Service Health</option>
                  <option value={CONSTANT.MACHINE_OVERHAUL_HEALTH}>Machine Overhaul Health</option>
                </select>
              </div>
              )}
              <div className="col-md-2 block">
                <select 
                  className="form-control form-control-lg"
                  value={this.state.expeller_number}
                  onChange={this.handleExpellerNumberChange}>
                  <option value={CONSTANT.ALL_MACHINES}>All Expellers</option>
                  <option value={CONSTANT.MACHINE_1}>Expeller 1</option>
                  <option value={CONSTANT.MACHINE_2}>Expeller 2</option>
                  <option value={CONSTANT.MACHINE_3}>Expeller 3</option>
                  <option value={CONSTANT.MACHINE_4}>Expeller 4</option>
                </select>
              </div>
              {(this.state.machine_stats_level === CONSTANT.MACHINE_DATA_UPTIME_AND_DOWNTIME || 
                this.state.machine_stats_level === CONSTANT.MACHINE_DATA_CRUSHING_EFFICIENCY  || 
                this.state.machine_stats_level === CONSTANT.MACHINE_DATA_UTILIZATION) &&(
                <React.Fragment>
                  <div className="col-md-2 block">
                    <select 
                      className="form-control form-control-lg"
                      value={this.state.shift}
                      onChange={this.handleShiftChange}>
                      <option value="0">All Shifts</option>
                      <option value="1">Shift 1</option>
                      <option value="2">Shift 2</option>
                    </select>
                  </div>
                </React.Fragment>
              )}
              {(this.state.machine_stats_level === CONSTANT.MACHINE_DATA_CRUSHING_EFFICIENCY || this.state.machine_stats_level === CONSTANT.MACHINE_DATA_UTILIZATION) &&(
                <React.Fragment>
                  <div className="col-md-2 block">
                  <select 
                    value={machine_raw_material}
                    onChange={this.handleMachineRawMaterialChange}
                    className="form-control form-control-lg">
                  <option value={CONSTANT.MACHINE_ALL_RM}>All RM</option>
                  <option value={CONSTANT.MACHINE_P2_RM}>P2</option>
                  <option value={CONSTANT.MACHINE_PKC1_RM}>PKC1</option>
                </select>
              </div>
                </React.Fragment>
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
            {machine_stats_level === CONSTANT.MACHINE_DATA_RM_CRUSHING && (
              <>
               {(expeller_number === CONSTANT.ALL_MACHINES)  && (
                  <Col lg={3} sm={6}>
                    <StatsCard
                      bigIcon={<i className="pe-7s-tools text-primary" />}
                      statsText={`All Expeller Crushing Time`}
                      statsValue={extras.expeller_rm_crush_duration || 0}
                      statsIconText={`All Expeller RM Crushed: ${ extras.expeller_rm_crush_qty|| 0}Ton `}
                    />
                  </Col>
                )}
                {(expeller_number === CONSTANT.MACHINE_1)  && (
                  <Col lg={3} sm={6}>
                    <StatsCard
                      bigIcon={<i className="pe-7s-tools text-primary" />}
                      statsText={`Expeller 1 Crushing Time`}
                      statsValue={extras.expeller_rm_crush_duration || 0}
                      statsIconText={`Expeller 1 RM Crushed: ${ extras.expeller_rm_crush_qty|| 0}Ton `}
                    />
                  </Col>
                )}
                {(expeller_number === CONSTANT.MACHINE_2)  && (
                  <Col lg={3} sm={6}>
                    <StatsCard
                      bigIcon={<i className="pe-7s-tools text-primary" />}
                      statsText={`Expeller 2 Crushing Time`}
                      statsValue={extras.expeller_rm_crush_duration || 0}
                      statsIconText={`Expeller 2 RM Crushed: ${ extras.expeller_rm_crush_qty|| 0}Ton `}
                    />
                  </Col>
                )}
                {(expeller_number === CONSTANT.MACHINE_3)  && (
                  <Col lg={3} sm={6}>
                    <StatsCard
                      bigIcon={<i className="pe-7s-tools text-primary" />}
                      statsText={`Expeller 3 Crushing Time`}
                      statsValue={extras.expeller_rm_crush_duration || 0}
                      statsIconText={`Expeller 3 RM Crushed: ${ extras.expeller_rm_crush_qty|| 0}Ton `}
                    />
                  </Col>
                )}
                {(expeller_number === CONSTANT.MACHINE_4)  && (
                  <Col lg={3} sm={6}>
                    <StatsCard
                      bigIcon={<i className="pe-7s-tools text-primary" />}
                      statsText={`Expeller 4 Crushing Time`}
                      statsValue={extras.expeller_rm_crush_duration || 0}
                      statsIconText={`Expeller 4 RM Crushed: ${ extras.expeller_rm_crush_qty|| 0}Ton `}
                    />
                  </Col>
                )}
              </>
            )}
            {machine_stats_level === CONSTANT.MACHINE_DATA_MAINTENANCE && (
              <>
              {machine_health_level === CONSTANT.MACHINE_SERVICE_HEALTH && (
              <React.Fragment>
                {(expeller_number === CONSTANT.ALL_MACHINES  || expeller_number === CONSTANT.MACHINE_1)  && (
                <Col lg={3} sm={6}>
                  <StatsCard
                    bigIcon={<i className={`pe-7s-tools ${getProgressiveLabelStatTextColor(extras.machine_1.service.health.status)}`} />}
                    statsText={`EX 1 Hours Before Service`}
                    statsValue={<span className={getProgressiveLabelStatTextColor(extras.machine_1.service.health.status)} >{extras.machine_1.service.health.hours_before || 0}</span>}
                    statsIconText={`${extras.machine_1.service.health.status_text} `}
                  />
                </Col>
                )}
            {(expeller_number === CONSTANT.ALL_MACHINES  || expeller_number === CONSTANT.MACHINE_2)  && (
              <Col lg={3} sm={6}>
                <StatsCard
                  bigIcon={<i className={`pe-7s-tools ${getProgressiveLabelStatTextColor(extras.machine_2.service.health.status)}`} />}
                  statsText={`EX 2 Hours Before Service`}
                  statsValue={<span className={getProgressiveLabelStatTextColor(extras.machine_2.service.health.status)} >{extras.machine_2.service.health.hours_before || 0}</span>}
                  statsIconText={`${extras.machine_2.service.health.status_text} `}
                />
              </Col>)}
  
            {(expeller_number === CONSTANT.ALL_MACHINES  || expeller_number === CONSTANT.MACHINE_3)  && (
              <Col lg={3} sm={6}>
                <StatsCard
                  bigIcon={<i className={`pe-7s-tools ${getProgressiveLabelStatTextColor(extras.machine_3.service.health.status)}`} />}
                  statsText={`EX 3 Hours Before Service`}
                  statsValue={<span className={getProgressiveLabelStatTextColor(extras.machine_3.service.health.status)} >{extras.machine_3.service.health.hours_before || 0}</span>}
                  statsIconText={`${extras.machine_3.service.health.status_text} `}
                />
              </Col>)}
            {(expeller_number === CONSTANT.ALL_MACHINES  || expeller_number === CONSTANT.MACHINE_4)  && (
              <Col lg={3} sm={6}>
                <StatsCard
                  bigIcon={<i className={`pe-7s-tools ${getProgressiveLabelStatTextColor(extras.machine_4.service.health.status)}`} />}
                  statsText={`EX 4 Hours Before Service`}
                  statsValue={<span className={getProgressiveLabelStatTextColor(extras.machine_4.service.health.status)} >{extras.machine_4.service.health.hours_before || 0}</span>}
                  statsIconText={`${extras.machine_4.service.health.status_text} `}
                />
              </Col>)}
              </React.Fragment>
            )}
            {machine_health_level === CONSTANT.MACHINE_OVERHAUL_HEALTH && (
              <React.Fragment>
                {(expeller_number === CONSTANT.ALL_MACHINES  || expeller_number === CONSTANT.MACHINE_1)  && (
                <Col lg={3} sm={6}>
                  <StatsCard
                    bigIcon={<i className={`pe-7s-tools ${getProgressiveLabelStatTextColor(extras.machine_1.overhaul.health.status)}`} />}
                    statsText={`EX 1 Hours Before Overhaul`}
                    statsValue={<span className={getProgressiveLabelStatTextColor(extras.machine_1.overhaul.health.status)} >{extras.machine_1.overhaul.health.hours_before || 0}</span>}
                    statsIconText={`${extras.machine_1.overhaul.health.status_text} `}
                 />
                </Col>
                )}
            {(expeller_number === CONSTANT.ALL_MACHINES  || expeller_number === CONSTANT.MACHINE_2)  && (
              <Col lg={3} sm={6}>
                <StatsCard
                  bigIcon={<i className={`pe-7s-tools ${getProgressiveLabelStatTextColor(extras.machine_2.overhaul.health.status)}`} />}
                  statsText={`EX 2 Hours Before Overhaul`}
                  statsValue={<span className={getProgressiveLabelStatTextColor(extras.machine_2.overhaul.health.status)} >{extras.machine_2.overhaul.health.hours_before || 0}</span>}
                    statsIconText={`${extras.machine_2.overhaul.health.status_text} `}
                />
              </Col>)}
  
            {(expeller_number === CONSTANT.ALL_MACHINES  || expeller_number === CONSTANT.MACHINE_3)  && (
              <Col lg={3} sm={6}>
                <StatsCard
                  bigIcon={<i className={`pe-7s-tools ${getProgressiveLabelStatTextColor(extras.machine_3.overhaul.health.status)}`} />}
                  statsText={`EX 3 Hours Before Overhaul`}
                  statsValue={<span className={getProgressiveLabelStatTextColor(extras.machine_3.overhaul.health.status)} >{extras.machine_3.overhaul.health.hours_before || 0}</span>}
                  statsIconText={`${extras.machine_3.overhaul.health.status_text} `}
                />
              </Col>)}
            {(expeller_number === CONSTANT.ALL_MACHINES  || expeller_number === CONSTANT.MACHINE_4)  && (
              <Col lg={3} sm={6}>
                <StatsCard
                  bigIcon={<i className={`pe-7s-tools ${getProgressiveLabelStatTextColor(extras.machine_4.overhaul.health.status)}`} />}
                  statsText={`EX 4 Hours Before Overhaul`}
                  statsValue={<span className={getProgressiveLabelStatTextColor(extras.machine_4.overhaul.health.status)} >{extras.machine_4.overhaul.health.hours_before || 0}</span>}
                  statsIconText={`${extras.machine_4.overhaul.health.status_text} `}
                />
              </Col>)}
              </React.Fragment>
            )}
              </>
            )}
            {machine_stats_level === CONSTANT.MACHINE_DATA_UPTIME_AND_DOWNTIME && (
              <>
                <Col lg={3} sm={6}>
                  <StatsCard
                      bigIcon={<i className="pe-7s-tools text-success" />}
                      statsText={`${this.getMachineDataUptimeDowntimeLabelName(expeller_number)} UpTime`}
                      statsValue={extras.expeller_uptime_duration || "0 Hour"}
                      statsIconText={`${this.getMachineDataUptimeDowntimeLabelName(expeller_number)} Uptime`}
                    />
                </Col>
                <Col lg={3} sm={6}>
                  <StatsCard
                    bigIcon={<i className="pe-7s-tools text-danger" />}
                    statsText={`${this.getMachineDataUptimeDowntimeLabelName(expeller_number)} DownTime`}
                    statsValue={extras.expeller_downtime_duration || "0 Hour"}
                    statsIconText={`${this.getMachineDataUptimeDowntimeLabelName(expeller_number)} DownTime`}
                  />
                </Col>
              </>
            )}
            {machine_stats_level === CONSTANT.MACHINE_DATA_CRUSHING_EFFICIENCY && (
              <>
                <Col lg={3} sm={6}>
                  <StatsCard
                      bigIcon={<i className="pe-7s-tools text-success" />}
                      statsText={`${this.getMachineDataUptimeDowntimeLabelName(expeller_number)} Avg Efficiency`}
                      statsValue={`${extras.avg_expeller_efficiency || 0}%`}
                      statsIconText={`${this.getMachineDataUptimeDowntimeLabelName(expeller_number)} Avg Total Efficiency`}
                    />
                </Col>
              </>
            )}
            {machine_stats_level === CONSTANT.MACHINE_DATA_UTILIZATION && (
              <>
                <Col lg={3} sm={6}>
                  <StatsCard
                      bigIcon={<i className="pe-7s-tools text-success" />}
                      statsText={`${this.getMachineDataUptimeDowntimeLabelName(expeller_number)} Avg Utilization`}
                      statsValue={`${extras.avg_utilization_rate || 0}%`}
                      statsIconText={`${this.getMachineDataUptimeDowntimeLabelName(expeller_number)} Avg Total Utilization`}
                    />
                </Col>
              </>
            )}
            <Row>
              <Col md={12} lg={12}>
                <Card
                  statsIcon="fa fa-history"
                  id="chartHours"
                  title={this.getText()}
                  category={`Machine Data ${this.getText()}`}
                  stats={this.getText()}
                  content={
                    <div className="ct-chart" style={{height:"100%",width:"100%"}}>
                      <div>
                      {machine_stats_level === CONSTANT.MACHINE_DATA_RM_CRUSHING && (
                        <Bar
                        height={400}
                        width={800}
                        data={this.state.accumulatedData}
                        options={rm_crushed_options}
                      />
                      )}
                      {machine_stats_level === CONSTANT.MACHINE_DATA_MAINTENANCE && (
                        <Bar
                        height={400}
                        width={800}
                        data={this.state.accumulatedData}
                        options={maintenance_options}
                      />
                      )}
                      {machine_stats_level === CONSTANT.MACHINE_DATA_UPTIME_AND_DOWNTIME && (
                        <Bar
                        height={400}
                        width={800}
                        data={this.state.accumulatedData}
                        options={uptime_and_downtime_options}
                      />
                      )}
                      {machine_stats_level === CONSTANT.MACHINE_DATA_CRUSHING_EFFICIENCY && (
                        <Bar
                        height={400}
                        width={800}
                        data={this.state.accumulatedData}
                        options={crushed_efficiency_options}
                      />
                      )}
                      {machine_stats_level === CONSTANT.MACHINE_DATA_UTILIZATION && (
                        <Bar
                        height={400}
                        width={800}
                        data={this.state.accumulatedData}
                        options={utilization_options}
                      />
                      )}
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