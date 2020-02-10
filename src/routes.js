import Overview from "pages/Overview";
import Maintenance from "pages/Maintenance";
import Inventory from "pages/Inventory";
import Sales from "pages/Sales";
import ProcurementCost from "pages/ProcurementCost";

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
    path: "/procurement-cost",
    name: "Procurement Cost",
    icon: "pe-7s-junk",
    component: ProcurementCost,
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
    path: "/maintenance",
    name: "Maintenance",
    icon: "pe-7s-settings",
    component: Maintenance,
    layout: "/admin"
  },
];

export default dashboardRoutes;
