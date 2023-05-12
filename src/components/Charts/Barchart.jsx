import React, { useRef, useEffect, useState } from "react";
import Chart from 'chart.js/auto'
import { buildScales, buildLegend, updated, filteredByNFA } from '../../Utils/ReusableSyntax'
// import { AuthContext } from '../../Context/auth'
// import { TransactionContext } from '../../Context/TransactionProvider'
import { backgroundColor, borderColor, Months } from "../../Utils/index";

const Analytics = ({
  dataArray,
  width,
  height,
  axes,
  legend,
  chartType,
}) => {
  const [getQuarter, setQuarter] = useState("Q1");
  const procurement = useRef(null);

  // const { finishTransaction } = useContext(TransactionContext);
  // const context = useContext(AuthContext)

  // const filtered = filteredByNFA(finishTransaction, context);

  // const grouped = Array.from(
  //   filtered.reduce(
  //     (m, { date_format, total, date_created }) => m.set((date_format), (m.get(date_format) || 0) + total),
  //     new Map
  //   ).entries()
  // );

  const updatedData = updated(dataArray);

  const quarterFilter = updatedData.filter((obj) => obj.quarter === getQuarter)

  const barChart = () => {
    const ctx = procurement.current;
    const sortTypes = "total";

    //*Sort data from highest to lowest
    // const sortedData = updatedData.sort(
    //     (a, b) => a[sortTypes] - b[sortTypes]
    // );

    const sortedDate = quarterFilter.sort((a, b) => {
      return a.date_created.seconds - b.date_created.seconds;
    });


    const labels = sortedDate.map((labels) => {
      const date = new Date(labels.date_created.seconds * 1000).toISOString().substring(0, 10);
      //return Months[date.getMonth()]
      const getDate = new Date(date);

      return Months[getDate.getMonth()];
    })

    const data = quarterFilter.map((data) => data[sortTypes]);

    const cumulativeSum = (sum => value => sum += value)(0);

    const cumulativeResult = data.map(cumulativeSum)


    if (data.length > 0) {
      const textTitle = "Procurement Chart";
      var myBarChart = new Chart(ctx, {
        data: {
          labels,
          datasets: [
            {
              type: chartType,
              data,
              backgroundColor,
              borderColor,
              borderWidth: 1,
            },
            {
              type: "line",
              data: cumulativeResult,
              backgroundColor,
              borderColor,
              borderWidth: 1,
            }
          ]
        },
        options: {
          plugins: {
            scales: buildScales(axes),
            legend: buildLegend(legend),
            title: {
              display: false,
              text: textTitle,
              fontSize: 25,
            },
          },
        }
      });

      return () => {
        myBarChart.destroy()
      }
    }
  }

  useEffect(barChart, [getQuarter]);

  const listQuarter = ["Q1", "Q2", "Q3", "Q4"]

  return (
    <div className="container mx-auto px-8 py-6 sm:block hidden bg-white rounded-lg">
      <div className="mt-2 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary">Procurement Chart</h1>
        <div className="flex items-center gap-2">
          <label
            className="block text-gray-700 text-lg font-semibold"
          >
            Filter
          </label>
          <select name="quarter" value={getQuarter} onChange={(event) => setQuarter(event.target.value)} className="block w-full h-10 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            {listQuarter.map((quarter) => (
              <option value={quarter}>{quarter}</option>
            ))}
          </select>
        </div>
      </div>
      {quarterFilter.length === 0 && (
        <div className="text-center my-10">
          <span className="opacity-50 text-primary text-xl font-bold">No data this quarter</span>
        </div>
      )}
      <div className="">
        <canvas ref={procurement} height={width} width={height} key={dataArray.length} />
      </div>
    </div>
  );
};

export default Analytics;
