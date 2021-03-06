import { convertDate } from "../common";

const convertTo2Dp = number => (number ? +number.toFixed(2) : 0);

export const getGraphValues = (P2ApiData, PkoApiData, PkcApiData) => {
  const p2labels = [];
  const p2QuantityData = [];
  const p2PriceData = [];
  const p2AccumulatedInventory = [];
  const p2AvgProduction = [];
  const p2InventoryValue = [];

  const pkolabels = [];
  const pkoQuantityData = [];
  const pkoMarketPriceData = [];
  const pkoaccumulatedInventory = [];
  const pkoAvgProduction = [];
  const pkoInventoryValue = [];

  const pkclabels = [];
  const pkcQuantityData = [];
  const pkcMarketPriceData = [];
  const pkcAccumulated = [];
  const pkcAvgProduction = [];
  const pkcInventoryValue = [];

  
  let pko_total_quantity = 0;
  let pkc_total_quantity = 0;

  let p2_accumulated_total_purchased_quantity = 0;

  P2ApiData.map((dta,index) => {
   
    let quantity = Math.abs(dta.quantitypurchased);
    
    const crushed_quantity = dta.crushed;
    p2_accumulated_total_purchased_quantity += quantity;

    p2_accumulated_total_purchased_quantity -= crushed_quantity;

    const avg_unitprice = dta.currentQuantity * dta.averageUnitMarketPrice

    p2labels.push(convertDate(dta._id));
    p2QuantityData.push(convertTo2Dp(dta.quantitypurchased || 0));
    p2PriceData.push(convertTo2Dp(dta.unitprice || 0));
    p2AccumulatedInventory.push(convertTo2Dp(p2_accumulated_total_purchased_quantity));
    p2AvgProduction.push(convertTo2Dp(dta.crushedPerHr || 0));
    p2InventoryValue.push(convertTo2Dp(avg_unitprice));
    return true;
  });

  // console.log("p2AccumulatedInventory",p2AccumulatedInventory)
  const extra_tooltip_data = {};

  PkoApiData.map((dta,index) => {
    
    let averageUnitMarketPrice = dta.currency_type === "naira" ? dta.averageUnitMarketPrice : dta.usd_averageUnitMarketPrice
    let quantity = Math.abs(dta.currentQuantity);
    const quantity_sold = dta.quantitySold;
    pko_total_quantity += quantity;
    pko_total_quantity -= quantity_sold;

    let convert_date = convertDate(dta._id)

    pkolabels.push(convert_date);
    extra_tooltip_data[convert_date] = {
      shift_hours:dta.shift_hours
    };
    pkoQuantityData.push(convertTo2Dp(dta.quantity || 0));
    pkoMarketPriceData.push(convertTo2Dp(averageUnitMarketPrice));
    pkoaccumulatedInventory.push(convertTo2Dp(pko_total_quantity));
    pkoInventoryValue.push(
      convertTo2Dp(quantity * averageUnitMarketPrice)
    );
    return true;
  });


  PkcApiData.map((dta,index) => {
    let averageUnitMarketPrice = dta.currency_type === "naira" ? dta.averageUnitMarketPrice : dta.usd_averageUnitMarketPrice

    let quantity = Math.abs(dta.currentQuantity);
    const quantity_sold = dta.quantitySold;
    pkc_total_quantity += quantity;
    pkc_total_quantity -= quantity_sold;

    let convert_date = convertDate(dta._id)
    pkclabels.push(convert_date);
    
    extra_tooltip_data[convert_date] = {
      shift_hours:dta.shift_hours
    };

    pkcQuantityData.push(convertTo2Dp(dta.quantity || 0));
    pkcMarketPriceData.push(convertTo2Dp(averageUnitMarketPrice));
    pkcAccumulated.push(convertTo2Dp(pkc_total_quantity));
    pkcAvgProduction.push(convertTo2Dp(dta.productionPerHour));
    pkcInventoryValue.push(
      convertTo2Dp(quantity * averageUnitMarketPrice)
    );
    return true;
  });

  const P2Data = {
    labels: p2labels,
    datasets: [
      {
        yAxisID: "A",
        label: "P2 quantity purchased",
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
        data: p2QuantityData
      },
      {
        yAxisID: "B",
        label: "Average P2 unit cost price",
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
        data: p2PriceData
      }
    ]
  };

  const P2Accumulated = {
    labels: p2labels,
    datasets: [
      {
        yAxisID: "A",
        label: "P2 current inventory",
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
        data: p2AccumulatedInventory
      },
      {
        yAxisID: "B",
        label: "P2 current inventory value",
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
        data: p2InventoryValue
      }
    ]
  };

  const PkoData = {
    labels: pkolabels,
    datasets: [
      {
        yAxisID: "A",
        label: "Pko produced",
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
        data: pkoQuantityData
      },
      {
        yAxisID: "B",
        label: "Pko Average Market unit price",
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
        data: pkoMarketPriceData
      }
    ]
  };

  const PkoAccumulated = {
    labels: pkolabels,
    datasets: [
      {
        yAxisID: "A",
        label: "Pko current inventory",
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
        data: pkoaccumulatedInventory
      },
      {
        yAxisID: "B",
        label: "Pko current inventory value",
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
        data: pkoInventoryValue
      }
    ]
  };

  const PkcData = {
    labels: pkclabels,
    datasets: [
      {
        yAxisID: "A",
        label: "Pkc produced",
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
        data: pkcQuantityData
      },
      {
        yAxisID: "B",
        label: "Pkc Average Market unit price",
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
        data: pkcMarketPriceData
      }
    ]
  };

  const PkcAccumulated = {
    labels: pkclabels,
    datasets: [
      {
        label: "Pkc current inventory",
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
        yAxisID: "B",
        label: "Pkc current inventory value",
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
        data: pkcInventoryValue
      }
    ]
  };

  const P2AvgProduction = {
    labels: p2labels,
    datasets: [
      {
        label: "Average P2 Crushed per hour",
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
        data: p2AvgProduction
      }
    ]
  };

  const PkoAvgProduction = {
    labels: pkolabels,
    datasets: [
      {
        label: "Average PKO produced per hour",
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
        data: pkoAvgProduction
      }
    ]
  };

  const PkcAvgProduction = {
    labels: pkclabels,
    datasets: [
      {
        label: "Average PKC produced per hour",
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
        data: pkcAvgProduction
      }
    ]
  };

  return {
    P2Data,
    P2Accumulated,
    PkoData,
    PkoAccumulated,
    PkcData,
    PkcAccumulated,
    P2AvgProduction,
    PkoAvgProduction,
    PkcAvgProduction,
    extra_tooltip_data
  };
};
