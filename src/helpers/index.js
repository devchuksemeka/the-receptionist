const moment = require('moment')

const getWeekInMonth = (date) => {
    const date_v = moment(new Date(date))
    let week = Math.ceil(date_v.date()/7);

    if(week === 1) {week = `${week}st`}
    if(week === 2) {week = `${week}nd`}
    if(week === 3) {week = `${week}rd`}
    if(week >= 4) {week = `${week}th`}
    return `${week} week of ${date_v.format("MMM")} ${date_v.year()}`
    // return `${week} week of ${date_v.format("MMM")} ${date_v.year()}`

}

const toMoneyFormat = (number) =>{
  const formatter = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
  });

  return formatter.format(number)

}
const toMoneyFormatDynamic = (number,currency) =>{
  let lng = currency === "USD" ? "en-US" : "en-NG"
  const formatter = new Intl.NumberFormat(lng, {
    style: 'currency',
    currency,
  });

  return formatter.format(number || 0)

}

const numberOfDays = (date1,date2) => {
  const oneDay = 24 * 60 * 60 * 1000; 
  const firstDate = new Date(date1);
  const secondDate = new Date(date2);
  
  return Math.round(Math.abs((firstDate - secondDate) / oneDay));
}

const differenceOfDateInHours = (date1,date2) => {
  var a = moment(new Date(date1));
  var b = moment(new Date(date2));
  let hours = Math.abs(b.diff(a, 'hours'));
  return hours;
}

const numberOfWeeks = (date1,date2) => {
  var a = moment(new Date(date1));
  var b = moment(new Date(date2));
  let weeeks = b.diff(a, 'weeks');
  return weeeks;
}

const numberOfMonths = (date1,date2) => {
  var a = moment(new Date(date1));
  var b = moment(new Date(date2));
  let month = b.diff(a, 'month');
  return month;
}

const convertToDate = (value) =>{
  return moment(new Date(value))
}

const getDateInISO = (str) => {
  return convertToDate(str).toISOString()
}

const toTitleCase = (str) => str.split(" ").map(item=>item.substring(0,1).toUpperCase()+item.substring(1)).join(" ")

// const toCurrency = (amount,amount_currency,conversion) => str.split(" ").map(item=>item.substring(0,1).toUpperCase()+item.substring(1)).join(" ")
const getWeek = (datetime)=> {
    const date = moment(new Date(datetime)).format("YYYY MM ww")
    return date;
}
const getMonth = (datetime)=> {
    const date = moment(new Date(datetime)).format("MMM YYYY")
    return date;
}

const getDate = (datetime)=> {
    const date = moment(new Date(datetime)).format("Do MMM")
    return date;
}

const dateAddDays = (date,add) => {
    const date_v = moment(new Date(date)).add(add,"d")
    return date_v;
}

const dateAddWeeks = (date,add) => {
    const date_v = moment(new Date(date)).add(add,"w")
    return date_v;
}

const dateAddMonths = (date,add) => {
    const date_v = moment(new Date(date)).add(add,"M")
    return date_v;
}

const formatDateDay = (day) => {
    return day < 10 ? `0${day}` : day
}

const formatDateMonth = (month) => {
    return month < 10 ?  `0${month}` : month
}


const graph_A_B_YAxisDatasets = (labels,a_options,b_options) => {
  return {
    labels,
    datasets:[
      {
        yAxisID: "A",
        label: a_options.label,
        fill: false,
        lineTension: 0.1,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "rgba(75,192,192,1)",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(75,192,192,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: a_options.data
      },
      {
        yAxisID: "B",
        label: b_options.label,
        fill: false,
        lineTension: 0.1,
        backgroundColor: "#de6866",
        borderColor: "#de6866",
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "#de6866",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "#de6866",
        pointHoverBorderColor: "#fe6866",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: b_options.data
      }
    ]
  }
};

const CONSTANT = {
  USD_TO_NAIRA_CONV_RATE:362.82,
  DAY:"day",
  WEEK:"week",
  MONTH:"month",
  DAILY_SALES:"dailySales",
  ACCUMULATED_SALES:"accumulated",
  DAILY_PURCHASE_PRODUCTION:"dailyPurchase",
  ACCUMULATED_PURCHASE_PRODUCTION:"accumulated",

  INVENTORY_PURCHASES:"purchases",
  INVENTORY_PRODUCTIONS:"productions",

  PKO:"PKO",
  PKC:"PKC",
  P2:"P2",

  NAIRA_CURRENCY:"naira",
  USD_CURRENCY:"usd",


  // maintenance levels
  MACHINE_LEVEL:"machine_level",
  FACTORY_LEVEL:"factory_level",
  FACTORY_LEVEL_MACHINE:"factory_level_machine",
  MAINTENANCE_ACTION_LEVEL:"maintenance_action_level",

  // procurement cost levels
  P2_SUPPLY_ANALYSIS:"p2_supply_analysis",
  DIESEL_SUPPLY_ANALYSIS:"diesel_supply_analysis",

  // machine data stats levels
  MACHINE_DATA_RM_CRUSHING:"rm_crushing",
  MACHINE_DATA_MAINTENANCE:"maintenance",
  MACHINE_DATA_UPTIME_AND_DOWNTIME:"uptime_and_downtime",
  MACHINE_DATA_CRUSHING_EFFICIENCY:"crushing_efficiency",
  MACHINE_DATA_UTILIZATION:"utilization",

  // CRUSHING RM
  MACHINE_P2_RM: "P2",
  MACHINE_PKC1_RM: "PKC1",

   // ENERGY PAGE CATEGORY
  ENERGY_ANALYSIS: "energy_analysis",
  DIESEL_SUPPLY_LOG: "diesel_supply_log",

  // energy data stats levels
  ENERGY_DIESEL_LITRE_AND_AMOUNT_USAGE:"diesel_litre_and_amount_usage",
  ENERGY_GENERATOR_MAINTENANCE_ANALYSIS:"generator_maintenance_tracker_analysis",



  // MACHINE NAME
  ALL_MACHINES : "__ALL__",
  MACHINE_1 : "EX 1",
  MACHINE_2 : "EX 2",
  MACHINE_3 : "EX 3",
  MACHINE_4 : "EX 4",


   // MACHINE HEALTH STATUS
  MACHINE_HEALTH_GOOD:"on_track",
  MACHINE_HEALTH_OK:"due_soon",
  MACHINE_HEALTH_BAD:"behind",

   // MACHINE FILTER HEALTH LEVEL
   MACHINE_SERVICE_HEALTH:"machine_service_health",
   MACHINE_OVERHAUL_HEALTH:"machine_overhaul_health",
}

module.exports= {
  graph_A_B_YAxisDatasets,
  getWeekInMonth,
  toMoneyFormat,
  toMoneyFormatDynamic,
  numberOfDays,
  differenceOfDateInHours,
  numberOfWeeks,
  convertToDate,
  numberOfMonths,
  toTitleCase,
  getDateInISO,
  getWeek,
  getMonth,
  getDate,
  dateAddDays,
  CONSTANT,
  formatDateMonth,
  formatDateDay,
  dateAddMonths,
  dateAddWeeks,
}