import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setStartEndLineGraph } from "../../actions/index";
import * as d3 from "d3";
import { values } from "d3-collection";

const duration = 500;

const colorNametoHex = {
  black: "black",
  red: "#FF3333",
  blue: "#336699",
  magenta: "#993366",
  green: "#339933",
  orange: "#FF6633",
  pink: "#FF99CC",
  cyan: "#99CCCC",
};

const dataNametoTitle = {
  joy_twitter_sentiment: "Joy Sentiment",
  fear_twitter_sentiment: "Fear Sentiment",
  anger_twitter_sentiment: "Anger Sentiment",
  sadness_twitter_sentiment: "Sadness Sentiment",
  confident_twitter_sentiment: "Confident Sentiment",
  tentative_twitter_sentiment: "Tentative Sentiment",
  analytical_twitter_sentiment: "Analytical Sentiment",
  all_twitter_sentiment: "All Sentiment",
  price: "Price ($)",
  volume: "Volume ($)",
};

const patternToArray = {
  solid: ("1", "0"),
  dashed: ("5", "5"),
  dotted: ("2", "2"),
};

const LineChart = ({ width, height, data }) => {
  const limits = useSelector((state) => state.lineGraph);
  const controlItems = useSelector((state) => state.dataLine);
  const dispatch = useDispatch();

  const margin = { top: 15, right: 25, bottom: 100, left: 35 };
  const margin2 = {
    top: height - margin.top - margin.bottom + 45,
    right: 25,
    bottom: 40,
    left: 35,
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
  }, [width, height, margin.left, margin.top]);

  useEffect(() => {
    const svg = d3.select(ref.current);
    const chart = svg.select("g");
    const context = svg.select(".context");
    const dataKeys = Object.keys(data);

    if (Object.keys(data).length !== 0) {
      chart.selectAll(".line").each(function () {
        if (!dataKeys.includes(this.id)) {
          this.remove();
        }
      });
      context.selectAll(".line").each(function () {
        if (!dataKeys.includes(this.id)) {
          this.remove();
        }
      });
      svg.selectAll(".tool").each(function () {
        this.remove();
      });
      drawChart(limits.valid, limits.start, limits.end);
    } else {
      chart.selectAll(".line").each(function () {
        this.remove();
      });
      context.selectAll(".line").each(function () {
        this.remove();
      });
      svg.selectAll(".tool").each(function () {
        this.remove();
      });
    }
  }, [data, controlItems]);

  const drawChart = (valid, start, end) => {
    const svg = d3.select(ref.current);
    const clip = svg
      .append("defs")
      .append("svg:clipPath")
      .attr("id", "clip")
      .append("svg:rect")
      .attr("width", innerWidth)
      .attr("height", innerWidth)
      .attr("x", 0)
      .attr("y", 0);

    const chart = svg.select("g");

    let xValues = [];
    let yValues = [];

    let maxPrice = 0;
    let minPrice = 0;
    let maxPriceDate = 0;
    let minPriceDate = 0;

    let maxVolume = 0;
    let minVolume = 0;
    let maxVolumeDate;
    let minVolumeDate;

    const dataKeys = Object.keys(data).sort();

    let dataAxisSet = false;
    let priceAxisSet = false;

    dataKeys.forEach((d) => {
      if (data[d][0].type === "axis") {
        dataAxisSet = true;
        xValues.push(d3.min(data[d], (entry) => entry.time));
        xValues.push(d3.max(data[d], (entry) => entry.time));
        yValues.push(d3.min(data[d], (entry) => entry.data));
        yValues.push(d3.max(data[d], (entry) => entry.data));
      } else if (data[d][0].type === "price") {
        priceAxisSet = true;
        maxPrice = d3.max(data[d], (entry) => entry.data);
        minPrice = d3.min(data[d], (entry) => entry.data);
        maxPriceDate = d3.max(data[d], (entry) => entry.time);
        minPriceDate = d3.min(data[d], (entry) => entry.time);
      } else {
        maxVolume = d3.max(data[d], (entry) => entry.data);
        minVolume = d3.min(data[d], (entry) => entry.data);
        maxVolumeDate = d3.max(data[d], (entry) => entry.time);
        minVolumeDate = d3.min(data[d], (entry) => entry.time);
      }
    });

    if (!dataAxisSet) {
      if (!priceAxisSet) {
        yValues.push(maxVolume);
        yValues.push(minVolume);
        xValues.push(maxVolumeDate);
        xValues.push(minVolumeDate);
      } else {
        yValues.push(maxPrice);
        yValues.push(minPrice);
        xValues.push(maxPriceDate);
        xValues.push(minPriceDate);
      }
    }

    const minX = d3.min(xValues);
    const maxX = d3.max(xValues);
    const minY = d3.min(yValues);
    const maxY = d3.max(yValues);

    if (start < minX) start = minX;

    if (end > maxX) end = maxX;

    const xScale = d3.scaleTime().domain([minX, maxX]).range([0, innerWidth]);
    const xScale2 = d3.scaleTime().domain([minX, maxX]).range([0, innerWidth]);

    const yScale = d3.scaleLinear().domain([minY, maxY]).range([innerHeight, 0]);
    const yScale2 = d3.scaleLinear().domain([minY, maxY]).range([innerHeight2, 0]);

    const yScalePrice = d3.scaleLinear().domain([minPrice, maxPrice]).range([innerHeight, 0]);
    const yScalePrice2 = d3.scaleLinear().domain([minPrice, maxPrice]).range([innerHeight2, 0]);

    const yScaleVolume = d3.scaleLinear().domain([minVolume, maxVolume]).range([innerHeight, 0]);
    const yScaleVolume2 = d3.scaleLinear().domain([minVolume, maxVolume]).range([innerHeight2, 0]);

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

      dispatch(setStartEndLineGraph(xScale2.invert(extent[0]), xScale2.invert(extent[1])));

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
            .y((d) => {
              if (d.type === "axis") return yScale(d.data);
              else if (d.type === "price") {
                return yScalePrice(d.data);
              } else {
                return yScaleVolume(d.data);
              }
            })
        );
    };

    const brush = d3
      .brushX()
      .extent([
        [0, -2],
        [innerWidth, innerHeight2 + 2],
      ])
      .on("brush end", brushed);

    if (valid) {
      context
        .append("g")
        .attr("class", "brush")
        .call(brush)
        .call(brush.move, [xScale2(start), xScale2(end)]);
    } else {
      context.append("g").attr("class", "brush").call(brush).call(brush.move, xScale.range());
    }

    function update(data) {
      const u = chart.selectAll(".line").data(data).attr("clip-path", "url(#clip)");

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
            .y((d) => {
              if (d.type === "axis") return yScale(d.data);
              else if (d.type === "price") {
                return yScalePrice(d.data);
              } else {
                return yScaleVolume(d.data);
              }
            })
        )
        .attr("stroke", (d) => (controlItems[d.id] == null ? "white" : colorNametoHex[controlItems[d.id].color]))
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", (d) =>
          controlItems[d.id] == null ? "none" : patternToArray[controlItems[d.id].pattern]
        )
        .style("fill", "none");
    }

    function updateContext(data) {
      const c = context.selectAll(".line").data(data).attr("clip-path", "url(#clip)");

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
            .y((d) => {
              if (d.type === "axis") return yScale2(d.data);
              else if (d.type === "price") {
                return yScalePrice2(d.data);
              } else {
                return yScaleVolume2(d.data);
              }
            })
        )
        .attr("stroke", (d) => (controlItems[d.id] == null ? "white" : colorNametoHex[controlItems[d.id].color]))
        .style("stroke-width", 30)
        .style("fill", "none");
    }

    update(values(data));
    updateContext(values(data));

    //Tool Tip
    let tooltip = svg
      .append("g")
      .attr("class", "tool")
      .append("foreignObject")
      .attr("width", 300)
      .attr("height", 100)
      .style("opacity", 0);

    let vert = svg
      .append("g")
      .attr("class", "tool")
      .append("rect")
      .attr("width", 1)
      .attr("height", innerHeight)
      .style("opacity", 0)
      .attr("transform", `translate(0, -15)`);

    const mouseover = (event, d) => {
      tooltip.style("opacity", 1);
      vert.style("opacity", 1);
    };

    const mouseleave = (event, d) => {
      tooltip.style("opacity", 0);
      vert.style("opacity", 0);
    };

    const mousemove = (event, d) => {
      const [x, y] = d3.pointer(event);

      let date = xScale.invert(x - margin.left);
      let markers = [];

      dataKeys.forEach((d) => {
        let obj = data[d][0];
        data[d].forEach((datum) => {
          if (datum.time < date) {
            obj = datum;
          }
        });

        markers.push({
          keyword: controlItems[d].keyword,
          name: controlItems[d].dataName,
          time: obj.time,
          data: obj.data,
        });
      });

      if (yScale.invert(y - margin.top) >= 0 && x - margin.left >= 0) {
        let string = " Date: " + date.toLocaleString();
        tooltip.html(string);
        markers.forEach((d) => {
          string += "<br/>" + " " + d.keyword + " " + dataNametoTitle[d.name] + ": " + d.data;
        });
        tooltip.html(string);
      } else {
        vert.style("opacity", 0);
        tooltip.html("");
      }

      let xTextOffset;
      if (x > 0.7 * innerWidth) {
        xTextOffset = -190;
      } else {
        xTextOffset = 15;
      }

      vert.attr("transform", `translate(${x - 1}, 15)`);
      tooltip.attr("transform", `translate(${x + xTextOffset}, ${y + 15})`);
    };

    svg.on("mousemove", mousemove).on("mouseleave", mouseleave).on("mouseover", mouseover);

    // Need to always clip at the end for some reason.
    chart.selectAll(".line").attr("clip-path", "url(#clip)");
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

  const width = 1096;

  return (
    <div className="GraphPanalP">
      <LineChart width={width} height={width / 1.9} data={dataItems} />
    </div>
  );
};
