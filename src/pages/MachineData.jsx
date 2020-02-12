import React, { Component } from "react";
import { Grid, Row, Col } from "react-bootstrap";
import { Card } from "components/Card/Card.jsx";
import { Line, Bar} from "react-chartjs-2";
import Loader from "../common/Loader";
import { getDateFilter } from "../common";
import { graph_A_B_YAxisDatasets,CONSTANT } from "../helpers";

import axios from 'axios'

export default class MachineData extends Component {

  state = {
    baseURL:process.env.REACT_APP_SERVER_ENDPOINT,
    machine_stats_level:CONSTANT.MACHINE_DATA_RM_CRUSHING,
    machine_raw_material:"p2",
    machine_data:[],
    extra_tooltip_data:{},
    loading: true,
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    endDate: new Date(),
    currentDateFilter: "currentWeek",
    graphView: "day",
    currency: "naira",
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

  getText = string =>{
    if(string === CONSTANT.MACHINE_DATA_MAINTENANCE) return "Maintenance";
    if(string === CONSTANT.MACHINE_DATA_RM_CRUSHING) return "Raw Material Crushing";
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
    let query = `graphView=${this.getGraphView()}&startDate=${this.getStartDate()}&endDate=${this.getEndDate()}&currency=${this.state.currency}&raw_material=${this.state.machine_raw_material}`;
    return query;
  }

  toTitleCase = (str) => str.split(" ").map(item=>item.substring(0,1).toUpperCase()+item.substring(1)).join(" ")


  handleSubmit = async () => {
    let extra_tooltip_data = {};
    try{
      const res_data = await axios.get(`
        ${this.state.baseURL}/v1/supplies/machine-data/${this.state.machine_stats_level}?${this.getRequestQueryParams()}`)
      const {datasets,labels} = res_data.data
      extra_tooltip_data = datasets;

      // const result_keys = Object.keys(datasets);
      let datasetAccumulated = {};

      if(this.state.machine_stats_level === CONSTANT.MACHINE_DATA_RM_CRUSHING){
      
        const total_p2 = [];
        const total_pkc1 = [];
        labels.forEach(date => {
          total_p2.push(datasets[date].P2.rm_crushed_in_ton)
          total_pkc1.push(datasets[date].PKC1.rm_crushed_in_ton)
        })

        datasetAccumulated = graph_A_B_YAxisDatasets(labels,
          {
            label:"PKC1 Crushed",
            data:total_pkc1,
          },
          {
            label:`P2 Crushed`,
            data:total_p2,
          },
        )
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
      this.setState(
        {
          accumulatedData:datasetAccumulated,
          extra_tooltip_data
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

  handleCurrencyChange = e => {
    const currency = e.target.value;
    this.setState(
      {
        currency
      },
      () => this.handleSubmit()
    );
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
    }, ()=> this.handleSubmit()
    );

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
      extra_tooltip_data
    } = this.state;

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
            if (val && yAxis === "B") return key + ": " +val.toLocaleString() +" tons";
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
              callback: value => value + " tons",
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
            return `Equipment: ${extra_tooltip_data[tooltipItem[0].label].equipment}\nTime Of Issue: ${extra_tooltip_data[tooltipItem[0].label].time_of_issue}\nTime Of Completion: ${extra_tooltip_data[tooltipItem[0].label].time_of_completion}\nMaintenance Duration: ${extra_tooltip_data[tooltipItem[0].label].total_maintenance_duration}`;
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

    const options = () =>{
      if(machine_stats_level === "rm_crushing") return rm_crushed_options;
      if(machine_stats_level === CONSTANT.MACHINE_DATA_MAINTENANCE) return maintenance_options;
      return rm_crushed_options;
    }

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
              {/* <div className="col-md-2 block">
                <select 
                  value={machine_raw_material}
                  onChange={this.handleMachineRawMaterialChange}
                  className="form-control form-control-lg">
                <option value="p2">P2</option>
                  <option value="pkc1">PKC1</option>
                </select>
              </div> */}
              {/* <div className="col-md-2 block">
                <select 
                  value={currency}
                  onChange={this.handleCurrencyChange}
                  className="form-control form-control-lg">
                <option value="naira">Naira</option>
                  <option value="usd">US Dollar</option>
                </select>
              </div> */}
              <div className="col-md-3 block">
              <select className="form-control form-control-lg"
                  value={this.state.machine_stats} onChange={this.handleMachineStatsChange}>
                  <option value="rm_crushing">RM Crushing</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
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
                  title={`RM Crushing`}
                  category={`Machine Data RM Crushing`}
                  stats={`RM Crushing`}
                  content={
                    <div className="ct-chart" style={{height:"100%",width:"100%"}}>
                      <div>
                      <Bar
                        height={400}
                        width={800}
                        data={this.state.accumulatedData}
                        options={options()}
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