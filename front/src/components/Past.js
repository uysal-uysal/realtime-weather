import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import { getWeatherData } from "../API";
import {
  Box,
  Checkbox,
  FormControlLabel,
  Typography,
  CircularProgress,
  Button,
  MenuItem,
  Select,
  FormControl,
} from "@mui/material";
import dayjs from "dayjs";

function WeatherChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleMetrics, setVisibleMetrics] = useState({
    temperature: true,
    humidity: true,
    wind_speed: true,
    feels_like: true,
  });
  const [chartType, setChartType] = useState("line"); // Toggle between 'line' and 'bar'
  const [selectedMetric, setSelectedMetric] = useState("temperature");
  const [distributionData, setDistributionData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await getWeatherData();
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedMetric && data.length > 0) {
      const counts = {};
      data.forEach((entry) => {
        const value = entry[selectedMetric];
        counts[value] = (counts[value] || 0) + 1;
      });

      const formattedData = Object.keys(counts).map((key) => ({
        value: key,
        count: counts[key],
      }));

      setDistributionData(formattedData);
    }
  }, [selectedMetric, data]);

  const toggleMetric = (metric) => {
    setVisibleMetrics((prev) => ({
      ...prev,
      [metric]: !prev[metric],
    }));
    setSelectedMetric(metric);
  };

  const filteredData = data.map((entry) => ({
    ...entry,
    temperature: visibleMetrics.temperature ? entry.temperature : null,
    humidity: visibleMetrics.humidity ? entry.humidity : null,
    wind_speed: visibleMetrics.wind_speed ? entry.wind_speed : null,
    feels_like: visibleMetrics.feels_like ? entry.feels_like : null,
  }));

  return (
    <Box style={{ width: "75%" }}>
      <Box mb={2}>
        <Button
          variant="contained"
          onClick={() =>
            setChartType((prev) => (prev === "line" ? "bar" : "line"))
          }
        >
          Toggle Chart Type
        </Button>
      </Box>

      {chartType === "bar" && (
        <Box
          mb={2}
          style={{
            backgroundColor: "white",
          }}
        >
          <FormControl fullWidth>
            <Select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
            >
              {Object.keys(visibleMetrics).map((metric) => (
                <MenuItem key={metric} value={metric}>
                  {metric.replace("_", " ").toUpperCase()}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      )}

      {loading ? (
        <CircularProgress />
      ) : (
        <>
          {chartType === "line" ? (
            <>
              <Box mb={2}>
                <Typography variant="h6">Select Metrics</Typography>
                {Object.keys(visibleMetrics).map((metric) => (
                  <FormControlLabel
                    key={metric}
                    control={
                      <Checkbox
                        checked={visibleMetrics[metric]}
                        onChange={() => toggleMetric(metric)}
                      />
                    }
                    label={metric.replace("_", " ").toUpperCase()}
                  />
                ))}
              </Box>
              <ResponsiveContainer width="100%" height={650}>
                <LineChart data={filteredData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(value) =>
                      dayjs(value).format("DD/MM/YYYY HH:mm")
                    }
                    formatter={(value) => `${value}`}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="time"
                    stroke="#000dff"
                    dot={false}
                  />
                  {visibleMetrics.temperature && (
                    <Line
                      type="monotone"
                      dataKey="temperature"
                      stroke="#ff7300"
                      dot={false}
                    />
                  )}
                  {visibleMetrics.humidity && (
                    <Line
                      type="monotone"
                      dataKey="humidity"
                      stroke="#387908"
                      dot={false}
                    />
                  )}
                  {visibleMetrics.wind_speed && (
                    <Line
                      type="monotone"
                      dataKey="wind_speed"
                      stroke="#8884d8"
                      dot={false}
                    />
                  )}
                  {visibleMetrics.feels_like && (
                    <Line
                      type="monotone"
                      dataKey="feels_like"
                      stroke="#D4D884"
                      dot={false}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </>
          ) : (
            <Box mt={4}>
              <Typography variant="h6">
                {selectedMetric.replace("_", " ").toUpperCase()} Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={distributionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="value" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          )}
        </>
      )}
    </Box>
  );
}

export default WeatherChart;
