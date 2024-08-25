def kelvin_to_celsius(kelvin: float) -> float:
    return kelvin - 273.15

def aggregate_wind_data(speed: float, direction: float) -> str:
    return f"{speed} km/h {direction}°"

if __name__ == "__main__":
    kelvin_temp = 300.0
    celsius_temp = kelvin_to_celsius(kelvin_temp)
    print(f"{kelvin_temp}K = {celsius_temp}°C")

    wind_speed = 10.5
    wind_direction = 180
    wind_info = aggregate_wind_data(wind_speed, wind_direction)
    print(wind_info)
