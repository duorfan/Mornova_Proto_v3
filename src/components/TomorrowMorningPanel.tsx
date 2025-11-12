import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Skeleton } from './ui/skeleton';

interface WeatherData {
  temperature: number;
  condition: string;
  emoji: string;
  sunrise: string;
  precipitationProbability: number;
  weathercode: number;
  tip: string;
}

// Map WMO weather codes to emoji, condition labels, and contextual smart tips
const getWeatherCondition = (
  weathercode: number
): { emoji: string; condition: string; tip: string } => {
  // WMO Weather interpretation codes (WW)
  if (weathercode === 0)
    return {
      emoji: '☀️',
      condition: 'Clear',
      tip: 'Clear skies mean easy travel—stick to your usual routine.'
    };
  if (weathercode === 1 || weathercode === 2)
    return {
      emoji: '🌤️',
      condition: 'Partly Cloudy',
      tip: 'Mild clouds; sunglasses and light layers should do.'
    };
  if (weathercode === 3)
    return {
      emoji: '☁️',
      condition: 'Overcast',
      tip: 'Gray morning—brighten the room to stay energized.'
    };
  if (weathercode === 45 || weathercode === 48)
    return {
      emoji: '🌫️',
      condition: 'Foggy',
      tip: 'Fog ahead—leave a few extra minutes for low visibility.'
    };
  if (weathercode === 51 || weathercode === 53 || weathercode === 55)
    return {
      emoji: '🌦️',
      condition: 'Drizzle',
      tip: 'Light drizzle—pack a light jacket or umbrella.'
    };
  if (weathercode === 56 || weathercode === 57)
    return {
      emoji: '🌨️',
      condition: 'Freezing Drizzle',
      tip: 'Freezing drizzle can glaze walkways; move carefully.'
    };
  if (weathercode === 61 || weathercode === 63 || weathercode === 65)
    return {
      emoji: '🌧️',
      condition: 'Rain',
      tip: 'Steady rain likely—consider a 10-minute buffer.'
    };
  if (weathercode === 66 || weathercode === 67)
    return {
      emoji: '🌨️',
      condition: 'Freezing Rain',
      tip: 'Icy rain can snarl traffic; give yourself extra time.'
    };
  if (weathercode === 71 || weathercode === 73 || weathercode === 75)
    return {
      emoji: '❄️',
      condition: 'Snow',
      tip: 'Snow on the ground—plan for slower travel.'
    };
  if (weathercode === 77)
    return {
      emoji: '🌨️',
      condition: 'Snow Grains',
      tip: 'Snow grains can be slick; wear shoes with traction.'
    };
  if (weathercode === 80 || weathercode === 81 || weathercode === 82)
    return {
      emoji: '🌧️',
      condition: 'Rain Showers',
      tip: 'On-and-off showers—umbrella recommended.'
    };
  if (weathercode === 85 || weathercode === 86)
    return {
      emoji: '❄️',
      condition: 'Snow Showers',
      tip: 'Passing snow showers—bundle up and watch footing.'
    };
  if (weathercode === 95 || weathercode === 96 || weathercode === 99)
    return {
      emoji: '⛈️',
      condition: 'Thunderstorm',
      tip: 'Storms possible—check alerts before heading out.'
    };

  // Default fallback
  return {
    emoji: '🌤️',
    condition: 'Partly Cloudy',
    tip: 'Weather is changing—peek at radar for local details.'
  };
};

// Format time string to HH:MM AM/PM
const formatTime = (timeString: string): string => {
  try {
    const date = new Date(timeString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, '0');
    return `${displayHours}:${displayMinutes} ${ampm}`;
  } catch (e) {
    return timeString;
  }
};

// Calculate hours until tomorrow 7 AM
const getHoursUntilWakeUp = (): number => {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(7, 0, 0, 0);
  
  const diffMs = tomorrow.getTime() - now.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  return diffHours;
};

export const TomorrowMorningPanel: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoursUntilWakeUp, setHoursUntilWakeUp] = useState(getHoursUntilWakeUp());

  // Update countdown every 15 minutes for better accuracy
  useEffect(() => {
    const updateCountdown = () => {
      setHoursUntilWakeUp(getHoursUntilWakeUp());
    };
    
    updateCountdown();
    const interval = setInterval(updateCountdown, 900000); // Update every 15 minutes
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=35.9940&longitude=-78.8986&hourly=temperature_2m,weathercode,precipitation_probability&daily=sunrise,sunset&temperature_unit=fahrenheit&timezone=auto&forecast_days=2'
        );

        if (!response.ok) {
          throw new Error('Failed to fetch weather data');
        }

        const data = await response.json();

        // Get tomorrow's date from the daily data
        // The daily array index 0 is today, index 1 is tomorrow (in the API's timezone)
        const dailyTimes = data.daily?.time || [];
        const sunriseTimes = data.daily?.sunrise || [];
        
        let tomorrowDateString = '';
        let sunriseTime = '';
        
        // Get tomorrow's date from daily data (index 1)
        if (dailyTimes.length > 1) {
          // Extract date part from the datetime string (format: YYYY-MM-DD)
          tomorrowDateString = dailyTimes[1].split('T')[0];
          sunriseTime = sunriseTimes[1] || '';
        } else if (dailyTimes.length > 0) {
          // Fallback: calculate tomorrow from today's date
          const todayDate = dailyTimes[0].split('T')[0];
          const today = new Date(todayDate + 'T00:00:00');
          today.setDate(today.getDate() + 1);
          const year = today.getFullYear();
          const month = String(today.getMonth() + 1).padStart(2, '0');
          const day = String(today.getDate()).padStart(2, '0');
          tomorrowDateString = `${year}-${month}-${day}`;
          sunriseTime = sunriseTimes[0] || '';
        } else {
          throw new Error('No daily weather data available');
        }

        // Get hourly data for tomorrow 7 AM
        const hourlyTimes = data.hourly?.time || [];
        const hourlyTemperatures = data.hourly?.temperature_2m || [];
        const hourlyWeathercodes = data.hourly?.weathercode || [];
        const hourlyPrecipitationProbability = data.hourly?.precipitation_probability || [];

        // Find the index for tomorrow 7 AM
        let targetIndex = -1;
        
        // First, try to find exactly 7 AM tomorrow
        for (let i = 0; i < hourlyTimes.length; i++) {
          const timeString = hourlyTimes[i];
          // Check if the time string contains tomorrow's date and 07:00
          if (timeString.startsWith(tomorrowDateString) && timeString.includes('T07:00')) {
            targetIndex = i;
            break;
          }
        }

        // If no exact 7 AM match, try to find any time between 6-8 AM tomorrow
        if (targetIndex === -1) {
          for (let i = 0; i < hourlyTimes.length; i++) {
            const timeString = hourlyTimes[i];
            if (timeString.startsWith(tomorrowDateString)) {
              // Extract hour from time string (format: YYYY-MM-DDTHH:MM)
              const hourMatch = timeString.match(/T(\d{2}):/);
              if (hourMatch) {
                const hour = parseInt(hourMatch[1], 10);
                if (hour >= 6 && hour <= 8) {
                  // Prefer 7 AM, but accept 6 or 8 AM
                  if (hour === 7) {
                    targetIndex = i;
                    break;
                  } else if (targetIndex === -1) {
                    targetIndex = i;
                  }
                }
              }
            }
          }
        }

        // If still no match, use the first hour of tomorrow
        if (targetIndex === -1) {
          for (let i = 0; i < hourlyTimes.length; i++) {
            const timeString = hourlyTimes[i];
            if (timeString.startsWith(tomorrowDateString)) {
              targetIndex = i;
              break;
            }
          }
        }

        if (targetIndex === -1 || !hourlyTemperatures[targetIndex] || hourlyWeathercodes[targetIndex] === undefined) {
          throw new Error('Weather data for tomorrow 7 AM not available');
        }

        const temperature = Math.round(hourlyTemperatures[targetIndex]);
        const weathercode = hourlyWeathercodes[targetIndex];
        const precipitationProbability = hourlyPrecipitationProbability[targetIndex] || 0;
        const { emoji, condition, tip } = getWeatherCondition(weathercode);

        setWeatherData({
          temperature,
          condition,
          emoji,
          sunrise: sunriseTime ? formatTime(sunriseTime) : 'N/A',
          precipitationProbability,
          weathercode,
          tip
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load weather data');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  // Card styling matching the existing glass card style
  const cardStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '24px',
    backdropFilter: 'blur(16px)',
    boxShadow: '0 8px 24px -6px rgba(0, 0, 0, 0.4), 0 2px 8px 0 rgba(0, 0, 0, 0.2)'
  };

  const showSmartTip = Boolean(weatherData?.tip);

  return (
    <div className="w-full">
      {/* Section Label - Above Card */}
      <h2 
        style={{ 
          color: '#A1A1AA', 
          fontFamily: 'Futura, sans-serif', 
          fontSize: 'calc(1.25rem * 1.3 * 0.9)',
          marginBottom: '16px',
          fontWeight: 500
        }}
      >
        Tomorrow Morning
      </h2>

      <Card className="w-full" style={{ ...cardStyle, padding: '20px' }}>
        {loading && (
          <div className="space-y-4 text-center">
            <Skeleton className="h-8 w-40 mx-auto" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
            <Skeleton className="h-5 w-28 mx-auto" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
            <div className="w-full flex justify-center" style={{ marginTop: '20px', marginBottom: '20px' }}>
              <div style={{ width: '80%', height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
            </div>
            <Skeleton className="h-16 w-16 mx-auto rounded-full" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
            <Skeleton className="h-8 w-20 mx-auto" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
            <Skeleton className="h-5 w-28 mx-auto" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
          </div>
        )}

        {error && (
          <div className="space-y-2 text-center">
            <p style={{ color: '#A1A1AA' }} className="text-sm">
              {error}
            </p>
            <p style={{ color: '#71717A' }} className="text-xs">
              Please try again later.
            </p>
          </div>
        )}

        {!loading && !error && weatherData && (
          <div className="flex flex-col items-center space-y-4">
            {/* Hero Element: Wake-Up Time */}
            <div className="text-center">
              <div 
                style={{ 
                  color: '#F3F4F6', 
                  fontSize: 'calc(1.25rem * 1.3 * 0.9)', 
                  fontWeight: 500,
                  fontFamily: 'Futura, sans-serif',
                  lineHeight: '1.4'
                }}
              >
                7:00 AM Wake-Up
              </div>
              {/* Countdown */}
              <div 
                style={{ 
                  color: '#A1A1AA', 
                  fontSize: '14px',
                  marginTop: '6px',
                  fontWeight: 400,
                  fontFamily: 'Futura, sans-serif'
                }}
              >
                (in {hoursUntilWakeUp} {hoursUntilWakeUp === 1 ? 'hour' : 'hours'})
              </div>
            </div>

            {/* Divider Line */}
            <div className="w-full flex justify-center" style={{ marginTop: '2px', marginBottom: '2px' }}>
              <div style={{ width: '80%', height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
            </div>

            {/* Weather Icon - Elegant Size */}
            <div style={{ fontSize: '52px', lineHeight: '1', marginTop: '4px', marginBottom: '4px' }}>
              {weatherData.emoji}
            </div>

            {/* Temperature */}
            <div 
              style={{ 
                color: '#D4D4D8', 
                fontSize: '24px', 
                fontWeight: 500,
                fontFamily: 'Futura, sans-serif',
                letterSpacing: '-0.02em'
              }}
            >
              {weatherData.temperature}°F
            </div>

            {/* Condition */}
            <div 
              style={{ 
                color: '#A1A1AA', 
                fontSize: '16px',
                fontWeight: 400,
                fontFamily: 'Futura, sans-serif'
              }}
            >
              {weatherData.condition}
            </div>

            {/* Sunrise */}
            <div 
              style={{ 
                color: '#A1A1AA', 
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontFamily: 'Futura, sans-serif'
              }}
            >
              {/* <span>🌅</span> */}
              <span>Sunrise: {weatherData.sunrise}</span>
            </div>

            {/* Divider Line */}
            {showSmartTip && (
              <div className="w-full flex justify-center" style={{ marginTop: '8px', marginBottom: '8px' }}>
                <div style={{ width: '80%', height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
              </div>
            )}

            {/* Smart Tip Box */}
            {showSmartTip && weatherData && (
              <div 
                style={{
                  width: '100%',
                  backgroundColor: 'rgba(255, 200, 100, 0.08)',
                  borderLeft: '3px solid rgba(255, 200, 100, 0.4)',
                  borderRadius: '12px',
                  padding: '14px',
                  marginTop: '6px'
                }}
              >
                <div 
                  style={{ 
                    color: '#D4D4D8', 
                    fontSize: '14px',
                    marginBottom: '10px',
                    fontWeight: 400,
                    fontFamily: 'Futura, sans-serif'
                  }}
                >
                  💡 Tip: {weatherData.tip}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      // Handle "Maybe Later" action
                      console.log('Maybe Later clicked');
                    }}
                    style={{
                      flex: 1,
                      backgroundColor: 'transparent',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#D4D4D8',
                      borderRadius: '8px',
                      padding: '8px 14px',
                      fontSize: '13px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'all 120ms ease',
                      fontFamily: 'Futura, sans-serif'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                    }}
                  >
                    Maybe Later
                  </button>
                  <button
                    onClick={() => {
                      // Handle "Adjust +10 min" action
                      console.log('Adjust +10 min clicked');
                    }}
                    style={{
                      flex: 1,
                      background: 'linear-gradient(90deg, rgba(255, 200, 100, 0.25) 0%, rgba(255, 178, 122, 0.25) 100%)',
                      border: '1px solid rgba(255, 200, 100, 0.3)',
                      color: '#F3F4F6',
                      borderRadius: '8px',
                      padding: '8px 14px',
                      fontSize: '13px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'all 120ms ease',
                      fontFamily: 'Futura, sans-serif'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(90deg, rgba(255, 200, 100, 0.35) 0%, rgba(255, 178, 122, 0.35) 100%)';
                      e.currentTarget.style.borderColor = 'rgba(255, 200, 100, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(90deg, rgba(255, 200, 100, 0.25) 0%, rgba(255, 178, 122, 0.25) 100%)';
                      e.currentTarget.style.borderColor = 'rgba(255, 200, 100, 0.3)';
                    }}
                  >
                    Adjust +10 min
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {!loading && !error && !weatherData && (
          <div className="space-y-2 text-center">
            <p style={{ color: '#A1A1AA' }} className="text-sm">
              Weather data not available
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};
