const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

const tooltip = document.getElementById("tooltip");
const h = 500;
const w = 500;
const padding = 50;
const formatTime = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
  return `${formattedMinutes}:${formattedSeconds}`;
};
const dateTime = (totalSeconds) => {
  const fecha = new Date();
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  fecha.setMinutes(minutes);
  fecha.setSeconds(seconds);
  return fecha;
};
const svg = d3
  .select("main")
  .append("svg")
  .style("height", h)
  .style("width", w);

fetch(url)
  .then((res) => res.json())
  .then((data) => {
    const minYear = d3.min(data, (d) => d["Year"]);
    const maxYear = d3.max(data, (d) => d["Year"]);
    const minSeconds = d3.min(data, (d) => d["Seconds"]);
    const maxSeconds = d3.max(data, (d) => d["Seconds"]);
    console.log;
    const xScale = d3
      .scaleLinear()
      .domain([minYear, maxYear])
      .range([padding, w - padding]);
    const x = d3
      .axisBottom(xScale)
      .ticks(8)
      .tickFormat((d) => String(d).replace(",", ""));
    svg
      .append("g")
      .attr("id", "x-axis")
      .attr("transform", `translate(0,${h - padding - 50})`)
      .call(x);
    const yScale = d3
      .scaleLinear()
      .domain([minSeconds, maxSeconds])
      .range([h - padding - 50, padding + 50]);
    const y = d3.axisLeft(yScale).tickFormat((d) => formatTime(d));
    svg
      .append("g")
      .attr("id", "y-axis")
      .attr("transform", `translate(${padding},0)`)
      .call(y);
    svg
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("data-xvalue", (d) => d["Year"])
      .attr("data-yvalue", (d) => dateTime(d["Seconds"]))
      .attr("cy", (d) => yScale(d["Seconds"]))
      .attr("cx", (d) => xScale(d["Year"]))
      .attr("r", 3);

    const dots = document.querySelectorAll(".dot");
    for (let i = 0; i < dots.length; i++) {
      dots[i].addEventListener("mouseenter", (event) => {
        tooltip.setAttribute("data-year", dots[i].getAttribute("data-xvalue"));
        tooltip.style.opacity = 0.8;
      });
      dots[i].addEventListener("mouseout", (event) => {
        tooltip.style.opacity = 0;
      });
    }
  });
