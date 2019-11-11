import React from "react";
import { Line, Bar } from "react-chartjs-2";
import DatePicker from "react-datepicker";
import {
  getPkoInventory,
  getPkcInventory,
  getP2Inventory
} from "../../actions/sheetActions";
import Loader from "../../common/Loader";
import { getDateFilter } from "../../common/";
import { getChartData } from "./helper";

class Sales extends React.Component {
  state = {
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
    this.handleSubmit();
  }

  setCurrentScreen(screen) {
    this.setState({
      currentScreen: screen
    });
  }

  setCurrentView(view) {
    this.setState({
      currentView: view
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

  handleGraphView = view => {
    const prevViewState = this.state.graphView;
    if (prevViewState === view) {
      return;
    }
    this.setState(
      {
        graphView: view
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
            stacked: true
          }
        ],
        yAxes: [
          {
            stacked: true,
            ticks: {
              callback: value => "₦" + value.toLocaleString()
            }
          }
        ]
      }
    };

    const options = { maintainAspectRatio: false, responsive: true };
    options.scales = {};
    options.scales.yAxes = [
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
          callback: value => value + " tons"
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
          callback: value => "₦" + value.toLocaleString()
        }
      }
    ];
    if (loading) {
      return <Loader />;
    }

    return (
      <div className="inventory-container">
        {currentScreen === "pko" && !PkoApiData.length && (
          <div className="no-content-screen">
            No data to display for the period selected
          </div>
        )}
        {currentScreen === "pkc" && !PkcApiData.length && (
          <div className="no-content-screen">
            No data to display for the period selected
          </div>
        )}
        <div className="date-picker-container">
          <select
            name="dateFilter"
            className="select-container"
            value={currentDateFilter}
            onChange={this.handleDateFilter}
          >
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
          <span className="graph-view-container">
            <button
              className={`date-picker-btn ${graphView === "day" && "active"} `}
              onClick={() => this.handleGraphView("day")}
            >
              day
            </button>
            <button
              className={`date-picker-btn ${graphView === "week" && "active"} `}
              onClick={() => this.handleGraphView("week")}
            >
              week
            </button>
            <button
              className={`date-picker-btn ${graphView === "month" &&
                "active"} `}
              onClick={() => this.handleGraphView("month")}
            >
              month
            </button>
          </span>
        </div>
        <div className="d-flex inv-flex-container">
          <div className="inv-flex-item-1">
            {currentView === "dailySales" && (
              <div>
                {currentScreen === "pko" && !!PkoApiData.length && (
                  <Line
                    data={PkoData}
                    options={options}
                    height={400}
                    width={800}
                  />
                )}
                {currentScreen === "pkc" && !!PkcApiData.length && (
                  <Line
                    data={PkcData}
                    options={options}
                    height={400}
                    width={800}
                  />
                )}
                {(!!PkcApiData.length || !!PkoApiData.length) && (
                  <div className="inventory-toggler-container">
                    <button
                      className={`toggle-btns ${currentScreen === "pko" &&
                        "active"}`}
                      onClick={() => this.setCurrentScreen("pko")}
                    >
                      PKO
                    </button>
                    <button
                      className={`toggle-btns ${currentScreen === "pkc" &&
                        "active"}`}
                      onClick={() => this.setCurrentScreen("pkc")}
                    >
                      PKC
                    </button>
                  </div>
                )}
              </div>
            )}
            {currentView === "accumulated" &&
              (!!PkcApiData.length || !!PkoApiData.length) && (
                <div>
                  <Bar
                    data={accumulatedData}
                    options={stackedBarOptions}
                    height={400}
                    width={800}
                  />
                </div>
              )}
          </div>
          <div className="inv-flex-item-2">
            <div className="circle">
              <div>
                <p className="circle-content"> Avg Sale Cycle</p>
                <p>{salesCyclesAvg === 0 ? "N/A" : `${salesCyclesAvg} days`}</p>
              </div>
            </div>
          </div>
        </div>
        {(!!PkcApiData.length || !!PkoApiData.length) && (
          <div className="d-block view-toggler">
            <button
              className={`toggle-btns ${currentView === "dailySales" &&
                "active"}`}
              onClick={() => this.setCurrentView("dailySales")}
            >
              Daily Sales
            </button>
            <button
              className={`toggle-btns ${currentView === "accumulated" &&
                "active"}`}
              onClick={() => this.setCurrentView("accumulated")}
            >
              Accumulated
            </button>
          </div>
        )}
      </div>
    );
  }
}

export default Sales;
