import Overview from "pages/Overview";
import Maintenance from "pages/Maintenance";
import Inventory from "pages/Inventory";
import Sales from "pages/Sales";
import ProcurementCost from "pages/ProcurementCost";
import MachineData from "pages/MachineData";
import Energy from "pages/Energy";
import Users from "pages/Users";
import Landing from "pages/Default/Landing";
import CheckIn from "pages/Default/Visitor/CheckIn";

const dashboardRoutes = [
  {
    path: "/",
    name: "Home",
    icon: "pe-7s-graph",
    component: Landing,
    layout: "/",
  },
  {
    path: "/visitors/check-in",
    name: "Visitors Check In",
    icon: "pe-7s-graph",
    component: CheckIn,
    layout: "/",
  },
  {
    path: "/overview",
    name: "Overview",
    icon: "pe-7s-graph",
    component: Overview,
    layout: "/admin",
    permissions:["view_overview"]
  },
  {
    path: "/inventory",
    name: "Inventory",
    icon: "pe-7s-note2",
    component: Inventory,
    layout: "/admin",
    permissions:["view_inventory","view_inventory_with_widgets","view_inventory_with_graph"]
  },
  {
    path: "/sales",
    name: "Sales",
    icon: "pe-7s-cash",
    component: Sales,
    layout: "/admin",
    permissions:["view_sales"]
  },
  {
    path: "/maintenance",
    name: "Maintenance",
    icon: "pe-7s-settings",
    component: Maintenance,
    layout: "/admin",
    permissions:["view_maintenance"]
  },

  {
    path: "/machine-data",
    name: "Machine Data",
    icon: "pe-7s-target",
    component: MachineData,
    layout: "/admin",
    permissions:["view_machine_data"]
  },
  {
    path: "/procurements",
    name: "Procurements",
    icon: "pe-7s-junk",
    component: ProcurementCost,
    layout: "/admin",
    permissions:["view_procurements"]
  },
  {
    path: "/energy",
    name: "Energy",
    icon: "pe-7s-timer",
    component: Energy,
    layout: "/admin",
    permissions:["view_energy"]
  },
  {
    path: "/users",
    name: "Users",
    icon: "pe-7s-users",
    component: Users,
    layout: "/admin",
    permissions:["view_users"]
  },
];

export default dashboardRoutes;
