import React from "react";
import { Link } from "react-router-dom";
import { logOut } from "../../helpers/auth";
import Inventory from "../Inventory";
import Maintenance from "../Maintenance";
import Overview from "../Overview";
import Sales from "../Sales";
import "./index.scss";

const pages = {
  inventory: <Inventory />,
  maintenance: <Maintenance />,
  overview: <Overview />,
  sales: <Sales />
};
class Home extends React.Component {
  state = {
    currentPage: "overview",
    page: ""
  };

  componentDidMount() {
    const { location } = this.props;
    const currentPage = location.pathname.split("/")[1];
    this.setLocation(currentPage);
  }

  componentDidUpdate(nextProps) {
    const { location } = this.props;
    if (nextProps.location !== location) {
      const currentPage = location.pathname.split("/")[1];
      this.setLocation(currentPage);
    }
  }

  setLocation = currentPage => {
    this.setState({
      currentPage,
      page: pages[currentPage]
    });
  };

  logUserOut = () => {
    const { history } = this.props;
    logOut(history);
  };

  render() {
    const { currentPage, page } = this.state;
    return (
      <div className="home__container">
        <div className="side-bar">
          <h4 className="header-text">RELEAF</h4>
          <div>
            <h5
              className={`side-bar-item ${!!(currentPage === "overview") &&
                "selected"}`}
            >
              <Link
                to={{
                  pathname: "/overview",
                  state: { fromDashboard: true }
                }}
              >
                Overview
              </Link>
            </h5>
            <h5
              className={`side-bar-item ${currentPage === "inventory" &&
                "selected"}`}
            >
              <Link
                to={{
                  pathname: "/inventory",
                  state: { fromDashboard: false }
                }}
              >
                Inventory
              </Link>
            </h5>
            <h5
              className={`side-bar-item ${currentPage === "sales" &&
                "selected"}`}
            >
              <Link to="/sales">Sales</Link>
            </h5>
            <h5
              className={`side-bar-item ${currentPage === "maintenance" &&
                "selected"}`}
            >
              <Link to="/maintenance">Maintenance</Link>
            </h5>
            <h5 className="side-bar-item">
              <Link to="/" onClick={this.logUserOut}>
                Logout
              </Link>
            </h5>
          </div>
        </div>
        <div className="main-content">{page}</div>
      </div>
    );
  }
}

export default Home;
