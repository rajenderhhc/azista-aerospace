const temperatureConverters = {
  c: {
    f: (c) => (c * 9) / 5 + 32,
    k: (c) => c + 273.15,
    c: (c) => c,
  },
  f: {
    c: (f) => ((f - 32) * 5) / 9,
    k: (f) => ((f - 32) * 5) / 9 + 273.15,
    f: (f) => f,
  },
  k: {
    c: (k) => k - 273.15,
    f: (k) => ((k - 273.15) * 9) / 5 + 32,
    k: (k) => k,
  },
};

export function convertTemperature(value, fromUnit, toUnit, sensor) {
  const from = fromUnit.toLowerCase();
  const to = toUnit.toLowerCase();

  if (!Number(value)) return value;

  if (!temperatureConverters[from] || !temperatureConverters[from][to]) {
    throw new Error(`Unsupported conversion: ${fromUnit} to ${toUnit}`);
  }
  console.log(temperatureConverters[from][to](value));
  const result = temperatureConverters[from][to](value);
  const rounded = Number(result.toFixed(2));

  // Return as-is if it's effectively an integer (e.g., 32.00 → 32)
  return Number.isInteger(rounded) ? Math.trunc(rounded) : rounded;
}
