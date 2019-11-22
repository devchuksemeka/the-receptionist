import Overview from "pages/Overview";
import Inventory from "pages/Inventory";
import Sales from "pages/Sales";
import Maintenance from "pages/Maintenance";
import SalesRework from "pages/SalesRework";

const dashboardRoutes = [
  {
    path: "/overview",
    name: "Overview",
    icon: "pe-7s-graph",
    component: Overview,
    layout: "/admin"
  },
  {
    path: "/inventory",
    name: "Inventory",
    icon: "pe-7s-note2",
    component: Inventory,
    layout: "/admin"
  },
  {
    path: "/sales",
    name: "Sales",
    icon: "pe-7s-cash",
    component: Sales,
    layout: "/admin"
  },
  {
    path: "/reworksales",
    name: "reworksales",
    icon: "pe-7s-cash",
    component: SalesRework,
    layout: "/admin"
  },
  {
    path: "/maintenance",
    name: "Maintenance",
    icon: "pe-7s-settings",
    component: Maintenance,
    layout: "/admin"
  },
];

export default dashboardRoutes;
