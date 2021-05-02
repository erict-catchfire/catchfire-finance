import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setStartEndLineGraph
} from "../../actions/index";
import * as d3 from "d3";
import { values } from "d3-collection";

const duration = 500;

const LineChart = ({ width, height, data }) => {
  const limits = useSelector((state) => state.lineGraph);
  const controlItems = useSelector((state) => state.dataLine);
  const dispatch = useDispatch();

  const margin = { top: 15, right: 25, bottom: 100, left: 25 };
  const margin2 = {
    top: height - margin.top - margin.bottom + 45,
    right: 25,
    bottom: 40,
    left: 25,
  };

  const innerHeight = height - margin.top - margin.bottom;
  const innerHeight2 = height - margin2.top - margin2.bottom;
  const innerWidth = width - margin.left - margin.right;

  const ref = useRef();

  useEffect(() => {
    d3.select(ref.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);
  }, []);

  useEffect(() => {
    const svg = d3.select(ref.current);
    const brush = svg.select(".context").select(".brush");
    const chart = svg.select("g");
    const context = svg.select(".context");

    const dataKeys = Object.keys(data);

    if (Object.keys(data).length !== 0) {      
      const chLines = chart
      .selectAll(".line")
      .each(
        function(){ 
          if(!dataKeys.includes(this.id)) {
           this.remove();
          }
        }
      ) 
      const cLines = context
      .selectAll(".line")
      .each(
        function(){ 
          if(!dataKeys.includes(this.id)) {
           this.remove();
          }
        }
      ) 

      drawChart(limits.valid, limits.start, limits.end);
    } else {
        const chLines = chart
        .selectAll(".line")
        .each(
          function(){ 
             this.remove();
          }
        ) 
        const cLines = context
        .selectAll(".line")
        .each(
          function(){ 
             this.remove();
          }
        )       
  }}, [data, controlItems]);

  const drawChart = (valid, start, end) => {
     const svg = d3.select(ref.current);
     const clip = svg
       .append("defs")
       .append("svg:clipPath")
       .attr("id", "clip")
       .append("svg:rect")
       .attr("width", innerWidth)
       .attr("height", innerHeight)
       .attr("x", 0)
       .attr("y", 0);

     const chart = svg.select("g");

     let xValues = [];
     let yValues = [];

     const dataKeys = Object.keys(data).sort();

     dataKeys.forEach( d => {
        xValues.push(d3.min(data[d], entry => entry.time))
        xValues.push(d3.max(data[d], entry => entry.time))
        yValues.push(d3.min(data[d], entry => entry.data))
        yValues.push(d3.max(data[d], entry => entry.data))
      }
     )
     
     const minX = d3.min(xValues);
     const maxX = d3.max(xValues);
     const minY = d3.min(yValues);
     const maxY = d3.max(yValues);

     const xScale = d3
       .scaleTime()
       .domain([minX, maxX])
       .range([0, innerWidth]);

     const xScale2 = d3
       .scaleTime()
       .domain([minX, maxX])
       .range([0, innerWidth]);

     const yScale = d3
       .scaleLinear()
       .domain([minY, maxY])
       .range([innerHeight, 0]);

     const yScale2 = d3
       .scaleLinear()
       .domain([minY, maxY])
       .range([innerHeight2, 0]);

     svg.select(".context").select(".brush").remove();

     svg
       .append("g")
       .attr("class", "context")
       .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

     const context = svg.select(".context");

     const yAxis = d3.axisLeft().ticks(5).scale(yScale);
     chart
       .selectAll(".y.axis")
       .data([null])
       .join("g")
       .classed("y axis", true)
       .attr("transform", "translate(0,0)")
       .transition()
       .duration(duration)
       .call(yAxis);

     const xAxis = d3.axisBottom().scale(xScale);
     chart
       .selectAll(".x.axis")
       .data([null])
       .join("g")
       .classed("x axis", true)
       .attr("transform", "translate(0," + innerHeight + ")")
       .transition()
       .duration(duration)
       .call(xAxis);

     const xAxis2 = d3.axisBottom().scale(xScale2);
     context
       .selectAll(".x.axis")
       .data([null])
       .join("g")
       .classed("x axis", true)
       .attr("transform", "translate(0," + innerHeight2 + ")")
       .transition()
       .duration(duration)
       .call(xAxis2);

     const brushed = (event, d) => {
       const extent = event.selection;

       dispatch(
         setStartEndLineGraph(
           xScale2.invert(extent[0]),
           xScale2.invert(extent[1])
         )
       );

       xScale.domain([xScale2.invert(extent[0]), xScale2.invert(extent[1])]);
       chart
         .selectAll(".x.axis")
         .transition()
         .duration(duration / 10)
         .call(d3.axisBottom(xScale));

       chart
         .selectAll(".line")
         .transition()
         .attr("clip-path", "url(#clip)")
         .duration(duration / 10)
         .attr(
           "d",
           d3
             .line()
             .x((d) => xScale(d.time))
             .y((d) => yScale(d.data))
         );
     };

     const brush = d3
       .brushX()
       .extent([
         [0, -2],
         [innerWidth, innerHeight2+2],
       ])
       .on("brush end", brushed);

     if (valid) {
       context
         .append("g")
         .attr("class", "brush")
         .call(brush)
         .call(brush.move, [xScale2(start), xScale2(end)]);
     } else {
       context
         .append("g")
         .attr("class", "brush")
         .call(brush)
         .call(brush.move, xScale.range());
     }

     function update(data) {
      const u = chart
         .selectAll(".line")
         .data(data)
         .attr("clip-path", "url(#clip)");

      u.enter()
        .append("path")
        .attr("class", "line")
        .merge(u)
        .transition()
        .duration(duration)
        .attr("id", (d) => d.id)
        .attr(
          "d",
          d3
            .line()
            .x((d) => xScale(d.time))
            .y((d) => yScale(d.data))
        )
        .attr("stroke", (d) => controlItems[d.id].color)
        .style("stroke-width", 2)
        .style("fill", "none");
     }

    function updateContext(data) {
      const c = context
        .selectAll(".line")
        .data(data);

      c.enter()
        .append("path")
        .attr("class", "line")
        .merge(c)
        .transition()
        .duration(duration)
        .attr("id", (d) => d.id)
        .attr(
          "d",
          d3
            .line()
            .x((d) => xScale2(d.time))
            .y((d) => yScale2(d.data))
        )
        .attr("stroke", (d) => controlItems[d.id].color)
        .style("stroke-width", 1)
        .style("fill", "none");
    }

    update(values(data))
    updateContext(values(data))

    // Need to always clip at the end for some reason.
    chart
    .selectAll(".line")
    .attr("clip-path", "url(#clip)")  
  };

  return (
    <div className="chart">
      <svg ref={ref}></svg>
    </div>
  );
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
        data={dataItems}
      />
    </div>
  );
};
