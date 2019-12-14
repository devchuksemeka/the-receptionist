import Overview from "pages/Overview";
import Inventory from "pages/Inventory";
import Sales from "pages/Sales";
import Maintenance from "pages/Maintenance";
import InventoryRework from "pages/InventoryRework";
import SalesRework from "pages/SalesRework";

const dashboardRoutes = [
  {
    path: "/overview",
    name: "Overview",
    icon: "pe-7s-graph",
    component: Overview,
    layout: "/admin"
  },
  // {
  //   path: "/inventory",
  //   name: "Inventory",
  //   icon: "pe-7s-note2",
  //   component: Inventory,
  //   layout: "/admin"
  // },
  {
    path: "/inventory",
    // path: "/rework-inventory",
    name: "Inventory",
    // name: "Inventory Rework",
    icon: "pe-7s-note2",
    component: InventoryRework,
    layout: "/admin"
  },
  // {
  //   path: "/sales",
  //   name: "Sales",
  //   icon: "pe-7s-cash",
  //   component: Sales,
  //   layout: "/admin"
  // },
  {
    path: "/sales",
    // path: "/rework-sales",
    name: "Sales",
    // name: "Sales Rework",
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
