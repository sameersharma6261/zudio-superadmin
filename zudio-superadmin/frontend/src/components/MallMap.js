import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const MallMap = ({ mallCounters }) => {
  return (
    <MapContainer
      center={[22.9734, 78.6569]} // Default center (India)
      zoom={5}
      scrollWheelZoom={true}
      style={{
        height: "500px",
        width: "100%",
        borderRadius: "10px",
        marginTop: "20px",
      }}
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
          <Marker key={index} position={[lat, lng]}>
            <Popup>
              <strong>{mall.mallTitle}</strong>
              <br />
              🏬 Shops: {mall.counterCount}
              <br />
              <ul>
                {mall.counters.map((shop, i) => (
                  <li key={i}>
                    {shop.name} ({shop.userCount})
                  </li>
                ))}
              </ul>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default MallMap;