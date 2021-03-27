import * as React from "react";
import {Line} from "react-chartjs-2";
import {useEffect, useState} from "react";
import numeral from "numeral";
import "leaflet/dist/leaflet.css";

const options = {
  style:{
    height: 400
  },
  legend: {
    display: false,
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  maintainAspectRatio: false,
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.value).format("+0,0");
      },
    },
  },
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          format: "MM/DD/YY",
          tooltipFormat: "ll",
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          // Include a dollar sign in the ticks
          callback: function (value, index, values) {
            return numeral(value).format("0a");
          },
        },
      },
    ],
  },
};

export const LineGraph = ({casesType}) => {

  const [data, setData] = useState({})

  useEffect(() => {
    const fetchData = async () => await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120").then(response => response.json()).then(data => {
      let chartData = buildChartData(data, casesType);
      setData(chartData);
    })
    fetchData();
  }, [casesType])

  const buildChartData = (data, casesType = "cases") => {
    const chartData = [];
    let lastDataPoint;

    for (let date in data.cases) {
      if (lastDataPoint) {
        let newDataPoint = {
          x: date,
          y: data[casesType][date] - lastDataPoint
        }
        chartData.push(newDataPoint);
      }
      lastDataPoint = data[casesType][date];
    }
    return chartData;
  }

  return (
    <div>
      {data?.length > 0 && <Line options={options} data={{datasets: [{data: data, backgroundColor: casesType==="cases" ? "crimson" : casesType==="recovered" ? "green": "black"}]}}/>}
    </div>
  )
}