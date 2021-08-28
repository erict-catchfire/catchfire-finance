import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const GetWords = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/api/getWords", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ days: 14 }),
    }).then((response) => {
      response.json().then((data) => {
        const toSet = [];
        for (const word of data) {
          toSet.push({
            word: word.word,
            count: word.count,
            sentiment: word.sentiment,
            amount: word.amount,
          });
        }
        setData(toSet);
      });
    });
  }, []);

  return data;
};

const WordCloudCanvas = ({ width, height, data }) => {
  const margin = { top: 15, right: 25, bottom: 100, left: 25 };

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
  }, [data]);

  const drawChart = () => {
    const svg = d3.select(ref.current).append("svg").attr("width", width).attr("height", height);

    const maxAmount = Math.max.apply(
      Math,
      data.map((o) => o.amount)
    );
    const maxCount = Math.max.apply(
      Math,
      data.map((o) => o.count)
    );

    // TODO: Limit by height/50
    const size = d3.scaleSqrt().domain([0, maxCount]).range([7, 80]);

    const opacity = d3.scaleLinear().domain([0, maxAmount]).range([0, 1]);

    var color = d3
      .scaleOrdinal()
      .domain(["joy", "fear", "anger", "sadness", "confident", "tentative", "analytical", "none"])
      .range(["#FF3333", "#336699", "#993366", "#339933", "#FF6633", "#FF99CC", "#99CCCC", "#333333"]);

    var sentText = d3
      .scaleOrdinal()
      .domain(["joy", "fear", "anger", "sadness", "confident", "tentative", "analytical", "none"])
      .range(["Joy", "Fear", "Anger", "Sadness", "Confident", "Tentative", "Analytical", "None"]);

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
      Tooltip.html(d.word + "<br>" + d.count + " mentions" + "<br>" + sentText(d.sentiment) + " sentiment")
        .style("left", d3.pointer(event)[0] + 20 + "px")
        .style("top", d3.pointer(event)[1] + "px");
    };
    var mouseleave = function (d) {
      Tooltip.style("opacity", 0);
    };

    const node = svg
      .append("g")
      .attr("stroke", "#222222")
      .style("stroke-width", 1)
      .selectAll(".circle")
      .data(data)
      .enter()
      .append("g")
      .classed("circle", true);

    node
      .append("circle")
      .attr("class", "node")
      .attr("r", function (d) {
        return size(d.count);
      })
      .style("fill", function (d) {
        return color(d.sentiment);
      })
      .style("fill-opacity", (d) => opacity(d.amount))
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

    node
      .append("text")
      .attr("alignment-baseline", "middle")
      .attr("fill-opacity", 1)
      .attr("fill", "#222222")
      .attr("stroke-width", 0)
      .attr("text-anchor", "middle")
      .attr("font-size", function (d) {
        return size(d.count) / ((size(d.count) * 9) / 100);
      })
      .attr("dy", function (d) {
        return size(d.count) / ((size(d.count) * 25) / 100);
      })
      .text((d) => d.word);

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
          .strength(0.1)
          .x(width * 0.5)
      )
      .force(
        "forceY",
        d3
          .forceY()
          .strength(0.1)
          .y(height * 0.5)
      )
      .force(
        "center",
        d3
          .forceCenter()
          .x(width * 0.5)
          .y(height * 0.5)
      )
      .force("charge", d3.forceManyBody().strength(-125));

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
            return size(d.count) + 1;
          })
          .iterations(1)
      )
      .on("tick", function (d) {
        svg.selectAll("text").attr("transform", (d) => "translate(" + d.x + "," + d.y + ")");
        svg
          .selectAll("circle")
          .attr("cx", function (d) {
            return d.x;
          })
          .attr("cy", function (d) {
            return d.y;
          });
      });

    // What happens when a circle is dragged?
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.01).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0.01);
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

  const APIdata = GetWords();

  return (
    <div className="GraphPanal">
      <WordCloudCanvas width={width} height={width / 1.5} data={APIdata} />
    </div>
  );
};
