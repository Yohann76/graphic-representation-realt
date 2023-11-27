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
      return formatNumberWithSpaces(numericValue); // Récursion pour formater le nombre
    }
  }
  return value; // Si la valeur n'est ni un nombre ni "-", retourne la valeur telle quelle
}
