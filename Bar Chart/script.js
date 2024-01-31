const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";
const gdp = document.getElementById("gdp");
const date = document.getElementById("date");
const tooltip = document.getElementById("tooltip");
const h = 500; // Adjust the height as needed
const w = 500; // Adjust the width as needed
const padding = 50;
const svg = d3
  .select("main")
  .append("svg")
  .style("height", h)
  .style("width", w);

svg
  .append("text")
  .attr("id", "title")
  .attr("text-anchor", "middle")
  .attr("font-size", "2em")
  .attr("x", "50%")
  .attr("y", "10vh")
  .text("United States GDP");

fetch(url)
  .then((res) => res.json())
  .then((data) => {
    const dataSet = data["data"];
    const xScale = d3
      .scaleUtc()
      .domain([new Date(data["from_date"]), new Date(data["to_date"])])
      .range([padding, w - padding]);
    const x = d3.axisBottom(xScale);
    svg
      .append("g")
      .attr("id", "x-axis")
      .attr("transform", `translate(0,${h - padding})`)
      .call(x);
    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(dataSet, (d) => d[1])])
      .range([h - padding, padding]);
    const y = d3.axisLeft(yScale);
    svg
      .append("g")
      .attr("id", "y-axis")
      .attr("transform", `translate(${padding},0)`)
      .call(y);
    svg
      .selectAll("rect")
      .data(dataSet)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("data-date", (d) => d[0])
      .attr("data-gdp", (d) => d[1])
      .attr("y", (d) => yScale(d[1]))
      .attr("x", (d) => xScale(new Date(d[0])))
      .attr("height", (d) => h - yScale(d[1]) - padding)
      .attr("width", 1.5);
    const bar = document.querySelectorAll(".bar");

    bar.forEach((item) => {
      item.addEventListener("mouseover", (event) => {
        tooltip.setAttribute("data-date", event.target.dataset.date);
        date.textContent = event.target.dataset.date;
        gdp.textContent = event.target.dataset.gdp;
        const l = Number(event.target.getAttribute("x")) + 275;
        tooltip.style.left = l + "px";
        tooltip.style.top = 300 + "px";
        tooltip.style.opacity = 0.8;
      });

      item.addEventListener("mouseout", () => {
        tooltip.style.opacity = 0; // Oculta el tooltip
      });
    });
  });
