from flask import Flask, jsonify
from influxdb_client import InfluxDBClient
import os
from dotenv import load_dotenv
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

load_dotenv()

bucket = os.getenv("INFLUXDB_BUCKET")
org = os.getenv("INFLUXDB_ORG")
token = os.getenv("INFLUXDB_TOKEN")
url = os.getenv("INFLUXDB_URL")

client = InfluxDBClient(url=url, token=token, org=org)


@app.route('/api/weather', methods=['GET'])
def get_weather_data():
    query = f'''
    from(bucket:"{bucket}") 
    |> range(start: -12h) 
    |> filter(fn: (r) => r["_measurement"] == "weather")
    |> filter(fn: (r) => r["_field"] == "humidity" or r["_field"] == "temperature" or r["_field"] == "wind_speed" or r["_field"] == "feels_like" or r["_field"] == "wind_direction")
    |> group(columns: ["_measurement", "_field", "location"])
    '''
    tables = client.query_api().query(query, org=org)

    data = {}
    for table in tables:
        for record in table.records:
            time = record.get_time()
            if time not in data:
                data[time] = {
                    "time": time,
                    "location": record.values.get("location"),
                    "temperature": None,
                    "humidity": None,
                    "wind_speed": None,
                    "wind_direction": None
                }

            field = record.get_field()
            value = record.get_value()
            data[time][field] = value

    return jsonify(list(data.values()))

@app.route('/api/latestWeather', methods=['GET'])
def get_last_weather_data():
    query = f'''
    from(bucket:"{bucket}") 
    |> range(start: -1m) 
    |> filter(fn: (r) => r["_measurement"] == "weather")
    |> filter(fn: (r) => r["_field"] == "humidity" or r["_field"] == "temperature" or r["_field"] == "wind_speed" or r["_field"] == "feels_like" or r["_field"] == "wind_direction")
    |> group(columns: ["_measurement", "_field", "location"])
    '''
    tables = client.query_api().query(query, org=org)

    data = {}
    for table in tables:
        for record in table.records:
            time = record.get_time()
            if time not in data:
                data[time] = {
                    "time": time,
                    "location": record.values.get("location"),
                    "temperature": None,
                    "humidity": None,
                    "wind_speed": None,
                    "wind_direction": None
                }

            field = record.get_field()
            value = record.get_value()
            data[time][field] = value

    return jsonify(list(data.values()))


if __name__ == '__main__':
    app.run(debug=True)
