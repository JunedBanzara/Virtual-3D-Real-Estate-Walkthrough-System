/**
 * Measurement Unit Utility
 * Canonical internal unit: METRES (m)
 * Supported display units: 'mm', 'cm', 'm', 'in'
 */

export const UNIT_CONFIGS = {
  mm: {
    id: 'mm',
    name: 'Millimetres',
    symbol: 'mm',
    toMetres: 0.001,
    fromMetres: 1000,
    decimals: 0,
    step: 50,
    placeholder: 'e.g. 5000'
  },
  cm: {
    id: 'cm',
    name: 'Centimetres',
    symbol: 'cm',
    toMetres: 0.01,
    fromMetres: 100,
    decimals: 1,
    step: 5,
    placeholder: 'e.g. 500'
  },
  m: {
    id: 'm',
    name: 'Metres',
    symbol: 'm',
    toMetres: 1.0,
    fromMetres: 1.0,
    decimals: 2,
    step: 0.1,
    placeholder: 'e.g. 5.0'
  },
  in: {
    id: 'in',
    name: 'Inches',
    symbol: 'in',
    toMetres: 0.0254,
    fromMetres: 39.37007874015748,
    decimals: 1,
    step: 2,
    placeholder: 'e.g. 196.8'
  }
};

export const SUPPORTED_UNITS = ['mm', 'cm', 'm', 'in'];

/**
 * Converts value from given display unit to canonical metres
 */
export function toCanonicalMeters(value, fromUnit = 'mm') {
  const num = Number(value);
  if (isNaN(num)) return 0;
  const config = UNIT_CONFIGS[fromUnit] || UNIT_CONFIGS.m;
  return num * config.toMetres;
}

/**
 * Converts canonical metres to value in specified display unit
 */
export function fromCanonicalMeters(meters, toUnit = 'mm', decimals = null) {
  const num = Number(meters);
  if (isNaN(num)) return 0;
  const config = UNIT_CONFIGS[toUnit] || UNIT_CONFIGS.m;
  const converted = num * config.fromMetres;
  const dec = decimals !== null ? decimals : config.decimals;
  return Number(converted.toFixed(dec));
}

/**
 * Formats a measurement in metres into a display string with unit
 */
export function formatMeasurement(meters, toUnit = 'm') {
  const val = fromCanonicalMeters(meters, toUnit);
  const config = UNIT_CONFIGS[toUnit] || UNIT_CONFIGS.m;
  return `${val} ${config.symbol}`;
}

/**
 * Formats currency in Indian Rupees (INR)
 */
export function formatINR(amount) {
  const num = Math.round(Number(amount) || 0);
  return '₹' + num.toLocaleString('en-IN');
}
