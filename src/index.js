import React from "react";
import ReactDOM from "react-dom";

import Map from "./components/Map";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <React.StrictMode>
    <Map />
  </React.StrictMode>,
  rootElement
);
