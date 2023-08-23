import React from "react";
import { OverlayTrigger, Card } from "react-bootstrap";
import { Bar } from "react-chartjs-2";

const HoverGraph = ({ text, data, years }) => {
  const chartData = {
    labels: years,
    datasets: [
      {
        label: "Data",
        data: data.map((value) => parseFloat(value.replace(/,/g, ""))),
        fill: false,
        borderColor: "rgba(75,192,192,1)",
        lineTension: 0.1,
      },
    ],
  };
  // Configure chart options
  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };
  const renderTooltip = (props) => (
    <Card className="w-25" {...props}>
      <Bar data={chartData} options={chartOptions} />
    </Card>
  );

  return (
    <OverlayTrigger placement="right" overlay={renderTooltip}>
      <div className="hover-div">{text}</div>
    </OverlayTrigger>
  );
};

export default HoverGraph;
