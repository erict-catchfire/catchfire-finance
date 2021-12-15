import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const GetTopTickers = (sentiment) => {
  const [data, setData] = useState({});
  const call = "/api/getTopSentiment";
  useEffect(() => {
    fetch(call, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sentiment: sentiment,
        long: 7,
        short: 1,
      }),
    }).then((response) => {
      response.json().then((data) => {
        const toDict = {};
        for (const top_sentiment in data) {
          const toSet = [];
          for (const top_ticker_data of data[top_sentiment]) {
            toSet.push({
              name: top_ticker_data.ticker,
              group: top_ticker_data.ticker,
              value: top_ticker_data.short_count,
              op: top_ticker_data.short_count / top_ticker_data.long_count,
              colname: "level3",
            });
          }
          toDict[top_sentiment] = toSet;
        }
        setData(toDict);
      });
    });
  }, []);
  return data;
};

const TreeMapCanvas = ({ width, height, data }) => {
  const margin = { top: 0, right: 0, bottom: -55, left: 3 };
  const innerHeight = height - margin.top - margin.bottom;
  let svg;
  const ref = useRef();

  useEffect(() => {
    svg = d3
      .select(ref.current)
      .attr("width", width)
      .attr("height", innerHeight)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const loadChart = data.children.every((child) => child.children != undefined && child.children.length !== 0);
    if (loadChart) {
      drawChart();
    }
  }, [data]);

  const drawChart = () => {
    const root = d3.hierarchy(data).sum(function (d) {
      return d.value;
    });

    d3.treemap().size([width, height]).paddingTop(28).paddingRight(6).paddingInner(3)(
      root
    );

    const color = d3
      .scaleOrdinal()
      .domain(["Joy", "Fear", "Anger", "Sadness", "Confident", "Tentative", "Analytical", "None"])
      .range(["#339933", "#336699", "#993366", "#FF9090", "#FF6633", "#FF99CC", "#99CCCC", "#333333"]);

    const opacity = d3.scaleLinear().domain([0, 1]).range([0.3, 1]);

    // create a tooltip
    const Tooltip = d3
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
    const mouseover = function (d) {
      Tooltip.style("opacity", 1);
    };

    const mousemove = function (event, d) {
      Tooltip.html(
        d.data.name + "<br>" + d.value + " mentions" + "<br>" + Math.round(d.data.op * 100) / 100 + " S/L Ratio"
      )
        .style("left", d3.pointer(event)[0] + 80 + "px")
        .style("top", d3.pointer(event)[1] + "px");
    };

    const mouseleave = function (d) {
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
      .attr("class", "diagram-text")
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
      .attr("class", "diagram-text")
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
  const all = GetTopTickers("all");
  const joy = all['joy'];
  const fear = all['fear'];
  const anger = all['anger'];
  const sadness = all['sadness'];
  const confident = all['confident'];
  const tentative = all['tentative'];
  const analytical = all['analytical'];

  // const joy = GetTopTickers("joy")["joy"];
  // const fear = GetTopTickers("fear")["fear"];
  // const anger = GetTopTickers("anger")["anger"];
  // const sadness = GetTopTickers("sadness")["sadness"];
  // const confident = GetTopTickers("confident")["confident"];
  // const tentative = GetTopTickers("tentative")["tentative"];
  // const analytical = GetTopTickers("analytical")["analytical"];

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

  return (
    <div className="GraphPanal">
      <TreeMapCanvas width={width} height={width} data={data2} />
    </div>
  );
};
