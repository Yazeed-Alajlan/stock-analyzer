import React from "react";
import Heatmap from "react-heatmap-grid";
import { CustomCard } from "../cards/CustomCard";

const HeatmapChart = ({ data }) => {
  const xLabels = Object.keys(data);
  const yLabels = Object.keys(data);

  const heatmapData = Object.values(data).map((row) => Object.values(row));

  return (
    <CustomCard header={"Heatmap"}>
      <Heatmap
        xLabels={xLabels}
        yLabels={yLabels}
        data={heatmapData}
        xLabelWidth={60}
        cellRender={(value) => <div>{value}</div>}
        cellStyle={(background, value, min, max, data, x, y) => ({
          background: `rgb(0, 151, 230, ${1 - (max - value) / (max - min)})`,
          fontSize: "11px",
        })}
      />
    </CustomCard>
  );
};

export default HeatmapChart;
