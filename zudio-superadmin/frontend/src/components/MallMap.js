import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet-geosearch/dist/geosearch.css";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Custom Location Icon
const locationIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png", // Location pin
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35],
});

const MallMap = ({ mallCounters }) => {
  return (
    <div
      style={{
        borderRadius: "20px",
        overflow: "hidden",
        marginTop: "20px",
        paddingLeft: "30px",
          paddingRight: "50px",
          paddingBottom: "30px",
          paddingTop: "30px",
          border: "1px solid white"
      }}
    >
      <MapContainer
        center={[22.9734, 78.6569]} // India center
        zoom={1.5}
        scrollWheelZoom={true}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {mallCounters.map((mall, index) => {
          const lat = mall.location?.latitude;
          const lng = mall.location?.longitude;

          if (!lat || !lng) return null;

          return (
            <Marker key={index} position={[lat, lng]} icon={locationIcon}>
              <Popup>
                <div style={{ width: "250px" }}>
                  <h3 style={{ marginBottom: "5px", color: "#3e64ff" }}>
                    🏢 {mall.mallTitle}
                  </h3>
                  <p>
                    🛍️ Total Shops: <strong>{mall.counterCount}</strong>
                  </p>
                  <p>
                    👤 Total Users:{" "}
                    <strong>
                      {mall.counters.reduce(
                        (acc, cur) => acc + cur.userCount,
                        0
                      )}
                    </strong>
                  </p>
                  <hr />
                  <h4 style={{ marginTop: "10px" }}>Shops:</h4>
                  <ul
                    style={{
                      paddingLeft: "20px",
                      maxHeight: "150px",
                      overflowY: "auto",
                    }}
                  >
                    {mall.counters.map((shop, i) => (
                      <li key={i} style={{ marginBottom: "6px" }}>
                        <strong>{shop.name}</strong>
                        <br />
                        👤 Users: {shop.userCount}
                      </li>
                    ))}
                  </ul>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MallMap;