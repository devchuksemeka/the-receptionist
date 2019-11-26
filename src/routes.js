import Overview from "pages/Overview";
import Inventory from "pages/Inventory";
import Sales from "pages/Sales";
import Maintenance from "pages/Maintenance";
import SalesRework from "pages/SalesRework";
import InventoryRework from "pages/InventoryRework";

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
  // {
  //   path: "/reworkinventory",
  //   name: "Rework Inventory",
  //   icon: "pe-7s-note2",
  //   component: InventoryRework,
  //   layout: "/admin"
  // },
  {
    path: "/sales",
    name: "Sales",
    icon: "pe-7s-cash",
    component: Sales,
    layout: "/admin"
  },
  // {
  //   path: "/reworksales",
  //   name: "Rework Sales",
  //   icon: "pe-7s-cash",
  //   component: SalesRework,
  //   layout: "/admin"
  // },
  {
    path: "/maintenance",
    name: "Maintenance",
    icon: "pe-7s-settings",
    component: Maintenance,
    layout: "/admin"
  },
];

export default dashboardRoutes;
