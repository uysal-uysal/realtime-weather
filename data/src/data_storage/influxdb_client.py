from influxdb_client import InfluxDBClient, Point, WritePrecision
from influxdb_client.client.write_api import SYNCHRONOUS
import os
from dotenv import load_dotenv

load_dotenv()

bucket = os.getenv("INFLUXDB_BUCKET")

token = os.environ.get("INFLUXDB_TOKEN")
org = "uysal-uysal"
url = "http://localhost:8086"


client = InfluxDBClient(url=url, token=token, org=org)
write_api = client.write_api(write_options=SYNCHRONOUS)

def write_weather_data(city: str, data: dict, lat:float, lon:float):
    print("WRITE", data)
    point = Point("weather") \
        .tag("location", city) \
        .field("clouds", data["clouds"]) \
        .field("temperature", data["temperature"]) \
        .field("humidity", data["humidity"]) \
        .field("wind_speed", data["wind_speed"]) \
        .field("wind_direction", data["wind_direction"]) \
        .field("feels_like", data["feels_like"]) \
        .field("timestamp", data["timestamp"]) \
        .field("lat", lat) \
        .field("lon", lon) \



    write_api.write(bucket=bucket, org=org, record=point)
    print("Data written successfully to InfluxDB")

if __name__ == "__main__":
    sample_data = {
        "temperature": 25.0,
        "humidity": 80,
        "wind_speed": 10.5,
        "wind_direction": 180,
        "timestamp": "2024-08-22T10:00:00Z"
    }
    write_weather_data("Konya", sample_data)
