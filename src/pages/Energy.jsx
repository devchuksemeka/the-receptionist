import React, { Component } from "react";
import { Grid, Row, Col } from "react-bootstrap";
import { Card } from "components/Card/Card.jsx";
import { Bar} from "react-chartjs-2";
import Loader from "../common/Loader";
import { getDateFilter } from "../common";
import { CONSTANT,graph_A_B_YAxisDatasets } from "../helpers";
import moment from 'moment'
import { StatsCard } from "components/StatsCard/StatsCard.jsx";

import axios from 'axios'

export default class Energy extends Component {

  state = {
    baseURL:process.env.REACT_APP_SERVER_ENDPOINT,
    energy_stats_level:CONSTANT.ENERGY_DIESEL_LITRE_AND_AMOUNT_USAGE,
    machine_raw_material:CONSTANT.MACHINE_P2_RM,
    page_category:CONSTANT.ENERGY_ANALYSIS,
    diesel_supply_log_data:[],
    extra_tooltip_data:{},
    loading: true,
    extras: {},
    startDate: moment().startOf("week").toDate(),
    endDate: moment().endOf("week").toDate(),
    currentDateFilter: "currentWeek",
    graphView: "day",
    currency: "naira",
    shift: "1",
    generator: "GEN500",
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

  getText = () =>{
    if(this.state.page_category === CONSTANT.DIESEL_SUPPLY_LOG) return "Diesel Supply Log";
    if(this.state.energy_stats_level === CONSTANT.ENERGY_DIESEL_LITRE_AND_AMOUNT_USAGE) return "Diesel Litre And Amount Usage";
    if(this.state.energy_stats_level === CONSTANT.ENERGY_GENERATOR_MAINTENANCE_ANALYSIS) return "Generator Maintenance";
    // if(this.state.machine_stats_level  === CONSTANT.MACHINE_DATA_RM_CRUSHING) return "Raw Material Crushing";
    // if(this.state.machine_stats_level  === CONSTANT.MACHINE_DATA_UPTIME_AND_DOWNTIME) return "Uptime/Downtime";
    // if(this.state.machine_stats_level  === CONSTANT.MACHINE_DATA_CRUSHING_EFFICIENCY) return "Crushing Efficiency";
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
    let query = `graphView=${this.getGraphView()}&startDate=${this.getStartDate()}&endDate=${this.getEndDate()}&currency=${this.state.currency}&generator=${this.state.generator}`;
    return query;
  }

  toTitleCase = (str) => str.split(" ").map(item=>item.substring(0,1).toUpperCase()+item.substring(1)).join(" ")


  handleSubmit = async () => {
    let extra_tooltip_data = {};
    let extras = {};
    try{
      if(this.state.page_category === CONSTANT.DIESEL_SUPPLY_LOG){
        const res_data = await axios.get(`
        ${this.state.baseURL}/v1/energies/get-diesel-supply-log?${this.getRequestQueryParams()}`)

        let diesel_supply_log_data = res_data.data.data;
        
        // console.log(diesel_supply_log_data)
        this.setState({
          diesel_supply_log_data,
        },()=>this.setGraphValues())
      }
      else{
        const res_data = await axios.get(`
        ${this.state.baseURL}/v1/energies/energy-analysis/${this.state.energy_stats_level}?${this.getRequestQueryParams()}`)
        const {datasets,labels} = res_data.data
        extra_tooltip_data = datasets;
        extras = res_data.data.extras;

        // const result_keys = Object.keys(datasets);
        let datasetAccumulated = {};

        if(this.state.energy_stats_level === CONSTANT.ENERGY_DIESEL_LITRE_AND_AMOUNT_USAGE){
        
          const diesel_litre_used = [];
          const hours_on_gen = [];
          labels.forEach(date => {
            diesel_litre_used.push(datasets[date].diesel_litre_used)
            hours_on_gen.push(datasets[date].hours_on_gen)
          })

          datasetAccumulated = {
            labels,
            datasets: [
              {
                yAxisID: "A",
                label: `Diesel Litre Used`,
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
                data: diesel_litre_used
              },
              // {
              //   yAxisID: "A",
              //   label: `PKC1 Crushed`,
              //   stack: "Stack 0",
              //   fill: false,
              //   lineTension: 0.1,
              //   backgroundColor: "#993fb0",
              //   borderColor: "#ffaa1d",
              //   borderCapStyle: "butt",
              //   borderDash: [],
              //   borderDashOffset: 0.0,
              //   borderJoinStyle: "miter",
              //   pointBorderColor: "#ffaa1d",
              //   pointBackgroundColor: "#fff",
              //   pointBorderWidth: 1,
              //   pointHoverRadius: 5,
              //   pointHoverBackgroundColor: "#ffaa1d",
              //   pointHoverBorderColor: "#ffaa1d",
              //   pointHoverBorderWidth: 2,
              //   pointRadius: 1,
              //   pointHitRadius: 10,
              //   data: total_pkc1
              // },
              {
                yAxisID: "B",
                label: `Hours On Generator`,
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
                data: hours_on_gen
              },
              // {
              //   yAxisID: "B",
              //   label: `PKC1 Uptime`,
              //   stack: "Stack 1",
              //   fill: false,
              //   lineTension: 0.1,
              //   backgroundColor: "#ba4a1a",
              //   borderColor: "#ffaa1d",
              //   borderCapStyle: "butt",
              //   borderDash: [],
              //   borderDashOffset: 0.0,
              //   borderJoinStyle: "miter",
              //   pointBorderColor: "#ffaa1d",
              //   pointBackgroundColor: "#fff",
              //   pointBorderWidth: 1,
              //   pointHoverRadius: 5,
              //   pointHoverBackgroundColor: "#ffaa1d",
              //   pointHoverBorderColor: "#ffaa1d",
              //   pointHoverBorderWidth: 2,
              //   pointRadius: 1,
              //   pointHitRadius: 10,
              //   data: pkc1_uptimes
              // },
            ]
          };
        }
        if(this.state.energy_stats_level === CONSTANT.ENERGY_GENERATOR_MAINTENANCE_ANALYSIS){
          
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
            extra_tooltip_data,
            extras
          },
          ()=>this.setGraphValues()
        )
      }

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

  handleMachineRawMaterialChange = e => {
    const machine_raw_material = e.target.value;

    this.setState({
      machine_raw_material
    },
    ()=> this.handleSubmit()
    );
  }; 
  
  handlePageCategoryChange = e => {
    const page_category = e.target.value;

    this.setState({
      page_category
    },
    ()=> this.handleSubmit()
    );
  };

  handleEnergyStatLevelChange = e => {
    const energy_stats_level = e.target.value;
    this.setState(
      {
        energy_stats_level
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
      energy_stats_level,
      extra_tooltip_data,
      page_category,
      diesel_supply_log_data
    } = this.state;

    const diesel_ltr_amount_usage_options = { 
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
            if (val && yAxis === "A") return key + ": " +val.toLocaleString() + ` ${val > 1 ? 'Litres':"Litre"}`;
            // if (val && yAxis === "A") return key + ` : ${currency === "naira" ? "₦":"$"}` + val.toLocaleString();
          },
          afterBody: function(tooltipItem, d) {
            return `Total P2 Crushed: ${extra_tooltip_data[tooltipItem[0].label].total_p2_crushed} Tons\nTotal PKO Produced: ${extra_tooltip_data[tooltipItem[0].label].total_pko_produced} Tons\nTotal PKC produced: ${extra_tooltip_data[tooltipItem[0].label].total_pkc_produced} Tons`;
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
              callback: value => value + ` ${value > 1 ? 'Litres':"Litre"}`,
              beginAtZero: true,
              stepSize: 50
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

    const generator_maintenance_options = { 
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

    const diesel_supply_log_tbl_row = this.state.diesel_supply_log_data.map((data,index) => {
      return (
        <tr key={index}>
          <td>{++index}</td>
          <td>{data.supplier}</td>
          <td>{data.quantity_in_litre}</td>
          <td>&#8358;{data.price_per_litre}</td>
          <td>&#8358;{data.amount}</td>
          <td>{data.date}</td>
        </tr>
      )
    });

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
                  value={this.state.page_category}
                  onChange={this.handlePageCategoryChange}>
                    <option value={CONSTANT.ENERGY_ANALYSIS}>Energy Analysis</option>
                    <option value={CONSTANT.DIESEL_SUPPLY_LOG}>Diesel Supply Log</option>
                </select>
              </div>
              {page_category === CONSTANT.ENERGY_ANALYSIS && (
                <React.Fragment>
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

                  <div className="col-md-2 block">
                    <select className="form-control form-control-lg"
                      value={this.state.energy_stats_level} onChange={this.handleEnergyStatLevelChange}>
                      <option value={CONSTANT.ENERGY_DIESEL_LITRE_AND_AMOUNT_USAGE}>Diesel Usage</option>
                      <option value={CONSTANT.ENERGY_GENERATOR_MAINTENANCE_ANALYSIS}>Generator Servicing</option>
                    </select>
                  </div>
                </React.Fragment>
              )}
            </div>
            <Row>
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
            </Row>
            <Row>
              {page_category === CONSTANT.ENERGY_ANALYSIS && (
                <React.Fragment>
                  {energy_stats_level === CONSTANT.ENERGY_DIESEL_LITRE_AND_AMOUNT_USAGE && (
                    <>
                    <Col lg={3} sm={6}>
                      <StatsCard
                        bigIcon={<i className="pe-7s-science text-secondary" />}
                        statsText={`Diesel Consumption (Litre)`}
                        statsValue={this.state.extras.total_diesel_used || 0}
                        statsIconText={`Total diesel consumption (Litre)`}
                      />
                    </Col>
                    <Col lg={3} sm={6}>
                      <StatsCard
                        bigIcon={<i className="pe-7s-shield text-info" />}
                        statsText="Hours On Generator"
                        statsValue={this.state.extras.total_hours_on_gen || 0}
                        statsIconText={`Total Hours On Generator`}
                      />
                    </Col>
                    </>
                  )}
                  {energy_stats_level === CONSTANT.ENERGY_GENERATOR_MAINTENANCE_ANALYSIS && (
                    <>
                    <Col lg={3} sm={6}>
                      <StatsCard
                        bigIcon={<i className="pe-7s-science text-secondary" />}
                        statsText={`Maintenance Duration `}
                        statsValue={`${this.state.extras.total_maintenance_duration || ""}`}
                        statsIconText={`Total Maintenance Duration (Hours)`}
                      />
                    </Col>
                    <Col lg={3} sm={6}>
                      <StatsCard
                        bigIcon={<i className="pe-7s-shield text-info" />}
                        statsText="Maintenance Cost"
                        statsValue={this.state.extras.total_maintenance_cost || 0}
                        statsIconText={`Total Maintenance Cost`}
                      />
                    </Col>
                    </>
                  )}
                </React.Fragment>
              )}
            </Row> 

            <Row>
              <Col md={12} lg={12}>
                <Card
                  statsIcon="fa fa-history"
                  id="chartHours"
                  title={this.getText()}
                  category={`Energy Usage: ${this.getText()}`}
                  stats={this.getText()}
                  content={
                    <div className="ct-chart" style={{height:"100%",width:"100%"}}>
                      <div>
                      {page_category !== CONSTANT.DIESEL_SUPPLY_LOG && (
                        <>
                          {energy_stats_level === CONSTANT.ENERGY_DIESEL_LITRE_AND_AMOUNT_USAGE && (
                            <Bar
                              height={400}
                              width={800}
                              data={this.state.accumulatedData}
                              options={diesel_ltr_amount_usage_options}
                            />
                          )}
                          {energy_stats_level === CONSTANT.ENERGY_GENERATOR_MAINTENANCE_ANALYSIS && (
                            <Bar
                              height={400}
                              width={800}
                              data={this.state.accumulatedData}
                              options={generator_maintenance_options}
                            />
                          )}
                        </>
                      )}
                     {page_category === CONSTANT.DIESEL_SUPPLY_LOG && (
                        <table className="table table-hover">
                          <thead>
                            <tr>
                              <th scope="col">#</th>
                              <th scope="col">Supplier</th>
                              <th scope="col">Quantity (Litre)</th>
                              <th scope="col">Price (per Litre) (&#8358;)</th>
                              <th scope="col">Total Amount (&#8358;)</th>
                              <th scope="col">Supply Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {diesel_supply_log_tbl_row}
                          </tbody>
                        </table>  
                      )
                      }
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