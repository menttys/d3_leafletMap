import React, { useEffect } from "react";
import * as d3 from "d3";
import styled from "styled-components";
import DATA from "../data/states.json";

const MapContainer = styled.div`
  width: 960px;
  height: 500px;

  .state {
    fill: white;
    stroke: red;
    fill-opacity: 0.1;

    &:hover {
      fill: yellow;
      fill-opacity: 0.9;
    }
  }
`;

const setMap = () => {
  return new L.Map("_map", { center: [37.8, -96.9], zoom: 4 }).addLayer(
    new L.TileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")
  );
};

export default function Map() {
  let svg;
  let g;
  let map;

  useEffect(() => {
    map = setMap();
    setSVG();
    setAreas();
  }, []);

  const setSVG = () => {
    svg = d3.select(map.getPanes().overlayPane).append("svg");
    g = svg.append("g").attr("class", "leaflet-zoom-hide");
  };

  function projectPoint(x, y) {
    const point = map.latLngToLayerPoint(new L.LatLng(y, x));
    this.stream.point(point.x, point.y);
  }
  const transform = d3.geoTransform({ point: projectPoint });
  const path = d3.geoPath().projection(transform);

  const setAreas = () => {
    const feature = g
      .selectAll("path")
      .data(DATA.features)
      .enter()
      .append("path")
      .attr("class", "state");

    const reset = () => {
      const bounds = path.bounds(DATA);
      const topLeft = bounds[0];
      const bottomRight = bounds[1];

      svg
        .attr("width", bottomRight[0] - topLeft[0])
        .attr("height", bottomRight[1] - topLeft[1])
        .style("left", topLeft[0] + "px")
        .style("top", topLeft[1] + "px");

      g.attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");

      feature.attr("d", path);
    };

    map.on("viewreset", reset);
    reset();
  };

  return <MapContainer id="_map" />;
}
