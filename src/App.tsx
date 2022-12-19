import { useState } from "react";
import axios from "axios";
import "./styles.css";

interface IPinball {
  id: number;
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  lat: string;
  lon: string;
}

export default function App() {
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [distance, setDistance] = useState(50);
  const [pinballs, setPinballs] = useState<IPinball[]>([]);
  const [loading, setLoading] = useState(false);

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      setLatitude(position.coords.latitude.toString());
      setLongitude(position.coords.longitude.toString());
    });
  };

  const searchList = async () => {
    const params = {
      lat: latitude,
      lon: longitude,
      send_all_within_distance: distance
    };
    setLoading(true);
    await axios
      .get("https://pinballmap.com/api/v1/locations/closest_by_lat_lon", {
        params
      })
      .then((res) => {
        setPinballs(res.data.locations);
      });
    setLoading(false);
  };

  return (
    <div className="App">
      <h1>Pinball Locations</h1>
      <button onClick={getLocation}>Near Me</button>
      <button
        onClick={searchList}
        disabled={latitude.length && longitude.length ? false : true}
      >
        Search
      </button>
      <div>
        <label>Latitude:</label>
        <input
          value={latitude}
          type="number"
          min={-90}
          max={90}
          onChange={(e) => setLatitude(e.target.value)}
        />
        <label>Longitude:</label>
        <input
          value={longitude}
          type="number"
          min={-180}
          max={180}
          onChange={(e) => setLongitude(e.target.value)}
        />
        <label>Distance:</label>
        <input
          value={distance}
          type="number"
          min={50}
          max={500}
          onChange={(e) => setDistance(parseInt(e.target.value, 10))}
        />
      </div>
      {loading ? (
        "Loading..."
      ) : (
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Name</th>
              <th>Street</th>
              <th>City</th>
              <th>State</th>
              <th>Zip</th>
              <th>Lat</th>
              <th>Lon</th>
            </tr>
          </thead>
          <tbody>
            {pinballs?.map((pinball, index) => (
              <tr key={pinball.id}>
                <td>{index + 1}</td>
                <td>{pinball.name}</td>
                <td>{pinball.street}</td>
                <td>{pinball.city}</td>
                <td>{pinball.state}</td>
                <td>{pinball.zip}</td>
                <td>{pinball.lat}</td>
                <td>{pinball.lon}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
