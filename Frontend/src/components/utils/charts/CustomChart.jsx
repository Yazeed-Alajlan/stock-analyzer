import { Line } from "react-chartjs-2";
import { Container } from "react-bootstrap";
import Chart from "chart.js/auto";

export const CustomChart = ({ title, x_axis, y_axis }) => {
  // You can use x_axis and y_axis here to populate your chart data
  // For example, you can create chartData using x_axis and y_axis.

  const chartData = {
    labels: x_axis,
    datasets: [
      {
        label: "Your Y-Axis Label",
        data: y_axis,
        // Other dataset properties
      },
    ],
  };

  return (
    <Container>
      <h2 className="text-center">{title}</h2>
      <Line
        data={chartData}
        options={{
          plugins: {
            legend: {
              display: false,
            },
          },
        }}
      />
    </Container>
  );
};
