const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

const gradientColors = {
  blue: "#0000FF",
  lightBlue: "#3399FF",
  teal: "#66CCFF",
  orange: "#FFA500",
  red: "#FF0000",
};
const fillColor = (number) => {
  if (number < -4) {
    return gradientColors["blue"];
  } else if (number < -2.5) {
    return gradientColors["lightBlue"];
  } else if (number < -0.8) {
    return gradientColors["teal"];
  } else if (number < 1) {
    return gradientColors["orange"];
  } else return gradientColors["red"];
};
function getMonthNameUsingIntl(monthNumber) {
  if (monthNumber >= 1 && monthNumber <= 12) {
    const month = new Date(2022, monthNumber - 1, 1);
    const monthName = new Intl.DateTimeFormat("en-US", {
      month: "long",
    }).format(month);
    return monthName;
  } else {
    return "Mes no válido";
  }
}
function getYearNameUsingIntl(number) {
  const fecha = new Date().setFullYear(number);
  const year = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
  }).format(new Date(fecha));
  return year;
}
const tooltip = document.getElementById("tooltip");
const year = document.getElementById("year");
const month = document.getElementById("month");
const temperature = document.getElementById("temperature");
const key = Object.keys(gradientColors);
const h = 400;
const w = 500;
const paddingX = 60;
const paddingY = 30;
const svg = d3
  .select("#svg")
  .append("svg")
  .style("height", h)
  .style("width", w);

fetch(url)
  .then((res) => res.json())
  .then((data) => {
    console.log(data);
    const base = data["baseTemperature"];
    const minYear = d3.min(data["monthlyVariance"], (d) => d["year"]);
    const maxYear = d3.max(data["monthlyVariance"], (d) => d["year"]);
    const minMonth = d3.min(data["monthlyVariance"], (d) => d["month"]);
    const maxMonth = d3.max(data["monthlyVariance"], (d) => d["month"]);
    const xScale = d3
      .scaleLinear()
      .domain([minYear, maxYear])
      .range([paddingX, w - paddingX]);
    const x = d3
      .axisBottom(xScale)
      .ticks(15)
      .tickFormat((d) => getYearNameUsingIntl(d));
    svg
      .append("g")
      .attr("id", "x-axis")
      .attr("transform", `translate(0,${h - paddingY})`)
      .call(x);
    const yScale = d3
      .scaleBand()
      .domain(d3.range(1, 13).map((month) => getMonthNameUsingIntl(month)))
      .range([h - paddingY, paddingY])
      .paddingInner(0.2);
    const y = d3.axisLeft(yScale);
    svg
      .append("g")
      .attr("id", "y-axis")
      .attr("transform", `translate(${paddingX},0)`)
      .call(y);
    svg
      .selectAll("rect")
      .data(data["monthlyVariance"])
      .enter()
      .append("rect")
      .attr("class", "cell")
      .attr("data-month", (d) => d["month"] - 1)
      .attr("data-year", (d) => d["year"])
      .attr("data-temp", (d) => base + d["variance"])
      .attr("y", (d) => yScale(getMonthNameUsingIntl(d["month"])))
      .attr("x", (d) => xScale(d["year"]))
      .attr("height", 15)
      .attr("width", 2)
      .style("fill", (d) => fillColor(d["variance"]));
    const cells = document.querySelectorAll(".cell");
    cells.forEach((item) => {
      item.addEventListener("mouseenter", (event) => {
        tooltip.setAttribute("data-year", item.getAttribute("data-year"));
        tooltip.style.opacity = 0.8;

        const d =
          yScale(getMonthNameUsingIntl(item.getAttribute("data-month"))) + 20;
        tooltip.style.top = d + "px";
        const l = xScale(item.getAttribute("data-year")) + 450;
        tooltip.style.left = l + "px";
        month.textContent = `Month:${getMonthNameUsingIntl(
          item.getAttribute("data-month")
        )}`;
        year.textContent = `Year:${item.getAttribute("data-year")}`;
        temperature.textContent = `${item.getAttribute("data-temp")}°`;
      });
      item.addEventListener("mouseout", (event) => {
        tooltip.style.opacity = 0;
      });
    });
  });

const label = d3
  .select("#legend")
  .append("svg")
  .attr("id", "svgL")
  .selectAll("rect")
  .data(key)
  .enter()
  .append("rect")
  .attr("x", (d, i) => 50 * i)
  .attr("y", 0)
  .attr("width", 50)
  .attr("height", 20)
  .style("fill", (d) => gradientColors[d]);
const xScaleL = d3.scaleBand().domain(key).range([0, 250]);
const xL = d3.axisBottom(xScaleL);
const svgL = d3.select("#svgL");
svgL
  .append("g")
  .attr("id", "x-axis-l")
  .attr("transform", `translate(0,25)`)
  .call(xL);
