import Overview from "pages/Overview";
import Maintenance from "pages/Maintenance";
import InventoryRework from "pages/InventoryRework";
import SalesRework from "pages/SalesRework";
import Inventory from "pages/Inventory";

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
  //   path: "/inventory",
  //   name: "Inventory",
  //   icon: "pe-7s-note2",
  //   component: InventoryRework,
  //   layout: "/admin"
  // },
  {
    path: "/sales",
    name: "Sales",
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
