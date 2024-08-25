import { useEffect, useState } from "react";
import { getLastWeatherData } from "../API";

function Latest() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    getLastWeatherData()
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  };

  useEffect(() => {
    fetchData();

    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {data?.map((entry, index) => (
            <li key={index}>
              <strong>Time:</strong> {entry.time} <br />
              <strong>Temperature:</strong> {entry.temperature} °C <br />
              <strong>Feels Like:</strong> {entry.feels_like} °C <br />
              <strong>Humidity:</strong> {entry.humidity} % <br />
              <strong>Wind Speed:</strong> {entry.wind_speed} km/h <br />
              <strong>Wind Direction:</strong> {entry.wind_direction} °<br />
              <strong>Location:</strong> {entry.location}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Latest;
