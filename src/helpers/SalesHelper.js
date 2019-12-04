import { convertDate } from "../common";

const convertTo2Dp = number => (number ? +number.toFixed(2) : 0);

export const getChartData = (PkoApiData, PkcApiData, P2ApiData) => {

  const pkolabels = [];
  const pkoSalesQuantityData = [];
  const pkoSalesPriceData = [];

  const pkclabels = [];
  const pkcSalesQuantityData = [];
  const pkcSalesPriceData = [];

  const accumulatedSalesObject = {};

  let accumulated_pko = 0;
  let accumulated_pkc = 0;
  let accumulated_p2 = 0;

  const salesDates = [];
  PkoApiData.map(dta => {

    const sale_amount = dta.quantitySold * dta.unitPriceSold;
    accumulated_pko += sale_amount;

    pkolabels.push(convertDate(dta._id));
    pkoSalesQuantityData.push(convertTo2Dp(dta.quantitySold || 0));
    pkoSalesPriceData.push(convertTo2Dp(dta.unitPriceSold || 0));
    // calculate PKO sales cycle
    if (dta.quantitySold) {
      salesDates.push(dta._id["date"]);
    }
    accumulatedSalesObject[convertDate(dta._id)] = {
      pko: sale_amount,
      ...accumulatedSalesObject[convertDate(dta._id)]
    };
    return true;
  });

  const salesCycles = [];
  salesDates.forEach((date, index) => {
    if (index > 0) {
      const timeDiff = new Date(date) - new Date(salesDates[index - 1]);
      const days = timeDiff / (1000 * 60 * 60 * 24);
      salesCycles.push(days);
    }
  });

  const salesCyclesAvg = convertTo2Dp(
    salesCycles.reduce((a, b) => a + b, 0) / salesCycles.length
  );

  PkcApiData.map(dta => {
    const sale_amount = dta.quantitySold * dta.unitPriceSold
    accumulated_pkc += sale_amount;
    pkclabels.push(convertDate(dta._id));
    pkcSalesQuantityData.push(convertTo2Dp(dta.quantitySold || 0));
    pkcSalesPriceData.push(convertTo2Dp(dta.unitPriceSold || 0));
    accumulatedSalesObject[convertDate(dta._id)] = {
      pkc: sale_amount,
      ...accumulatedSalesObject[convertDate(dta._id)]
    };
    return true;
  });

  P2ApiData.map(dta => {
    const total = dta.averageUnitMarketPrice;
    // const total = dta.averageUnitMarketPrice * dta.crushed;
    accumulated_p2 += total;
    accumulatedSalesObject[convertDate(dta._id)] = {
      p2: total,
      ...accumulatedSalesObject[convertDate(dta._id)]
    };
    return true;
  });

  const PkoData = {
    labels: pkolabels,
    datasets: [
      {
        yAxisID: "A",
        label: "Pko daily sales",
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
        data: pkoSalesQuantityData
      },
      {
        yAxisID: "B",
        label: "Pko Average unit selling price",
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
        data: pkoSalesPriceData
      }
    ]
  };

  const PkcData = {
    labels: pkclabels,
    datasets: [
      {
        yAxisID: "A",
        label: "Pkc daily sales",
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
        data: pkcSalesQuantityData
      },
      {
        yAxisID: "B",
        label: "Pkc Average unit selling price",
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
        data: pkcSalesPriceData
      }
    ]
  };
  const accumulatedLabels = Object.keys(accumulatedSalesObject);

  const pkoAccumulated = [];
  const pkcAccumulated = [];
  const p2Accumulated = [];
  let p2CrushedTillDate = 0;
  accumulatedLabels.forEach(date => {
    if (!accumulatedSalesObject[date].pko || accumulatedSalesObject[date].pko === 0) {
      p2Accumulated.push(void 0);
      p2CrushedTillDate += accumulatedSalesObject[date].p2;
    } 
    else {
      p2CrushedTillDate += accumulatedSalesObject[date].p2;
      p2Accumulated.push(convertTo2Dp(p2CrushedTillDate));
      p2CrushedTillDate = 0;
    }
    pkoAccumulated.push(convertTo2Dp(accumulatedSalesObject[date].pko));
    pkcAccumulated.push(convertTo2Dp(accumulatedSalesObject[date].pkc));
  });



  const accumulatedData = {
    labels: accumulatedLabels,
    datasets: [
      {
        label: "Pko sales",
        stack: "Stack 0",
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
        data: pkoAccumulated
      },
      {
        label: "Pkc sales",
        stack: "Stack 0",
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
        data: pkcAccumulated
      },
      {
        label: "P2 crushed till date value",
        stack: "Stack 1",
        fill: false,
        lineTension: 0.1,
        backgroundColor: "#ffaa1d",
        borderColor: "#ffaa1d",
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "#ffaa1d",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "#ffaa1d",
        pointHoverBorderColor: "#ffaa1d",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: p2Accumulated
      }
    ]
  };
  return {
    PkoData,
    PkcData,
    accumulatedData,
    salesCyclesAvg
  };
};
