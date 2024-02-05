const urlEdu =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";
const urlDraw =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";
const message = document.getElementById("message");
const gradientColors = {
  1: "#e5f5e0",
  2: "#c7e9c0",
  3: "#a1d99b",
  4: "#74c476",
  5: "#41ab5d",
  6: "#238b45",
  7: "#006d2c",
  8: "#00441b",
};
const key = Object.keys(gradientColors);
const percentages = [3, 12, 21, 30, 39, 48, 57, 66];
const h = 400;
const w = 500;
const paddingX = 60;
const paddingY = 30;

const fillColor = (number) => {
  if (number < percentages[0]) {
    return "#ffffff";
  } else if (number < percentages[1]) {
    return gradientColors[1];
  } else if (number < percentages[2]) {
    return gradientColors[2];
  } else if (number < percentages[3]) {
    return gradientColors[3];
  } else if (number < percentages[4]) {
    return gradientColors[4];
  } else if (number < percentages[5]) {
    return gradientColors[5];
  } else if (number < percentages[6]) {
    return gradientColors[6];
  } else if (number < percentages[7]) {
    return gradientColors[7];
  } else {
    return gradientColors[8];
  }
};
const legend = d3.select("#legend").append("svg").style("right", 10);
legend
  .selectAll("rect")
  .data(key)
  .enter()
  .append("rect")
  .attr("x", (d, i) => i * 30)
  .attr("y", 20)
  .attr("height", 20)
  .attr("width", 30)
  .style("fill", (d, i) => gradientColors[i + 1]);

const xScaleL = d3.scaleBand().domain(percentages).range([0, 240]);
const xL = d3.axisBottom(xScaleL).tickFormat((d) => `${d}%`);
legend
  .append("g")
  .attr("id", "x-axis-l")
  .attr("transform", `translate(0,40)`)
  .call(xL);
legend
  .selectAll(".tick")
  .attr("transform", (d, i) => `translate(${30 * i},0)`)
  .attr("text-anchor", "start");
const svg = d3
  .select("#svg")
  .append("svg")
  .style("height", h)
  .style("width", w);
const dataEdu = async () => {
  const res = await fetch(urlEdu);
  const data = await res.json();
  return data;
};

const draw = async () => {
  const res = await fetch(urlDraw);
  const dataSet = await res.json();
  const draw = topojson.feature(dataSet, dataSet["objects"]["counties"]);
  const edu = await dataEdu();
  const map = d3
    .select("#map")
    .append("svg")
    .attr("width", 5000)
    .attr("height", 1000);
  map
    .selectAll("path")
    .data(draw.features)
    .enter()
    .append("path")
    .attr("d", d3.geoPath())
    .attr("class", "county")
    .attr("data-fips", (d) => {
      const obj = edu.find((item) => d.id === item.fips);
      return obj.fips;
    })
    .attr("data-education", (d) => {
      const obj = edu.find((item) => d.id === item.fips);
      return obj.bachelorsOrHigher;
    })
    .style("fill", (d) => {
      const obj = edu.find((item) => d.id === item.fips);
      return fillColor(obj.bachelorsOrHigher);
    });
  const counties = document.querySelectorAll(".county");
  counties.forEach((item) => {
    item.addEventListener("mouseenter", (event) => {
      console.log(event);
      tooltip.setAttribute(
        "data-education",
        item.getAttribute("data-education")
      );
      // Set tooltip position
      tooltip.style.left = event.offsetX + 20 + "px";
      tooltip.style.top = event.offsetY + "px";
      message.textContent = `${item.getAttribute("data-education")}`;
      tooltip.style.opacity = 0.8;
    });
    item.addEventListener("mouseout", (event) => {
      tooltip.style.opacity = 0;
    });
  });
};
draw();
