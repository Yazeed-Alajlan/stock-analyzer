// components/BarChart.js
import { Bar } from "react-chartjs-2";
import { Container } from "react-bootstrap";
import Chart from "chart.js/auto";

export const BarChart = ({ title, chartData }) => {
  return (
    <Container>
      <h2 className="text-center">{title}</h2>
      <Bar
        data={chartData}
        options={{
          plugins: {
            // title: {
            //   display: true,
            //   text: "Users Gained between 2016-2020",
            // },
            legend: {
              display: false,
            },
          },
        }}
      />
    </Container>
  );
};
