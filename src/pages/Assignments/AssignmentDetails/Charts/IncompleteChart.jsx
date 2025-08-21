// IncompleteChart.jsx

import React from "react";
import ReactEcharts from "echarts-for-react";
import getChartColorsArray from "../../../../components/Common/ChartsDynamicColor";
import { assigneeScores } from "../dummyData";

const IncompleteChart = ({ dataColors }) => {
  const chartColors = getChartColorsArray(dataColors);

  const incompleteCount = assigneeScores.filter(assignee => !assignee.completed).length;

  const options = {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
    },
    xAxis: {
      type: "category",
      data: ["Incomplete"],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: [incompleteCount],
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

export default IncompleteChart;
