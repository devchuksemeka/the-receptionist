const moment = require('moment')

exports.getWeekInMonth = (date) => {
    const date_v = moment(new Date(date))
    let week = Math.ceil(date_v.date()/7);

    if(week === 1) {week = `${week}st`}
    if(week === 2) {week = `${week}nd`}
    if(week === 3) {week = `${week}rd`}
    if(week >= 4) {week = `${week}th`}
    return `${week} week of ${date_v.format("MMM")} ${date_v.year()}`
    // return `${week} week of ${date_v.format("MMM")} ${date_v.year()}`

}

exports.numberOfDays = (date1,date2) => {
  const oneDay = 24 * 60 * 60 * 1000; 
  const firstDate = new Date(date1);
  const secondDate = new Date(date2);
  
  return Math.round(Math.abs((firstDate - secondDate) / oneDay));
}

exports.differenceOfDateInHours = (date1,date2) => {
  var a = moment(new Date(date1));
  var b = moment(new Date(date2));
  let hours = Math.abs(b.diff(a, 'hours'));
  return hours;
}

exports.numberOfWeeks = (date1,date2) => {
  var a = moment(new Date(date1));
  var b = moment(new Date(date2));
  let weeeks = b.diff(a, 'weeks');
  return weeeks;
}

exports.numberOfMonths = (date1,date2) => {
  var a = moment(new Date(date1));
  var b = moment(new Date(date2));
  let month = b.diff(a, 'month');
  return month;
}

const convertToDate = (value) =>{
  return moment(new Date(value))
}

exports.getDateInISO = (str) => {
  return convertToDate(str).toISOString()
}

exports.toTitleCase = (str) => str.split(" ").map(item=>item.substring(0,1).toUpperCase()+item.substring(1)).join(" ")

// exports.toCurrency = (amount,amount_currency,conversion) => str.split(" ").map(item=>item.substring(0,1).toUpperCase()+item.substring(1)).join(" ")
exports.getWeek = (datetime)=> {
    const date = moment(new Date(datetime)).format("YYYY MM ww")
    return date;
}
exports.getMonth = (datetime)=> {
    const date = moment(new Date(datetime)).format("MMM YYYY")
    return date;
}

exports.getDate = (datetime)=> {
    const date = moment(new Date(datetime)).format("Do MMM")
    return date;
}

exports.dateAddDays = (date,add) => {
    const date_v = moment(new Date(date)).add(add,"d")
    return date_v;
}

exports.dateAddWeeks = (date,add) => {
    const date_v = moment(new Date(date)).add(add,"w")
    return date_v;
}

exports.dateAddMonths = (date,add) => {
    const date_v = moment(new Date(date)).add(add,"M")
    return date_v;
}

exports.formatDateDay = (day) => {
    return day < 10 ? `0${day}` : day
}

exports.formatDateMonth = (month) => {
    return month < 10 ?  `0${month}` : month
}


const CONSTANT = {
  USD_TO_NAIRA_CONV_RATE:362.5
}

exports.CONSTANT = CONSTANT;