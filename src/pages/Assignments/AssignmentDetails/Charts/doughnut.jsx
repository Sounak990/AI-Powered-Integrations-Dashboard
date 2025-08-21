import React from "react";
import ReactEcharts from "echarts-for-react";

const Doughnut = ({ dataColors, data }) => {
  const chartOptions = {
    toolbox: {
      show: false,
    },
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b}: {c} ({d}%)",
    },
    legend: {
      orient: "vertical",
      x: "left",
      data: data.labels,
      textStyle: {
        color: ["#8791af"],
      },
    },
    color: dataColors,
    series: [
      {
        name: "Roleplay Completion",
        type: "pie",
        radius: ["50%", "70%"],
        avoidLabelOverlap: false,
        label: {
          normal: {
            show: false,
            position: "center",
          },
          emphasis: {
            show: true,
            textStyle: {
              fontSize: "30",
              fontWeight: "bold",
            },
          },
        },
        labelLine: {
          normal: {
            show: false,
          },
        },
        data: data.datasets[0].data.map((value, index) => ({
          value,
          name: data.labels[index],
        })),
      },
    ],
  };

  return (
    <React.Fragment>
      <ReactEcharts style={{ height: "350px" }} option={chartOptions} />
    </React.Fragment>
  );
};

export default Doughnut;
