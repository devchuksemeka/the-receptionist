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

  getText = () =>{
    if(this.state.page_category === CONSTANT.DIESEL_SUPPLY_LOG) return "Diesel Supply Log";
    if(this.state.energy_stats_level === CONSTANT.ENERGY_DIESEL_LITRE_AND_AMOUNT_USAGE) return "Diesel Litre And Amount Usage";
    if(this.state.energy_stats_level === CONSTANT.ENERGY_GENERATOR_MAINTENANCE_ANALYSIS) return "Generator Maintenance";
    // if(this.state.machine_stats_level  === CONSTANT.MACHINE_DATA_RM_CRUSHING) return "Raw Material Crushing";
    // if(this.state.machine_stats_level  === CONSTANT.MACHINE_DATA_UPTIME_AND_DOWNTIME) return "Uptime/Downtime";
    // if(this.state.machine_stats_level  === CONSTANT.MACHINE_DATA_CRUSHING_EFFICIENCY) return "Crushing Efficiency";
    return "";
  }

  getRequestQueryParams = () =>{
    let query = `graphView=${this.getGraphView()}&startDate=${this.getStartDate()}&endDate=${this.getEndDate()}&currency=${this.state.currency}&generator=${this.state.generator}`;
    return query;
  }

  toTitleCase = (str) => str.split(" ").map(item=>item.substring(0,1).toUpperCase()+item.substring(1)).join(" ")

  approveUserHandler = async (data) =>{
    const confirm_status = window.confirm("You are about to approve user.\nDo you want to continue")
    if(confirm_status){
      try{
        this.setState({
          loading:true
        })
        // const res_data = await axios.put(`${this.state.baseURL}/v1/users/update-account-approval/${data._id}`,{
        //   status:"APPROVED"
        // })
        await axios.put(`${this.state.baseURL}/v1/users/update-account-approval/${data._id}`,{
          status:"APPROVED"
        })

        this.setState({
          loading:false
        },()=>{
          alert("Approved successfully")
        })
      }catch(err){
        console.log(err)
      }
    }else{
      alert("Cancelled");
    }
    
  };

  disapproveUserHandler = async (data) =>{
    const confirm_status = window.confirm("You are about to disapprove user.\nDo you want to continue")
    if(confirm_status){
      try{
        this.setState({
          loading:true
        })
        // const res_data = await axios.put(`${this.state.baseURL}/v1/users/update-account-approval/${data._id}`,{
        //   status:"DISAPPROVED"
        // })
        await axios.put(`${this.state.baseURL}/v1/users/update-account-approval/${data._id}`,{
          status:"DISAPPROVED"
        })

        this.setState({
          // users,
          loading:false
        })
      }catch(err){
        console.log(err)
      }
    }else{
      alert("Cancelled");
    }
    
  }

  handleSubmit = async () => {
    try{
     
        const res_data = await axios.get(`${this.state.baseURL}/v1/users/list`)

        let users = res_data.data.data;
        console.log(res_data)
        
        // console.log(diesel_supply_log_data)
        this.setState({
          users,
          loading:false
        })
      
    }catch(err){
      console.log(err)
    }
    
  };

  render() {
    const {
      users
    } = this.state;

    const users_list = users.map((data,index) => {
      return (
        <tr key={index}>
          <td>{++index}</td>
          <td>{data.email}</td>
          <td>{data.role}</td>
          <td>{data.approval_status}</td>
          <td>{data.created_at}</td>
          <td>
            <div className="row">
              {data.approval_status !== "APPROVED" && (
                <div className="col-md-4">
                  <button className="btn btn-success btn-sm" onClick={() => this.approveUserHandler(data)}>Approve</button>
                </div>
              )}
              {data.approval_status !== "DISAPPROVED" && (
                <div className="col-md-4">
                  <button className="btn btn-warning btn-sm" onClick={() => this.disapproveUserHandler(data)}>Disapprove</button>
                </div>
              )}
              
              
            </div>
          </td>
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
                              <th scope="col">Email</th>
                              <th scope="col">Role</th>
                              <th scope="col">Approval Status</th>
                              <th scope="col">Date Created</th>
                              <th scope="col">Actions</th>
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