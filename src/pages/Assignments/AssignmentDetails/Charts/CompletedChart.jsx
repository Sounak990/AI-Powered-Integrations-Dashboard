// CompletedChart.jsx

import React from "react";
import ReactEcharts from "echarts-for-react";
import getChartColorsArray from "../../../../components/Common/ChartsDynamicColor";
import { assigneeScores } from "../dummyData";

const CompletedChart = ({ dataColors }) => {
  const chartColors = getChartColorsArray(dataColors);

  const completedCount = assigneeScores.filter(assignee => assignee.completed).length;

  const options = {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
    },
    xAxis: {
      type: "category",
      data: ["Completed"],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: [completedCount],
        type: "bar",
        itemStyle: { color: chartColors[0] },
      },
    ],
  };

  return (
    <React.Fragment>
      <ReactEcharts style={{ height: "350px" }} option={options} />
    </React.Fragment>
  );
};

export default CompletedChart;
