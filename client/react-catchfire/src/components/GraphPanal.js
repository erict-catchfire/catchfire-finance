import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setStartEndLineGraph,
  setDataMinMaxLineGraph,
} from "../../actions/index";
import { TimePeriodSelect } from "./TimePeriodSelect";
import * as d3 from "d3";
import * as d3s from 'd3-selection';

const duration = 500;

const LineChart = ({ width, height, data}) => {
  const margin    = { top: 0, right: 50, bottom: 100, left: 50 };
  const margin2   = { top: height, right: 50, bottom: 20, left: 50 };

  const innerHeight  = height - margin.top - margin.bottom;
  const innerHeight2 = height - margin2.top - margin2.bottom;
  const innerWidth   = width - margin.left - margin.right;

  const ref = useRef();

  useEffect(() => {
    d3.select(ref.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);
  }, [])

  useEffect(() => {
    if (data != null)
      drawChart();
  }, [data])

  const drawChart = () => {
      const svg = d3.select(ref.current);
      const chart = svg.select("g");

      const xScale = d3.scaleTime()
        .domain(d3.extent(data, d => d.time))
        .range([0, innerWidth])

      const xScale2 = d3.scaleTime()
        .domain(d3.extent(data, d => d.time))
        .range([0, innerWidth])

      const yScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.data))
        .range([innerHeight, 0])

      const yScale2 = d3.scaleLinear()
        .domain(d3.extent(data, d => d.data))
        .range([innerHeight2, 0])



      const yAxis = d3.axisLeft().ticks(5).scale(yScale);
      chart
        .selectAll(".y.axis")
        .data([null])
        .join("g")
        .classed("y axis", true)
        .attr("transform", "translate(0,0)")
        .transition()
        .duration(duration)
        .call(yAxis)

      const xAxis = d3.axisBottom().scale(xScale);
      chart
        .selectAll(".x.axis")
        .data([null])
        .join("g")
        .classed("x axis", true)
        .attr("transform", "translate(0,"+innerHeight+")")
        .transition()
        .duration(duration)
        .call(xAxis)

      function update(data) {
          console.log("HERE")
          const u = chart.selectAll(".line")
            .data([data])

          u.enter()
            .append("path")
            .attr("class", "line")
            .merge(u)
            .transition()
            .duration(duration)
            .attr("d", d3.line()
              .x(d => xScale(d.time))
              .y(d => yScale(d.data))
              )
              .attr("stroke", "black")
              .style("stroke-width", 1)
              .style("fill", "none")
      }

      update(data)
  }

  return (
    <div className="chart">
      <svg ref={ref}></svg>
    </div>
  )
};

export const GraphPanal = () => {
  const dataItems = useSelector((state) => state.dataCollection);
  const dataKeys = Object.keys(dataItems);

  // Lol Magic Numbers
  const width = 1024 - 30;

  return (
    <div className="GraphPanal">
      <LineChart
        width={width}
        height={width / 1.9}
        data={(dataItems.length === 0) ? null : dataItems[dataKeys[0]]}
      />
    </div>
  );
};
