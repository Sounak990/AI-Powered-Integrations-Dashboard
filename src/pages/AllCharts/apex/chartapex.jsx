import React from "react";
import ReactApexChart from "react-apexcharts";
import getChartColorsArray from "../../../components/Common/ChartsDynamicColor";

const chartapex = ({ dataColors, scenariosData }) => {
  const apaexlineChartColors = getChartColorsArray(dataColors);
  const data = scenariosData;
  console.log('DATA:', data);

  if (!scenariosData || !scenariosData.data || !Array.isArray(scenariosData.data)) {
    console.error('scenariosData is not valid:', scenariosData);
    return <p>Error: Invalid data format.</p>; // Error message or similar
  }

  if (scenariosData.data.length === 0) {
    return <p>No data available to display.</p>; // Handling empty array
  }

  const mapGradeToNumber = (grade) => {
    switch (grade) {
      case 'A': return 5;
      case 'B': return 4;
      case 'C': return 3;
      case 'D': return 2;
      case 'F': return 1;
      default: return 0;
    }
  };

  let feedbackCategories = ['Situation', 'Pain', 'Impact', 'Critical Event', 'Decision', 'Tonality', 'Curiosity', 'Rudeness'];
  
  let series = scenariosData.data.map((item, index) => {
    if (!item.scenario_id || !item.feedback) {
      console.warn('Invalid item:', item);
      return null; // Skip invalid items
    }

    return {
      name: item.scenario_id,
      data: feedbackCategories.map(category => mapGradeToNumber(item.feedback[category]?.Grade)),
      colors: apaexlineChartColors[index % apaexlineChartColors.length]
    };
  }).filter(Boolean); // Filter out invalid items

  const options = {
    chart: {
      height: 380,
      type: "bar",
      zoom: {
        enabled: false
      },
      toolbar: {
        show: false
      },
      events: {
        dataPointSelection: function(event, chartContext, config) {
          console.log('Selected data:', data[config.dataPointIndex].conversation_id);
        }
      }
    },
    // colors: apaexlineChartColors,
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded',
      },
    },
    dataLabels: {
      enabled: false // Disabling the data labels inside the bars
    },
    xaxis: {
      categories: feedbackCategories,
      title: {
        text: 'Feedback Categories'
      }
    },
    yaxis: {
      title: {
        text: "Grades",
        offsetX: 10
      },
      min: 0,
      max: 5,
      tickAmount: 5,
      labels: {
        formatter: (val) => {
          const grades = ['F', 'D', 'C', 'B', 'A'];
          const index = Math.round(val) - 1;
          return grades[index] ? grades[index] : '';
        }
      },
    },
    tooltip: {
      y: {
        formatter: function(val, { seriesIndex }) {
          // Ensure the index is within the range and data is available
          if (seriesIndex < data.length && data[seriesIndex].conversation_id) {
            return `Conversation ID: ${data[seriesIndex].conversation_id}`;
          }
          return ''; // Return empty if data isn't available
        }
      },
      // Adjusting tooltip position
      fixed: {
        enabled: true, // Enable fixed position to ensure it doesn't go off-chart
        position: 'topRight', // Can adjust as per requirement
        offsetX: 80, // Adjust offset to ensure visibility
        offsetY: 30,
      },
      style: {
        fontSize: '12px',
        fontFamily: undefined
      },
      // Make sure to use HTML-based tooltips
      x: { 
        show: true,
        format: 'dd MMM',
        formatter: undefined,
      },
      fixed: {
        enabled: false,
        position: 'topRight',
        offsetX: 0,
        offsetY: 0,
      },
      style: {
        fontSize: '12px',
        fontFamily: undefined
      },
    },
    fill: {
      opacity: 1
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
      floating: true,
      offsetY: -25,
      offsetX: -5
    },
    responsive: [
      {
        breakpoint: 600,
        options: {
          chart: {
            toolbar: {
              show: false,
            },
          },
          legend: {
            show: false,
          },
        },
      },
    ],
  };

  return (
    <ReactApexChart
      options={options}
      series={series}
      type="bar"
      height="380"
      className="apex-charts"
    />
  );
};

export default chartapex;
