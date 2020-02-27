import React, { Component } from "react";
import { Grid, Row, Col } from "react-bootstrap";
import { Card } from "components/Card/Card.jsx";
import Loader from "../common/Loader";
import { CONSTANT } from "../helpers";
import moment from 'moment'

import axios from 'axios'

export default class Users extends Component {

  state = {
    baseURL:process.env.REACT_APP_SERVER_ENDPOINT,
    energy_stats_level:CONSTANT.ENERGY_DIESEL_LITRE_AND_AMOUNT_USAGE,
    machine_raw_material:CONSTANT.MACHINE_P2_RM,
    page_category:CONSTANT.DIESEL_SUPPLY_LOG,
    users:[],
    extra_tooltip_data:{},
    loading: true,
    extras: {},
    startDate: moment().startOf("week").toDate(),
    endDate: moment().endOf("week").toDate(),
    currentDateFilter: "currentWeek",
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
    try{
     
        const res_data = await axios.get(`${this.state.baseURL}/v1/users/list`)
        // ${this.state.baseURL}/v1/users/list?${this.getRequestQueryParams()}`)

        let users = res_data.data.data;
        console.log(res_data)
        
        // console.log(diesel_supply_log_data)
        this.setState({
          users,
        },()=>this.setGraphValues())
      
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


  

  render() {
    const {
      users
    } = this.state;

   

    const users_list = users.map((data,index) => {
      return (
        <tr key={index}>
          <td>{++index}</td>
          {/* <td>{data.role}</td> */}
          <td>{data.email}</td>
          <td>{data.created_at}</td>
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
            <Row>
              <Col md={12} lg={12}>
                <Card
                  statsIcon="fa fa-history"
                  id="chartHours"
                  title={`Users`}
                  category={`Account Users List`}
                  stats={`Account Users List`}
                  content={
                    <div className="ct-chart" style={{height:"100%",width:"100%"}}>
                      <div>
                        <table className="table table-hover">
                          <thead>
                            <tr>
                              <th scope="col">#</th>
                              {/* <th scope="col">Role</th> */}
                              <th scope="col">Email</th>
                              <th scope="col">Date Created</th>
                            </tr>
                          </thead>
                          <tbody>
                            {users_list}
                          </tbody>
                        </table> 
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