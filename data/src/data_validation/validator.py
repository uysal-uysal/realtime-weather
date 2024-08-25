from pydantic import BaseModel, Field, ValidationError

class WeatherData(BaseModel):
    temperature: float = Field(..., gt=-100, lt=60)
    humidity: int = Field(..., ge=0, le=100)
    wind_speed: float = Field(..., ge=0, le=200)
    wind_direction: float = Field(..., ge=0, le=360)
    feels_like: float = None
    clouds: float = None
    location: str = None
    timestamp: str = None

    class Config:
        extra = "allow"

def validate_weather_data(data: dict):
    try:
        validated_data = WeatherData(**data)
        return validated_data
    except ValidationError as e:
        print(f"Validation error: {e}")
        return None

if __name__ == "__main__":
    sample_data = {
        "temperature": 25.0,
        "humidity": 80,
        "wind_speed": 10.5,
        "wind_direction": 180,
        "feels_like": 22.0,
        "clouds": 40,
        "location": "Konya",
        "timestamp": "2024-08-24T16:38:04.883075Z"
    }

    validated_data = validate_weather_data(sample_data)
    print(validated_data.dict())
