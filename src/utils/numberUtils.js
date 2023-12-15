export function formatNumberWithSpaces(value) {
  if (typeof value === 'number') {
    const parts = value.toFixed(2).toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return parts.join(',');
  } else if (typeof value === 'string') {
    if (value === '-') {
      return value; // Retourne simplement le "-"
    }
    const numericValue = parseFloat(value);
    if (!isNaN(numericValue)) {
      return formatNumberWithSpaces(numericValue);
    }
  }
  return value;
}

export function formatNumberWithSpacesAndWithoutvirgul(value) {
  if (typeof value === 'number') {
    const integerValue = Math.floor(value);
    const formattedValue = integerValue.toLocaleString();
    return formattedValue.replace(/,/g, '');
  } else if (typeof value === 'string') {
    if (value === '-') {
      return value;
    }
    const numericValue = parseFloat(value);
    if (!isNaN(numericValue)) {
      return formatNumberWithSpacesAndWithoutvirgul(numericValue);
    }
  }
  return value;
}
