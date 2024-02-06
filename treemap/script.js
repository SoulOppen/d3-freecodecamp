const url =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json";

const colors = {
  2600: "#FF0000",
  Wii: "#00FF00",
  NES: "#0000FF",
  GB: "#FFFF00",
  DS: "#FF00FF",
  X360: "#00FFFF",
  PS3: "#800000",
  PS2: "#008000",
  SNES: "#000080",
  GBA: "#808080",
  PS4: "#C0C0C0",
  "3DS": "#800080",
  N64: "#008080",
  PS: "#A52A2A",
  XB: "#FFA500",
  PC: "#aaaaaa",
  PSP: "#888888",
  XOne: "#55ff50",
};
const key = Object.keys(colors);
const map = d3.select("#map");
const tooltip = d3.select("#tooltip");
const legend = d3.select("#legend");
const global = legend
  .selectAll("g")
  .data(key)
  .enter()
  .append("g")
  .attr("transform", (d, i) => `translate(0, ${i * 20})`);
global
  .append("rect")
  .attr("width", 18)
  .attr("height", 18)
  .attr("class", "legend-item")
  .attr("fill", (d) => colors[d]);

global
  .append("text")
  .attr("x", 24)
  .attr("y", 9)
  .attr("dy", ".35em")
  .text((d) => d);
let videoGame;
const drawTreeMap = () => {
  let hierarchy = d3
    .hierarchy(videoGame, (node) => {
      return node["children"];
    })
    .sum((node) => {
      return node["value"];
    })
    .sort((node1, node2) => {
      return node2["value"] - node1["value"];
    });
  let createTree = d3.treemap().size([1000, 600]);
  createTree(hierarchy);
  let videoTiles = hierarchy.leaves();
  let block = map
    .selectAll("g")
    .data(videoTiles)
    .enter()
    .append("g")
    .attr("transform", (video) => {
      return "translate (" + video["x0"] + ", " + video["y0"] + ")";
    });
  block
    .append("rect")
    .attr("class", "tile")
    .attr("fill", (videoGame) => colors[videoGame.data.category])
    .attr("data-name", (videoGame) => {
      return videoGame["data"]["name"];
    })
    .attr("data-category", (videoGame) => {
      return videoGame["data"]["category"];
    })
    .attr("data-value", (videoGame) => {
      return videoGame["data"]["value"];
    })
    .attr("width", (videoGame) => {
      return videoGame["x1"] - videoGame["x0"];
    })
    .attr("height", (videoGame) => {
      return videoGame["y1"] - videoGame["y0"];
    })
    .on("mouseover", (videoGame) => {
      tooltip.transition().style("visibility", "visible");
      let message = videoGame["target"]["dataset"]["value"]
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

      tooltip.html(`${message}<hr />${videoGame["target"]["dataset"]["name"]}`);

      tooltip.attr("data-value", videoGame["target"]["dataset"]["value"]);
    })
    .on("mouseout", (videoGame) => {
      tooltip.transition().style("visibility", "hidden");
    });
  block
    .append("text")
    .text((videoGame) => {
      return videoGame["data"]["name"];
    })
    .attr("x", 5)
    .attr("y", 30);
};

d3.json(url).then((data, error) => {
  if (error) {
    console.log(error);
  } else {
    videoGame = data;
    drawTreeMap();
  }
});
