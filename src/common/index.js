import moment from 'moment'
var months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec"
];


export const convertDate = (dateObj, view) => {
  if (dateObj["day"]) {
    const temp_date = new Date(dateObj["date"]).toDateString().split(" ");
    return `${temp_date[1]} ${temp_date[2]}`;
  }
  if (dateObj["week"]) {
    // revisit week calculation
    const d = 1 + (dateObj["week"] - 1) * 7;
    const splittedDate = new Date(dateObj["year"], 0, d).toString().split(" ");
    return `${splittedDate[1]} ${splittedDate[2]}`;
  }
  if (dateObj["month"]) {
    return months[Number(dateObj["month"]) - 1];
  }
  if (dateObj["year"]) {
    return dateObj["year"];
  }
};

export const getDateFilter = currentDateFilter => {
  let startDate = moment().startOf("week").toDate();
  let endDate = moment().endOf("week").toDate();

  // if (currentDateFilter === "currentWeek") {
  //   // startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  //   startDate = startDate;
  //   endDate = endDate;
  //   // endDate = new Date();
  // }
  if (currentDateFilter === "lastWeek") {
    startDate = moment(startDate).subtract(7,"days");
    // startDate = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
    endDate = moment(endDate).subtract(7,"days");
    // endDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  }
  if (currentDateFilter === "last2Weeks") {
    startDate = moment(startDate).subtract(14,"days");
    // startDate = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
    // endDate = new Date();
    endDate = moment(endDate).subtract(14,"days");
  }
  if (currentDateFilter === "lastMonth") {
    startDate = moment().subtract(1,"months").startOf("month");
    // startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    endDate = moment().subtract(1,"months").endOf("month");;
    // endDate = new Date();
  }
  return { startDate, endDate };
};
