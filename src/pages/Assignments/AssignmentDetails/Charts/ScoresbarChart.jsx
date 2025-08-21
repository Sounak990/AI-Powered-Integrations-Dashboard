// ScoresBarChart.jsx

import React from "react";
import ReactEcharts from "echarts-for-react";
import getChartColorsArray from "../../../../components/Common/ChartsDynamicColor";
import { assigneeScores } from "../dummyData";

const ScoresBarChart = ({ dataColors }) => {
  const chartColors = getChartColorsArray(dataColors);

  // Filter out assignees who haven't completed the assignment or don't have a score
  const completedAssignees = assigneeScores.filter(assignee => assignee.completed && assignee.score !== null);

  // Extract names and scores
  const names = completedAssignees.map(assignee => assignee.name);
  const scores = completedAssignees.map(assignee => assignee.score);

  const options = {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
    },
    xAxis: {
      type: "category",
      data: names,
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: scores,
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

export default ScoresBarChart;
