import { useEffect, useRef } from "react";
import {
  createChart, // ChartOptions
  CrosshairMode,
} from "lightweight-charts";

const chartSettings = {
  width: 600,
  height: 300,
  layout: {
    backgroundColor: "#000000",
    textColor: "rgba(255, 255, 255, 0.9)",
  },
  grid: {
    vertLines: {
      color: "rgba(197, 203, 206, 0.5)",
    },
    horzLines: {
      color: "rgba(197, 203, 206, 0.5)",
    },
  },
  crosshair: {
    mode: CrosshairMode.Normal,
  },
  priceScale: {
    borderColor: "rgba(197, 203, 206, 0.8)",
  },
  timeScale: {
    borderColor: "rgba(197, 203, 206, 0.8)",
    barSpacing: 15,
    // fixLeftEdge: true,
  },
};

function Charts() {
  const chartElRefs = [useRef(null), useRef(null), useRef(null)];
  const chartRefs = [useRef(), useRef(), useRef()];

  useEffect(() => {
    if (chartElRefs.find((r) => !r.current)) {
      return;
    }

    chartElRefs.forEach((cr, i) => {
      chartRefs[i].current = createChart(cr.current, chartSettings);
      // add data
      chartRefs[i].current?.addLineSeries().setData([
        { time: "2019-04-11", value: 80.01 },
        { time: "2019-04-12", value: 96.63 },
        { time: "2019-04-13", value: 76.64 },
        { time: "2019-04-14", value: 81.89 },
        { time: "2019-04-15", value: 74.43 },
        { time: "2019-04-16", value: 80.01 },
        { time: "2019-04-17", value: 96.63 },
        { time: "2019-04-18", value: 76.64 },
        { time: "2019-04-19", value: 81.89 },
        { time: "2019-04-20", value: 74.43 },
      ]);
    });

    const charts = chartRefs.map((c) => c.current);
    // sync charts
    charts.forEach((chart) => {
      if (!chart) {
        return;
      }
      chart.timeScale().subscribeVisibleTimeRangeChange((e) => {
        charts
          .filter((c) => c !== chart)
          .forEach((c) => {
            c.timeScale().applyOptions({
              rightOffset: chart.timeScale().scrollPosition(),
            });
          });
      });
      chart.timeScale().subscribeVisibleLogicalRangeChange((range) => {
        if (range) {
          charts
            .filter((c) => c !== chart)
            .forEach((c) => {
              c.timeScale().setVisibleLogicalRange({
                from: range?.from,
                to: range?.to,
              });
            });
        }
      });
    });
  }, []);

  return (
    <div className="App">
      {chartElRefs.map((ref, i) => (
        <div
          ref={ref}
          id={`chart_${i}`}
          key={`chart_${i}`}
          style={{ borderBottom: "1px solid transparent" }}
        />
      ))}
    </div>
  );
}

export default Charts;
