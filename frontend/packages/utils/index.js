/* eslint-disable array-callback-return */
import { VariableType } from '@ais/graphql';
import tinycolor from 'tinycolor2';

// Re-export config from dedicated config module
export {
  API_URL, BACKEND_CALL_TYPE, BACKEND_URL,
  CONTEXT_PATH, dateFormats, ENCRYPT_ON_TRANSIT,
  GRAPHQL_URL, HTTP_HEADERS
} from './config.js';

export const findfirstChildPath = (data) => {
  var firstChild = {};
  if (Array.isArray(data) && data.length > 0)
    firstChild = findFirstShowInMenu(data);

  if (firstChild == null || firstChild == undefined) return '/error';

  if ('children' in firstChild && firstChild['showInMenu']) {
    if (firstChild['subMenu'] && firstChild['children'].length > 0)
      return findfirstChildPath(firstChild['children']);
    return firstChild['path'];
  }
};

export const findFirstShowInMenu = (arr) => {
  if (Array.isArray(arr)) {
    return arr.find((e) => {
      return e['showInMenu'] === true;
    });
  }
};

export function arrayToJson(arr) {
  if (!Array.isArray(arr)) return null;

  var newObj = {};

  arr.forEach((key, i) => {
    newObj[key] = key;
  });

  return newObj;
}

export function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function reduceJson(json, key, value) {
  return json.filter((item) => item[key] >= value);
}

export function reduceArrayByKey(arr, key) {
  if (Array.isArray(arr)) {
    return arr.reduce((item) => {
      return item[key];
    });
  }
  return arr;
}

export function filterArray(arr, key) {
  return arr.filter((item) => item[key]);
}

export function filterArrayWithCustomKey(arr, key, val) {
  return arr.filter((item) => item[key] === val);
}

export function JsonArrayToArray(arr, key) {
  return arr.map((item) => item[key]);
}

export function findObject(json, key, value) {
  if (!Array.isArray(json)) return null;

  for (const obj of json) {
    if (typeof obj === 'object' && obj != null) {
      if (obj[key] === value) {
        return obj; // FOUND 🎉
      }

      if (obj.children) {
        const found = findObject(obj.children, key, value);
        if (found) return found;
      }
    }
  }

  return null;
}

export function mergeJson(prevState, newState) {
  Object.keys(newState).forEach((key, i) => {
    prevState[key] = newState[key];
  });

  return prevState;
}

export function isColorLight(color) {
  return tinycolor(color).isLight();
}

export function isColorDark(color) {
  return tinycolor(color).isDark();
}

export function findTextColor(backgroundColor) {
  var c = tinycolor(backgroundColor);
  return c.isDark() ? c.lighten(50) : c.darken(50);
}

export function mixColors(color1, color2, depth) {
  console.warn(color1);
  console.warn(color2);
  const hexToRgb = (hex) => {
    const bigint = parseInt(hex.substring(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return [r, g, b];
  };
  const rgbToHex = (r, g, b) => {
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };

  const [r1, g1, b1] = hexToRgb(color1);
  const [r2, g2, b2] = hexToRgb(color2);

  const mixColor = rgbToHex(
    Math.floor((r1 + r2) / depth),
    Math.floor((g1 + g2) / depth),
    Math.floor((b1 + b2) / depth),
  );

  return mixColor;
}

export function flattenArray(arr, SEPARATOR = '.') {
  if (Array.isArray(arr)) {
    return arr.map((data, index) => {
      return flattenJson(data, '', SEPARATOR);
    });
  } else {
    return flattenJson(arr, '', SEPARATOR);
  }
}

export function flattenJson(data, k = '', SEPARATOR = '.') {
  if (data == null) return data;

  const arr = Array.isArray(data) ? data : [data];

  return arr.reduce((acc, obj) => {
    if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
      Object.keys(obj).forEach((key) => {
        if (
          typeof obj[key] === 'object' &&
          !Array.isArray(obj[key]) &&
          obj[key] != null
        ) {
          acc = { ...acc, ...flattenJson([obj[key]], key, SEPARATOR) };
        } else if (obj[key] != null) {
          acc[`${k ? k + SEPARATOR : ''}` + key] = obj[key];
        }
      });
    }
    return acc;
  }, {});
}

export function groupJsonByKey(data, key) {
  if (!Array.isArray(data)) {
    console.warn('Data is not an array');
    return null;
  }

  return data.reduce((newObj, currentItem) => {
    const val = currentItem[key];
    if (!newObj[val]) {
      newObj[val] = [currentItem];
    } else {
      newObj[val].push(currentItem);
    }
    return newObj;
  }, {});
}

export function filterJson(data, key, value) {
  if (!Array.isArray(data)) {
    console.warn('Data is not an array');
    return null;
  }
  if (value === 0) return [];
  return data.filter((item) => item[key] === value);
}

export function sortArray(data, key) {
  if (!Array.isArray(data)) return [];
  if (data.length <= 1) return data;
  return data.sort((a, b) => {
    if (a[key] < b[key]) {
      return -1;
    } else if (a[key] > b[key]) {
      return 1;
    } else {
      return 0;
    }
  });
}

export function storeInSession(key, value) {
  sessionStorage.setItem(key, value);
}

export function getFromSession(key) {
  const data = sessionStorage.getItem(key);
  if (data === null || data === undefined) return null;
}

export function ChangeStyle(key, value) {
  document.documentElement.style.setProperty(key, value);
}

export function generateRandomNumber() {
  //generates 4 digit random number
  let num = Math.floor(Math.random() * 1000);
  return num;
}

export function isPrime(num) {
  for (let i = 2, s = Math.sqrt(num); i <= s; i++) {
    if (num % i === 0) return false;
  }
  return num > 1;
}

export function FindDayofMonth() {
  const currentDate = new Date();
  return currentDate.getDate();
}

export function FindDayofYear() {
  const currentDate = new Date();
  const startOfYear = new Date(currentDate.getFullYear(), 0, 0);

  const diff = currentDate - startOfYear;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  return dayOfYear;
}

const getPrimes = (min, max) => {
  const result = Array(max + 1)
    .fill(0)
    .map((_, i) => i);
  for (let i = 2; i <= Math.sqrt(max + 1); i++) {
    for (let j = i ** 2; j < max + 1; j += i) delete result[j];
  }
  return Object.values(result.slice(Math.max(min, 2)));
};

const getRandNum = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const getRandPrime = (min, max) => {
  const primes = getPrimes(min, max);
  return primes[getRandNum(0, primes.length - 1)];
};

export function getStyle(key) {
  document.documentElement.style.getPropertyValue(key);
}

export const toCamelCase = (str) => {
  if (str === null || str === undefined || typeof str != 'string') return str;
  return str
    .split(/[^a-zA-Z0-9]/)
    .map((word) => {
      return capitalize(word);
    })
    .join('');
};

export const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

// export function sortArray(data, key) {
//   if (Array.isArray(data)) {
//     return data.sort(function (a, b) {
//       return a[key] - b[key];
//     });
//   } else {
//     return data;
//   }
// }

export function convertToMultiLevel(data, uniqueKey, key) {
  //data should be array ,
  //uniquekey should be a value that is unique for whole json say id
  //key is the groupby key parentID

  var dt = data;
  const fMap = new Map();
  if (!Array.isArray(dt)) return null;
  dt.forEach((item) => {
    item.children = []; // static key for subLevels for easy identifications
    fMap.set(item[uniqueKey], item);
  });

  dt.forEach((item) => {
    const keyData = parseInt(item[key]);

    if (keyData !== null && keyData !== undefined && fMap.has(keyData)) {
      //matches with teh uniqueKey
      fMap.get(keyData).children.push(item);
    }
  });

  const topLevel = dt
    .filter((item) => item[key] === null || item[key] === undefined)
    .map((item) => fMap.get(item[uniqueKey]));
  return topLevel;
}

export function groupby(arr, key) {
  if (!Array.isArray(arr)) return arr;

  return arr.reduce((result, current) => {
    const groupKey = current[key];
    if (!result[groupKey]) {
      result[groupKey] = [];
    }

    result[groupKey].push(current);
    return result;
  }, {});
}

export function hasKey(obj, key) {
  if (obj === null || typeof obj !== 'object') return false;
  if (key in obj) return true;

  if (obj instanceof VariableType && obj.value === key) return true;

  return Object.values(obj).some((value) => hasKey(value, key));
}

export function getBrowser() {
  const userAgent = navigator.userAgent;

  if (userAgent.includes('Edg')) {
    return 'EDGE';
  } else if (userAgent.includes('Firefox')) {
    return 'FIREFOX';
  } else if (userAgent.includes('Chrome')) {
    return 'CHROME';
  } else if (userAgent.includes('Safari')) {
    return 'SAFARI';
  } else {
    return 'Unknown Browser';
  }
}


export function convertGraphQLInputToGroup(gqlInput) {
  return {
    id: gqlInput.id,
    type: gqlInput.type,
    conditions: gqlInput?.conditions.map((item) => {

      if (item.group) {
        console.log("into item group", item.group);
        // It's a nested group in GraphQL format: { group: { ... } }
        // Recursively call the function to process the nested group object
        if ("conditions" in item.group) {
          return convertGraphQLInputToGroup(item.group);
        }
      } else if (item.condition) {
        console.log("into item condition");

        // It's a single condition in GraphQL format: { condition: { field: ..., ... } }
        const cond = item.condition;
        return {
          // Map the GraphQL keys back to the frontend keys
          fieldName: cond.fieldName,
          operator: cond.operator,
          valueType: cond.valueType,
          conditionType: cond.conditionType,
          value: "value" in cond && cond['value'] ? cond.value.split(",") : [],
          id: cond.id,
          fact: cond.fact,
          offsetValue: cond.offsetValue,
          offsetUnit: cond.offsetUnit,
          listType: cond.listType,
          listField: cond.listField,
          range: "range" in cond && cond['range'] ? cond.range.split(",") : [],
          condition: cond.condition

          // You may need to add other fields like 'valueType' if they were present
          // in the original frontend condition object but omitted in the GraphQL 'condition'
          // For example: valueType: cond.valueType,
        };
      }
      // Fallback for unexpected item structure
      return {};
    }),
  };
}



export function convertGroupToGraphQLInput(group) {
  return {
    type: group.type,
    conditions: group.conditions.map((item) => {
      if ("type" in item) {
        // It's a nested group
        return {
          group: convertGroupToGraphQLInput(item),
        };
      } else {
        // It's a condition
        const cond = item;
        return {
          condition: {
            id: cond.id,
            fieldName: cond.fieldName,
            operator: cond.operator,
            valueType: cond.valueType,
            conditionType: cond.conditionType,
            value: cond.value.join(","),
            fact: cond.fact,
            offsetValue: cond.offsetValue,
            offsetUnit: cond.offsetUnit,
            listType: cond.listType,
            listField: cond.listField,
            range: sanitizeEmpty("range" in cond ? cond.range.join(",") : ""),
            condition: sanitizeEmpty(cond.condition)
          },
        };
      }
    }),
  };
}


export function updateFilters(currentFilters, updateObj, operator = "EQUAL") {
  let updatedFilters = [...currentFilters];

  Object.entries(updateObj).forEach(([field, value]) => {
    const idx = updatedFilters.findIndex(f => f.field === field);

    const isEmpty =
      value === "" ||
      value === null ||
      value === undefined ||
      (Array.isArray(value) && value.length === 0);

    if (idx >= 0) {
      // If empty → remove filter
      if (isEmpty) {
        updatedFilters.splice(idx, 1);
      } else {
        // Update existing
        updatedFilters[idx] = {
          ...updatedFilters[idx],
          value
        };
      }
    } else {
      // Add new only if not empty
      if (!isEmpty) {
        updatedFilters.push({
          field,
          operator,
          value
        });
      }
    }
  });

  return updatedFilters;
}


export function sanitizeEmpty(value) {
  // Null or undefined → null
  if (value === null || value === undefined) return null;

  // String → trim and check emptiness
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed === "" ? null : trimmed;
  }

  // Array → sanitize each item, remove nulls
  if (Array.isArray(value)) {
    const sanitizedArray = value
      .map(item => sanitizeEmpty(item))
      .filter(item => item !== null);

    return sanitizedArray.length > 0 ? sanitizedArray : null;
  }

  // Object → sanitize each property, remove keys that become null
  if (typeof value === "object") {
    const sanitizedObj = {};

    for (const key in value) {
      const sanitizedVal = sanitizeEmpty(value[key]);
      if (sanitizedVal !== null) {
        sanitizedObj[key] = sanitizedVal;
      }
    }

    return Object.keys(sanitizedObj).length > 0 ? sanitizedObj : null;
  }

  // Other primitive values (numbers, booleans)
  return value;
}

// Theme variable mapping and runtime helpers
export const THEME_VARIABLE_MAP = {
  primaryColor: '--color-primary',
  secondaryColor: '--color-secondary',
  accentColor: '--color-accent',
  textColor: '--color-text',
  colorWhite: '--color-white',
  borderRadius: '--border-radius',
  fontFamily: '--font-family',
};

const THEME_DEFAULTS = {
  primaryColor: 'red',
  secondaryColor: '#0369a1',
  accentColor: '#f59e0b',
  textColor: '#1f2937',
  colorWhite: '#ffffff',
  borderRadius: '0.5rem',
  fontFamily: 'Inter, sans-serif',
};

export function buildCssVarsFromConfig(config = {}) {
  const merged = { ...THEME_DEFAULTS, ...(config || {}) };
  const theme = merged.theme || {};

  return {
    [THEME_VARIABLE_MAP.primaryColor]: merged.primaryColor,
    [THEME_VARIABLE_MAP.secondaryColor]: merged.secondaryColor,
    [THEME_VARIABLE_MAP.accentColor]: merged.accentColor,
    [THEME_VARIABLE_MAP.textColor]: merged.textColor,
    [THEME_VARIABLE_MAP.colorWhite]: merged.colorWhite || THEME_DEFAULTS.colorWhite,
    [THEME_VARIABLE_MAP.borderRadius]: theme.borderRadius || THEME_DEFAULTS.borderRadius,
    [THEME_VARIABLE_MAP.fontFamily]: theme.fontFamily || THEME_DEFAULTS.fontFamily,
  };
}

export function applyCssVarsToDocument(config = {}) {
  if (typeof document === 'undefined') return;
  const vars = buildCssVarsFromConfig(config);
  Object.entries(vars).forEach(([key, value]) => {
    try {
      document.documentElement.style.setProperty(key, value);
    } catch (e) {
      // ignore in non-browser environments
    }
  });
}



