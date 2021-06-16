import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { group } from "d3";

const duration = 500;

const GetTopTickers = (sentiment) => {
  const [data, setData] = useState([]);
  const call = "/getTopSentiment";
  useEffect(() => {
    fetch(call, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sentiment: sentiment,
        long: 31,
        short: 7,
      }),
    }).then((response) => {
      response.json().then((data) => {
        const toSet = [];
        for (const ticker of data) {
          toSet.push({
            name: ticker.ticker,
            group: ticker.ticker,
            value: ticker.short_count,
            op: ticker.short_count / ticker.long_count,
            colname: "level3",
          });
        }
        setData(toSet);
      });
    });
  }, []);

  return data;
};

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

    if (
      data.children[0].children.length !== 0 &&
      data.children[1].children.length !== 0 &&
      data.children[2].children.length !== 0 &&
      data.children[3].children.length !== 0 &&
      data.children[4].children.length !== 0 &&
      data.children[5].children.length !== 0 &&
      data.children[6].children.length !== 0
    ) {
      drawChart();
    }
  }, [data]);

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
      .domain(["Joy", "Fear", "Anger", "Sadness", "Confident", "Tentative", "Analytical", "None"])
      .range(["#FF3333", "#336699", "#993366", "#339933", "#FF6633", "#FF99CC", "#99CCCC", "#333333"]);

    var opacity = d3.scaleLinear().domain([0, 2]).range([0.5, 1]);

    // create a tooltip
    var Tooltip = d3
      .select("#treechart")
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
      Tooltip.html(d.data.name + "<br>" + d.value + " mentions" + "<br>" + d.data.op + " sentiment")
        .style("left", d3.pointer(event)[0] + 80 + "px")
        .style("top", d3.pointer(event)[1] + "px");
    };

    var mouseleave = function (d) {
      Tooltip.style("opacity", 0);
    };

    svg
      .selectAll("rect")
      .data(root.leaves())
      .enter()
      .append("rect")
      .on("mouseover", mouseover) // What to do when hovered
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)
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
      .style("stroke", "#222222")
      .style("fill", function (d) {
        return color(d.parent.data.name);
      })
      .style("opacity", function (d) {
        return opacity(d.data.op);
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
      .attr("font-size", function (d) {
        return d.x1 - d.x0 < 55 || d.y1 - d.y0 < 20 ? "0px" : "18px";
      })
      .attr("fill", "#222222");

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
      .attr("font-size", function (d) {
        return d.x1 - d.x0 < 55 || d.y1 - d.y0 < 40 ? "0px" : "12px";
      })
      .attr("fill", "#222222");

    svg
      .selectAll("titles")
      .data(
        root.descendants().filter(function (d) {
          return d.depth === 1;
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
    <div className="treechart" id="treechart">
      <svg ref={ref}></svg>
    </div>
  );
};

export const TreeMapPanel = () => {
  const width = 1024 - 30;

  const joy = GetTopTickers("joy");
  const fear = GetTopTickers("fear");
  const anger = GetTopTickers("anger");
  const sadness = GetTopTickers("sadness");
  const confident = GetTopTickers("confident");
  const tentative = GetTopTickers("tentative");
  const analytical = GetTopTickers("analytical");

  const data2 = {
    children: [
      {
        name: "Joy",
        children: joy,
        colname: "level2",
      },
      {
        name: "Fear",
        children: fear,
        colname: "level2",
      },
      {
        name: "Anger",
        children: anger,
        colname: "level2",
      },
      {
        name: "Sadness",
        children: sadness,
        colname: "level2",
      },
      {
        name: "Confident",
        children: confident,
        colname: "level2",
      },
      {
        name: "Tentative",
        children: tentative,
        colname: "level2",
      },
      {
        name: "Analytical",
        children: analytical,
        colname: "level2",
      },
    ],
  };

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
      <TreeMapCanvas width={width} height={width} data={data2} />
    </div>
  );
};
