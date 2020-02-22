import Overview from "pages/Overview";
import Maintenance from "pages/Maintenance";
import Inventory from "pages/Inventory";
import Sales from "pages/Sales";
import ProcurementCost from "pages/ProcurementCost";
import MachineData from "pages/MachineData";
import Energy from "pages/Energy";

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
    path: "/maintenance",
    name: "Maintenance",
    icon: "pe-7s-settings",
    component: Maintenance,
    layout: "/admin"
  },

  {
    path: "/machine-data",
    name: "Machine Data",
    icon: "pe-7s-target",
    component: MachineData,
    layout: "/admin"
  },
  {
    path: "/procurements",
    name: "Procurements",
    icon: "pe-7s-junk",
    component: ProcurementCost,
    layout: "/admin"
  },
  {
    path: "/energy",
    name: "Energy",
    icon: "pe-7s-timer",
    component: Energy,
    layout: "/admin"
  },
];

export default dashboardRoutes;
