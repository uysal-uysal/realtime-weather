from apscheduler.schedulers.blocking import BlockingScheduler
import requests
from data_fetching.api_client import fetch_weather_data
from data_validation.validator import validate_weather_data
from data_storage.influxdb_client import write_weather_data
from datetime import datetime

def get_location_by_ip():
    response = requests.get('https://ipinfo.io/')
    data = response.json()
    loc = data['loc'].split(',')
    return float(loc[0]), float(loc[1])


def get_city_from_coordinates(lat: float, lon: float) -> str:
    url = f"https://nominatim.openstreetmap.org/reverse?lat={lat}&lon={lon}&format=json"
    response = requests.get(url)

    if response.status_code != 200:
        print(f"Failed to fetch data. HTTP Status Code: {response.status_code}")
        return "City not found"

    try:
        data = response.json()
    except requests.exceptions.JSONDecodeError:
        print(f"Failed to decode JSON. Response text: {response.text}")
        return "City not found"

    if 'address' in data:
        address = data['address']
        if 'city' in address:
            return address['city']
        elif 'town' in address:
            return address['town']
        elif 'village' in address:
            return address['village']

    return "City not found"


def job(lat: float, lon: float):

    raw_data = fetch_weather_data(lat, lon)
    validated_data = validate_weather_data({
        "temperature": raw_data["main"]["temp"],
        "feels_like": raw_data["main"]["feels_like"],
        "humidity": raw_data["main"]["humidity"],
        "wind_speed": raw_data["wind"]["speed"],
        "wind_direction": raw_data["wind"]["deg"],
        "clouds": raw_data["clouds"]["all"],
        "location": raw_data["name"],
        "timestamp": datetime.utcnow().isoformat() + "Z"

    })
    if validated_data:
        print(f"Writing data to InfluxDB  {validated_data}")
        write_weather_data(raw_data["name"], validated_data.dict(), lat, lon)

if __name__ == "__main__":
    print("Scheduler started!")
    lat, lon = get_location_by_ip()
    city = get_city_from_coordinates(lat, lon)
    scheduler = BlockingScheduler()
    scheduler.add_job(job, 'interval', minutes=1, args=[lat, lon])
    scheduler.start()
