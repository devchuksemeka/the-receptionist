import React, { Component } from "react";
import { Line } from "react-chartjs-2";
import { Grid, 
  Row, 
  Col 
} from "react-bootstrap";

import { Card } from "components/Card/Card.jsx";
import { StatsCard } from "components/StatsCard/StatsCard.jsx";

class Overview extends Component {
  state = {
    loading: true,
    currentScreen: "pko",
    currentView: "dailySales",
    revenue_data: {
      labels: ["Nov 1st","Nov 2nd","Nov 3rd","Nov 4th","Nov 5th","Nov 6th"],
      datasets: [
        {
          yAxisID: "A",
          label: "Accumulated Daily Revenue",
          fill: false,
          lineTension: 0.1,
          backgroundColor: "rgba(75,192,192,0.4)",
          borderColor: "rgba(75,192,192,1)",
          borderCapStyle: "butt",
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: "miter",
          pointBorderColor: "rgba(75,192,192,1)",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgba(75,192,192,1)",
          pointHoverBorderColor: "rgba(220,220,220,1)",
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: [10000,25000,27000,35000,48000,69000]
        }
      ]
    },
    
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    endDate: new Date(),
    currentDateFilter: "currentWeek",
    graphView: "day",
    salesCyclesAvg: "N/A",
    currency: "naira",
  };

  render() {

    const options = { maintainAspectRatio: true, responsive: true,
      tooltips : {
        mode: "label",
        callbacks: {
          label: function(tooltipItem, data) {
            const key = data.datasets[tooltipItem.datasetIndex].label;
            const yAxis = data.datasets[tooltipItem.datasetIndex].yAxisID;
            const val =
              data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
            if (val && yAxis === "A") return key + ": " +val.toLocaleString() +" tons";
            if (val && yAxis === "B") return key + ` :  ₦` + val.toLocaleString();
            // if (val && yAxis === "B") return key + ` : ${currency === "naira" ? "₦":"$"}` + val.toLocaleString();
          }
        }
      },
      scales:{
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
              callback: value => ` ₦ ` + value.toLocaleString()
              // callback: value => ` ${currency === "naira" ? "₦":"$"} ` + value.toLocaleString()
            }
          }
        ]
      }
    };
    return (
      <div className="content">
        <Grid fluid>
          <Row>
            <Col lg={3} sm={6}>
              <StatsCard
                bigIcon={<i className="pe-7s-server text-warning" />}
                statsText="Utilization Rate"
                statsValue="68%"
                statsIcon={<i className="pe-7s-server" />}
                statsIconText="Utilization Rate"
              />
            </Col>
            <Col lg={3} sm={6}>
              <StatsCard
                bigIcon={<i className="pe-7s-graph1 text-danger" />}
                statsText="Downtime"
                statsValue="8%"
                statsIcon={<i className="fa fa-clock-o" />}
                statsIconText="In the last hour"
              />
            </Col>
            <Col lg={3} sm={6}>
              <StatsCard
                bigIcon={<i className="pe-7s-note2 text-info" />}
                statsText="Groos Margin"
                statsValue="53%"
                statsIcon={<i className="fa fa-refresh" />}
                statsIconText="Updated now"
              />
            </Col>
            <Col lg={3} sm={6}>
              <StatsCard
                bigIcon={<i className="pe-7s-wallet text-success" />}
                statsText="Total Revenue"
                statsValue="₦95,450"
                statsIcon={<i className="fa fa-calendar-o" />}
                statsIconText="Last day"
              />
            </Col>
          </Row>
          <Row>
            <Col md={9}>
              <Card
                statsIcon="fa fa-history"
                id="chartHours"
                title="Revenue"
                category="Accumulated Revenue"
                stats="Revenue Chart"
                content={
                  <div className="ct-chart" style={{height:"100%",width:"100%"}}>
                    <Line
                      height={400}
                      width={800}
                      data={this.state.revenue_data}
                      options={options}
                    />
                  </div>
                }
              />
            </Col>
            <Col md={3}>
            <Row>
              <Col lg={12} sm={12} >
                <StatsCard
                  bigIcon={<i className="pe-7s-attention text-warning" />}
                  statsText="P2 (Tons)"
                  statsValue="2199"
                  statsIcon={<i className="pe-7s-server" />}
                  statsIconText="P2 All time purchase (ATP)"
                />
              </Col>
              <Col lg={12} sm={12}>
                <StatsCard
                  bigIcon={<i className="pe-7s-star text-danger" />}
                  statsText="PKC (Tons)"
                  statsValue="1200"
                  statsIcon={<i className="fa fa-clock-o" />}
                  statsIconText="PKC All time Sale (ATS)"
                />
              </Col>
              <Col lg={12} sm={12}>
                <StatsCard
                  bigIcon={<i className="pe-7s-paper-plane text-info" />}
                  statsText="PKO (Tons)"
                  statsValue="999"
                  statsIcon={<i className="fa fa-refresh" />}
                  statsIconText="PKO All time sale (ATS)"
                />
              </Col>
            </Row>
            </Col>
          </Row>

          {/* <Row>
            <Col md={6}>
              <Card
                id="chartActivity"
                title="2014 Sales"
                category="All products including Taxes"
                stats="Data information certified"
                statsIcon="fa fa-check"
                content={
                  <div className="ct-chart">
                    <ChartistGraph
                      data={dataBar}
                      type="Bar"
                      options={optionsBar}
                      responsiveOptions={responsiveBar}
                    />
                  </div>
                }
                legend={
                  <div className="legend">{this.createLegend(legendBar)}</div>
                }
              />
            </Col>

            <Col md={6}>
              <Card
                title="Tasks"
                category="Backend development"
                stats="Updated 3 minutes ago"
                statsIcon="fa fa-history"
                content={
                  <div className="table-full-width">
                    <table className="table">
                      <Tasks />
                    </table>
                  </div>
                }
              />
            </Col>
          </Row> */}
        </Grid>
      </div>
    );
  }
}

export default Overview;
