import React from "react";
import { Line, Bar } from "react-chartjs-2";
import DatePicker from "react-datepicker";
import {
  getP2Inventory,
  getPkoInventory,
  getPkcInventory
} from "../../actions/sheetActions";
import Loader from "../../common/Loader";
import { getDateFilter } from "../../common";
import { getGraphValues } from "./helper";
import "./index.scss";

class Inventory extends React.Component {
  state = {
    loading: true,
    currentScreen: "p2",
    currentView: "dailyPurchase",
    P2Data: {},
    PkoData: {},
    PkcData: {},
    P2Accumulated: {},
    pkcAccumulated: {},
    P2AvgProduction: {},
    PkoAvgProduction: {},
    PkcAvgProduction: {},
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    endDate: new Date(),
    P2ApiData: [],
    PkoApiData: [],
    PkcApiData: [],
    currentDateFilter: "currentWeek",
    graphView: "day"
  };

  async componentDidMount() {
    await this.handleSubmit();
  }

  setGraphValues = () => {
    const { P2ApiData, PkoApiData, PkcApiData } = this.state;
    const {
      P2Data,
      P2Accumulated,
      PkoData,
      PkoAccumulated,
      PkcData,
      PkcAccumulated,
      P2AvgProduction,
      PkoAvgProduction,
      PkcAvgProduction
    } = getGraphValues(P2ApiData, PkoApiData, PkcApiData);
    this.setState({
      P2Data,
      P2Accumulated,
      PkoData,
      PkoAccumulated,
      PkcData,
      PkcAccumulated,
      P2AvgProduction,
      PkoAvgProduction,
      PkcAvgProduction,
      loading: false
    });
  };

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

  handleSubmit = async () => {
    const { startDate, endDate, graphView } = this.state;
    this.setState({
      loading: true
    });
    const P2ApiData = (await getP2Inventory(
      startDate.toISOString(),
      endDate.toISOString(),
      graphView
    )).p2Data;
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
    this.setState(
      {
        P2ApiData,
        PkoApiData,
        PkcApiData,
        loading: false
      },
      () => this.setGraphValues()
    );
  };

  render() {
    const {
      P2Data,
      PkoData,
      currentScreen,
      PkcData,
      loading,
      currentView,
      P2Accumulated,
      PkoAccumulated,
      PkcAccumulated,
      P2AvgProduction,
      PkcAvgProduction,
      PkoAvgProduction,
      startDate,
      endDate,
      P2ApiData,
      PkoApiData,
      PkcApiData,
      currentDateFilter,
      graphView
    } = this.state;

    const options = { maintainAspectRatio: true, responsive: true };
    options.scales = {};
    options.scales.xAxes = [
      {
        scaleLabel: {
          display: true,
          labelString: ""
        }
      }
    ];
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
          display: true
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
        {currentScreen === "p2" && !P2ApiData.length && (
          <div className="no-content-screen">
            No data to display for the period selected
          </div>
        )}
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
        <div className="d-flex w-100 inv-flex-container">
          <div className="inv-flex-item-1">
            {currentView === "dailyPurchase" && (
              <div>
                {currentScreen === "pko" && !!PkoApiData.length && (
                  <Line
                    height={400}
                    width={800}
                    data={PkoData}
                    options={options}
                  />
                )}
                {currentScreen === "p2" && !!P2ApiData.length && (
                  <Line
                    height={400}
                    width={800}
                    data={P2Data}
                    options={options}
                  />
                )}
                {currentScreen === "pkc" && !!PkcApiData.length && (
                  <Line
                    height={400}
                    width={800}
                    data={PkcData}
                    options={options}
                  />
                )}
                <div className="inventory-toggler-container">
                  {!!PkoApiData.length && (
                    <button
                      className={`toggle-btns ${currentScreen === "pko" &&
                        "active"}`}
                      onClick={() => this.setCurrentScreen("pko")}
                    >
                      PKO
                    </button>
                  )}
                  {!!P2ApiData.length && (
                    <button
                      className={`toggle-btns ${currentScreen === "p2" &&
                        "active"}`}
                      onClick={() => this.setCurrentScreen("p2")}
                    >
                      P2
                    </button>
                  )}
                  {!!PkcApiData.length && (
                    <button
                      className={`toggle-btns ${currentScreen === "pkc" &&
                        "active"}`}
                      onClick={() => this.setCurrentScreen("pkc")}
                    >
                      PKC
                    </button>
                  )}
                </div>
              </div>
            )}
            {currentView === "accumulated" && (
              <div>
                {currentScreen === "pko" && !!PkoApiData.length && (
                  <Line
                    data={PkoAccumulated}
                    options={options}
                    height={400}
                    width={800}
                  />
                )}
                {currentScreen === "p2" && !!P2ApiData.length && (
                  <Line
                    data={P2Accumulated}
                    options={options}
                    height={400}
                    width={800}
                  />
                )}
                {currentScreen === "pkc" && !!PkcApiData.length && (
                  <Line
                    data={PkcAccumulated}
                    options={options}
                    height={400}
                    width={800}
                  />
                )}
                <div className="inventory-toggler-container">
                  {!!PkoApiData.length && (
                    <button
                      className={`toggle-btns ${currentScreen === "pko" &&
                        "active"}`}
                      onClick={() => this.setCurrentScreen("pko")}
                    >
                      PKO
                    </button>
                  )}
                  {!!P2ApiData.length && (
                    <button
                      className={`toggle-btns ${currentScreen === "p2" &&
                        "active"}`}
                      onClick={() => this.setCurrentScreen("p2")}
                    >
                      P2
                    </button>
                  )}
                  {!!PkcApiData.length && (
                    <button
                      className={`toggle-btns ${currentScreen === "pkc" &&
                        "active"}`}
                      onClick={() => this.setCurrentScreen("pkc")}
                    >
                      PKC
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="inv-flex-item-2">
            {currentScreen === "p2" && !!P2ApiData.length && (
              <Bar data={P2AvgProduction} />
            )}
            {currentScreen === "pko" && !!PkoApiData.length && (
              <Bar data={PkoAvgProduction} />
            )}
            {currentScreen === "pkc" && !!PkcApiData.length && (
              <Bar data={PkcAvgProduction} />
            )}
          </div>
        </div>
        {(!!PkcApiData.length || !!PkoApiData.length || !!P2ApiData.length) && (
          <div className="d-block view-toggler">
            <button
              className={`toggle-btns ${currentView === "dailyPurchase" &&
                "active"}`}
              onClick={() => this.setCurrentView("dailyPurchase")}
            >
              Daily Purchase/Production
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

export default Inventory;
