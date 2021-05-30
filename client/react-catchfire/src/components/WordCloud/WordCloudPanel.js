import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const duration = 500;

const WordCloudCanvas = ({ width, height, data }) => {
  const margin = { top: 15, right: 25, bottom: 100, left: 25 };
  const innerHeight = height - margin.top - margin.bottom;
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
    drawChart();
  }, []);

  const drawChart = () => {
    const svg = d3.select(ref.current).append("svg").attr("width", width).attr("height", height);

    // Size scale for countries
    var size = d3.scaleLinear().domain([0, 5000]).range([7, 55]);

    // create a tooltip
    var Tooltip = d3
      .select("#chart")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "2px")
      .style("border-radius", "5px")
      .style("padding", "5px")
      .style("position", "absolute");

    // Three function that change the tooltip when user hover / move / leave a cell
    var mouseover = function (d) {
      Tooltip.style("opacity", 1);
    };
    var mousemove = function (event, d) {
      Tooltip.html("<u>" + d.word + "</u>" + "<br>" + d.count + " inhabitants")
        .style("left", d3.pointer(event)[0] + 20 + "px")
        .style("top", d3.pointer(event)[1] + "px");
    };
    var mouseleave = function (d) {
      Tooltip.style("opacity", 0);
    };

    const node = svg
      .append("g")
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "node")
      .attr("r", function (d) {
        return size(d.count);
      })
      .attr("cx", innerWidth / 2)
      .attr("cy", innerHeight / 2)
      .style("fill", "#FF9999") //function(d){ return color(d.region)})
      .style("fill-opacity", 0.8)
      .attr("stroke", "black")
      .style("stroke-width", 1)
      .on("mouseover", mouseover) // What to do when hovered
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)
      .call(
        d3
          .drag() // call specific function when circle is dragged
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)
      );

    // Features of the forces applied to the nodes:
    //const simulation = d3.forceSimulation()
    //    .force("center", d3.forceCenter().x(innerWidth / 2).y(innerHeight / 2)) // Attraction to the center of the svg area
    //    .force("charge", d3.forceManyBody().strength(.2)) // Nodes are attracted one each other of value is > 0
    //    .force("collide", d3.forceCollide().strength(.2).radius(function(d){ return (size(d.count)+3) }).iterations(1)) // Force that avoids circle overlappin

    const simulation = d3
      .forceSimulation()
      .force(
        "forceX",
        d3
          .forceX()
          .strength(0.2)
          .x(width * 0.5)
      )
      .force(
        "forceY",
        d3
          .forceY()
          .strength(0.2)
          .y(height * 0.5)
      )
      .force(
        "center",
        d3
          .forceCenter()
          .x(width * 0.5)
          .y(height * 0.5)
      )
      .force("charge", d3.forceManyBody().strength(-15));

    // Apply these forces to the nodes and update their positions.
    // Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
    simulation
      .nodes(data)
      .force(
        "collide",
        d3
          .forceCollide()
          .strength(0.5)
          .radius(function (d) {
            return size(d.count) + 3;
          })
          .iterations(1)
      )
      .on("tick", function (d) {
        node
          .attr("cx", function (d) {
            return d.x;
          })
          .attr("cy", function (d) {
            return d.y;
          });
      });

    // What happens when a circle is dragged?
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.03).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0.03);
      d.fx = null;
      d.fy = null;
    }
  };

  return (
    <div className="chart" id="chart">
      <svg ref={ref}></svg>
    </div>
  );
};

export const WordCloudPanal = () => {
  const width = 1024 - 30;

  const data = [
    {
      word: "HI",
      count: 900,
    },
    {
      word: "MY",
      count: 1900,
    },
    {
      word: "NAME",
      count: 300,
    },
    {
      word: "IS",
      count: 900,
    },
  ];

  return (
    <div className="GraphPanal">
      <WordCloudCanvas width={width} height={width / 1.9} data={data} />
    </div>
  );
};
