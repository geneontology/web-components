export function darken(color, factor) {
  const newColor = [...color];
  for (let i = 0; i < newColor.length; i++) {
    if (newColor[i] < 255) {
      newColor[i] = Math.round(Math.max(0, newColor[i] * (1 - factor)));
    }
  }
  // newColor[0] = Math.min(255, Math.round(newColor[0] * (1 + factor)));
  return newColor;
}

/**
 * Return a color based on interpolation (count, minColor, maxColor) and normalized by maxHeatLevel
 * @param {*} count
 * @param {*} maxHeatLevel
 */
export function heatColor(
  level,
  maxHeatLevel,
  minColor,
  maxColor,
  binaryColor = false,
) {
  if (level === 0) {
    return toRGB(minColor);
  }

  if (binaryColor) {
    return toRGB(maxColor);
  }

  // this is a linear version for interpolation
  // let fraction = Math.min(level, maxHeatLevel) / maxHeatLevel;

  // this is the log version for interpolation (better highlight the most annotated classes)
  // note: safari needs integer and not float for rgb function
  const fraction =
    Math.min(10 * Math.log(level + 1), maxHeatLevel) / maxHeatLevel;

  // there are some annotations and we want a continuous color (r, g, b)
  const itemColor = []; // [r,g,b]
  itemColor[0] = Math.round(
    minColor[0] + fraction * (maxColor[0] - minColor[0]),
  );
  itemColor[1] = Math.round(
    minColor[1] + fraction * (maxColor[1] - minColor[1]),
  );
  itemColor[2] = Math.round(
    minColor[2] + fraction * (maxColor[2] - minColor[2]),
  );

  return toRGB(itemColor);
}

function toRGB(array) {
  return "rgb(" + array[0] + "," + array[1] + "," + array[2] + ")";
}
