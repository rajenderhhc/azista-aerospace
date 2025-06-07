/* eslint-disable no-loop-func */
// Meaningful colors for each sensor
const SENSOR_COLORS = {
  Humidity: '#457B9D', // Blue (Water)
  'Atmospheric Pressure': '#E9C46A', // Yellow (Pressure)
  'Wind Direction': '#2A9D8F', // Green (Wind)
  'Wind Speed': '#1F77B4', // Light Blue (Motion)
  'Air Temperature': '#E63946', // Red (Heat)
  'Daily Rain': '#A8DADC', // Grayish-Blue (Rain)
  'Hourly Rainfall': '#005F73', // Darker Blue (Heavy Rain)
  'Battery Voltage': '#F4A261', // Orange (Power)
};

// Function to generate a random color (ensuring a broader range of visible colors)
const generateRandomColor = () => {
  const letters = '0123456789ABCDEF'; // Wider color range
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * letters.length)];
  }
  return color;
};

// Get color for a given sensor
export const getSensorColor = (sensorName) => {
  if (!SENSOR_COLORS[sensorName]) {
    // If color doesn't exist, create one
    SENSOR_COLORS[sensorName] = generateRandomColor();
  }
  return SENSOR_COLORS[sensorName];
};

// --- Simulating 1000 weather report entries with different times and values ---

const sensors = [
  'Air Temperature',
  'Humidity',
  'Atmospheric Pressure',
  'Battery Voltage',
  'Daily Rain',
  'Rain Rate',
  'Wind Speed',
  'Wind Direction',
  'WIND GUST',
  '15 Mins RAINFALL',
  'WIND DIRECTION AT MAX WIND SPEED',
];

export const generateFakeWeatherData = () => {
  const data = [];
  const startDate = new Date('2025-04-02T06:45:00'); // Correct date format (YYYY-MM-DDTHH:mm:ss)
  let idCounter = 1;

  // Define sensors array
  const sensors = [
    'Air Temperature',
    'Humidity',
    'Atmospheric Pressure',
    'Battery Voltage',
    'Daily Rain',
    '15 Mins RAINFALL',
    'Rain Rate',
    'Wind Speed',
    'WIND GUST',
    'Wind Direction',
    'WIND DIRECTION AT MAX WIND SPEED',
  ];

  // Helper function to pad single digits with zero
  const pad = (n) => n.toString().padStart(2, '0');

  for (let i = 0; i < 100000; i++) {
    const currentDateTime = new Date(startDate.getTime() + i * 5 * 60 * 1000); // 5 minutes apart

    const formattedDateTime = `${pad(currentDateTime.getDate())}-${pad(
      currentDateTime.getMonth() + 1
    )}-${currentDateTime.getFullYear()} ${pad(
      currentDateTime.getHours()
    )}:${pad(currentDateTime.getMinutes())}`;

    sensors.forEach((sensor) => {
      let value = '0';

      // Generate random realistic values for each sensor
      switch (sensor) {
        case 'Air Temperature':
          value = `${(20 + Math.random() * 15).toFixed(1)} (°C)`;
          break;
        case 'Humidity':
          value = `${(30 + Math.random() * 70).toFixed(0)} (%RH)`;
          break;
        case 'Atmospheric Pressure':
          value = `${(990 + Math.random() * 30).toFixed(1)} (hPa)`;
          break;
        case 'Battery Voltage':
          value = `${(12 + Math.random() * 2).toFixed(1)} (V)`;
          break;
        case 'Daily Rain':
        case '15 Mins RAINFALL':
          value = `${(Math.random() * 5).toFixed(1)} (mm)`;
          break;
        case 'Rain Rate':
          value = `${(Math.random() * 10).toFixed(1)} (mm/hr)`;
          break;
        case 'Wind Speed':
        case 'WIND GUST':
          value = `${(Math.random() * 15).toFixed(1)} (m/s)`;
          break;
        case 'Wind Direction':
        case 'WIND DIRECTION AT MAX WIND SPEED':
          value = `${Math.floor(Math.random() * 360)} (Deg.)`;
          break;
        default:
          value = '0';
      }

      data.push({
        _id: `id_${idCounter++}`,
        sensorName: sensor,
        stationId: 'BDC00001',
        currentValue: value,
        datetime: formattedDateTime,
      });
    });
  }

  return data;
};

const generateSensorDataArray = (baseValue, count, baseTime, timeStep) => {
  const dataArray = [];

  for (let i = 0; i < count; i++) {
    const time = new Date(baseTime.getTime() + i * timeStep);

    // Generate a random fluctuation around base value
    const fluctuation = (Math.random() - 0.5) * 20; // ±10 range
    const avg = baseValue + fluctuation;
    const high = avg + Math.random() * 5;
    const low = avg - Math.random() * 5;

    dataArray.push({
      avg: +avg.toFixed(2),
      current: null,
      high: +high.toFixed(2),
      low: +low.toFixed(2),
      time: time.toISOString(), // Full ISO timestamp
    });
  }

  return dataArray;
};

// Usage:
const baseValue = 297;
const count = 1000;
const baseTime = new Date('2025-04-02');
const timeStep = 100000;

export const getDummySensorData = () => {
  return generateSensorDataArray(baseValue, count, baseTime, timeStep);
};
