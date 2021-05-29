import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const duration = 500;

const TreeMapCanvas = ({ width, height, data }) => {
  const margin = { top: 0, right: 0, bottom: 0, left: 3 };
  const innerHeight = height - margin.top - margin.bottom;
  const innerWidth = width - margin.left - margin.right;
  let svg;
  const ref = useRef();

  useEffect(() => {
    svg = d3
      .select(ref.current)
      .attr("width", width)
      .attr("height", innerHeight)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);
  }, []);

  useEffect(() => {
    drawChart();
  }, []);

  const drawChart = () => {
    var root = d3.hierarchy(data).sum(function (d) {
      return d.value;
    });

    d3.treemap().size([width, height]).paddingTop(28).paddingRight(6).paddingInner(3)(
      // Padding between each rectangle
      //.paddingOuter(6)
      //.padding(20)
      root
    );

    var color = d3
      .scaleOrdinal()
      .domain(["Crypto", "Angry Sentiment", "Positive Sentiment"])
      .range(["#99CCCC", "#99CC99", "#FF99CC"]);

    var opacity = d3.scaleLinear().domain([10, 30]).range([0.5, 1]);

    svg
      .selectAll("rect")
      .data(root.leaves())
      .enter()
      .append("rect")
      .attr("x", function (d) {
        return d.x0;
      })
      .attr("y", function (d) {
        return d.y0;
      })
      .attr("width", function (d) {
        return d.x1 - d.x0;
      })
      .attr("height", function (d) {
        return d.y1 - d.y0;
      })
      .style("stroke", "black")
      .style("fill", function (d) {
        return color(d.parent.data.name);
      })
      .style("opacity", function (d) {
        return opacity(d.data.value);
      });

    svg
      .selectAll("text")
      .data(root.leaves())
      .enter()
      .append("text")
      .attr("x", function (d) {
        return d.x0 + 5;
      }) // +10 to adjust position (more right)
      .attr("y", function (d) {
        return d.y0 + 20;
      }) // +20 to adjust position (lower)
      .text(function (d) {
        return d.data.name.replace("mister_", "");
      })
      .attr("font-size", "19px")
      .attr("fill", "white");

    svg
      .selectAll("vals")
      .data(root.leaves())
      .enter()
      .append("text")
      .attr("x", function (d) {
        return d.x0 + 5;
      }) // +10 to adjust position (more right)
      .attr("y", function (d) {
        return d.y0 + 35;
      }) // +20 to adjust position (lower)
      .text(function (d) {
        return d.data.value;
      })
      .attr("font-size", "11px")
      .attr("fill", "white");

    svg
      .selectAll("titles")
      .data(
        root.descendants().filter(function (d) {
          return d.depth == 1;
        })
      )
      .enter()
      .append("text")
      .attr("x", function (d) {
        return d.x0;
      })
      .attr("y", function (d) {
        return d.y0 + 21;
      })
      .text(function (d) {
        return d.data.name;
      })
      .attr("font-size", "19px")
      .attr("fill", function (d) {
        return color(d.data.name);
      });
  };

  return (
    <div className="chart" id="chart">
      <svg ref={ref}></svg>
    </div>
  );
};

export const TreeMapPanel = () => {
  const width = 1024 - 30;

  const data = {
    children: [
      {
        name: "Crypto",
        children: [
          { name: "BIT", group: "BIT", value: 28, colname: "level3" },
          { name: "ETH", group: "ETH", value: 19, colname: "level3" },
          { name: "DOGE", group: "DOGE", value: 18, colname: "level3" },
          { name: "XRP", group: "XRP", value: 19, colname: "level3" },
        ],
        colname: "level2",
      },
      {
        name: "Angry Sentiment",
        children: [
          { name: "MSFT", group: "MSFT", value: 14, colname: "level3" },
          { name: "ARM", group: "ARM", value: 11, colname: "level3" },
          { name: "INTL", group: "INTL", value: 15, colname: "level3" },
          { name: "AMZN", group: "AMZN", value: 16, colname: "level3" },
        ],
        colname: "level2",
      },
      {
        name: "Positive Sentiment",
        children: [
          { name: "DARE", group: "DARE", value: 10, colname: "level3" },
          { name: "ARKS", group: "ARKS", value: 13, colname: "level3" },
          { name: "ERIC", group: "ERIC", value: 13, colname: "level3" },
          { name: "OKS", group: "OKS", value: 25, colname: "level3" },
          { name: "ERR", group: "ERR", value: 16, colname: "level3" },
          { name: "WAT", group: "WAT", value: 28, colname: "level3" },
        ],
        colname: "level2",
      },
    ],
    name: "Keywords",
  };

  return (
    <div className="GraphPanal">
      <TreeMapCanvas width={width} height={width / 1.9} data={data} />
    </div>
  );
};
