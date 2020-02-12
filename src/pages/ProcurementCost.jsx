import React, { Component } from "react";
import { Grid, Row, Col } from "react-bootstrap";
import { Card } from "components/Card/Card.jsx";
import { Line, Bar} from "react-chartjs-2";
import Loader from "../common/Loader";
import { getDateFilter } from "../common";
import { graph_A_B_YAxisDatasets } from "../helpers";
import moment from 'moment'

import axios from 'axios'

export default class ProcurementCost extends Component {

  state = {
    baseURL:process.env.REACT_APP_SERVER_ENDPOINT,
    procurement_cost_level:"supply_analysis",
    procurement_cost_data:[],
    
    loading: true,
    startDate: moment().startOf("week").toDate(),
    endDate: moment().endOf("week").toDate(),
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

  // getText = string =>{
  //   if(string === "machine_level") return "Machine Level";
  //   if(string === "maintenance_action_level") return "Maintenance Action Level";
  //   if(string === "factory_level") return "Factory Level";
  //   return "";
  // }

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
    let query = `graphView=${this.getGraphView()}&startDate=${this.getStartDate()}&endDate=${this.getEndDate()}&currency=${this.state.currency}`;
    return query;
  }

  toTitleCase = (str) => str.split(" ").map(item=>item.substring(0,1).toUpperCase()+item.substring(1)).join(" ")


  handleSubmit = async () => {
    try{
      const res_data = await axios.get(`
        ${this.state.baseURL}/v1/supplies/procurement-cost/${this.state.procurement_cost_level}?${this.getRequestQueryParams()}`)
      const {datasets,labels} = res_data.data

      // const result_keys = Object.keys(datasets);
      let datasetAccumulated = {};

      if(this.state.procurement_cost_level === "supply_analysis"){
      
        const total_amount = [];
        const total_quantities = [];
        labels.forEach(supplier => {
          total_amount.push(datasets[supplier].total_amount)
          total_quantities.push(datasets[supplier].total_qty)
        })

        datasetAccumulated = graph_A_B_YAxisDatasets(labels,
          {
            label:`Total Amount Supplied`,
            data:total_amount,
            color:""
          },{
            label:"Total Qty Supplied",
            data:total_quantities,
            color:""
          },
        )
      }
      this.setState(
        {
          accumulatedData:datasetAccumulated
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

  handleProcurementCostLevelChange = e => {
    const procurement_cost_level = e.target.value;
    this.setState(
      {
        procurement_cost_level
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
    const {currency} = this.state;

    const options = { maintainAspectRatio: true, responsive: true,
      tooltips : {
        mode: "label",
        callbacks: {
          label: function(tooltipItem, data) {
            const key = data.datasets[tooltipItem.datasetIndex].label;
            const yAxis = data.datasets[tooltipItem.datasetIndex].yAxisID;
            const val =
              data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
            if (val && yAxis === "B") return key + ": " +val.toLocaleString() +" tons";
            if (val && yAxis === "A") return key + ` : ${currency === "naira" ? "₦":"$"}` + val.toLocaleString();
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
              callback: value => ` ${currency === "naira" ? "₦":"$"} ` + value.toLocaleString(),
              beginAtZero: true,
              stepSize: currency === "naira" ? 15000: 400
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
                  value={this.currency}
                  onChange={this.handleCurrencyChange}
                  className="form-control form-control-lg">
                <option value="naira">Naira</option>
                  <option value="usd">US Dollar</option>
                </select>
              </div>
              {/* <div className="col-md-2 block">
                <select 
                  className="form-control form-control-lg"
                  value={this.state.graphView}
                  onChange={this.handleGraphView}>
                <option value="day">Day</option>
                  <option value="week">Week</option>
                  <option value="month">Month</option>
                </select>
              </div> */}
              <div className="col-md-3 block">
              <select 
                  className="form-control form-control-lg"
                  value={this.state.procurement_cost_level}
                  onChange={this.handleProcurementCostLevelChange}>
                <option value="supply_analysis">Supply Analysis</option>
                  {/* <option value="week">Payment</option>
                  <option value="week">Transportation</option>
                  <option value="month">Offloading</option>
                  <option value="month">Tolls</option> */}
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
                  title={`Supply Analysis`}
                  category={`Procurement Cost Supply Analysis`}
                  stats={`Supply Analysis`}
                  content={
                    <div className="ct-chart" style={{height:"100%",width:"100%"}}>
                      <div>
                      <Bar
                        height={400}
                        width={800}
                        data={this.state.accumulatedData}
                        options={options}
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