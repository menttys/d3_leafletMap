import React, { useState } from "react";
import {
  GoogleMap,
  useGoogleMap,
  useLoadScript,
  OverlayView
} from "@react-google-maps/api";

function MyComponentWithHook(props) {
  const map = useGoogleMap();

  React.useEffect(
    function effect() {
      map.addListener("center_changed", () => {
        const lat = map.center.lat();
        const lng = map.center.lng();

        console.log("lat: ", lat, "lng: ", lng);

        props.setLat(lat);
        props.setLng(lng);
      });
    },
    [map, props]
  );

  const getPixelPositionOffset = (width, height) => ({
    x: -(width / 2),
    y: -(height / 2)
  });

  return (
    <div>
      <OverlayView
        position={{ lat: map.center.lat(), lng: map.center.lng() }}
        mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
        getPixelPositionOffset={getPixelPositionOffset}
      >
        <div
          style={{ background: `white`, border: `1px solid #ccc`, padding: 15 }}
        >
          <h1>OverlayView</h1>
          <button style={{ height: 60 }}>I have been clicked</button>
        </div>
      </OverlayView>
    </div>
  );
}

const MemoizedMyComponentWithHook = React.memo(MyComponentWithHook);

function Maps() {
  // Initial map coordinates that will change
  // when onCenterChanged is called
  const [lat, setLat] = useState(51.5262);
  const [lng, setLng] = useState(-0.0851);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: ""
  });

  console.log("Latitude and longitude:", {
    lat,
    lng
  });

  return (
    <div style={{ display: "flex", height: "calc(100vh - 50px)" }}>
      {isLoaded && (
        <GoogleMap
          id="full-map"
          zoom={13}
          mapContainerStyle={{
            flex: 1
          }}
          center={{
            lat,
            lng
          }}
        >
          <MemoizedMyComponentWithHook setLat={setLat} setLng={setLng} />
        </GoogleMap>
      )}
    </div>
  );
}

export default Maps;
