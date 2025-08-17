export function numberToWords(num: number): string {
  if (isNaN(num)) return "Invalid number";

  const ones = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven",
    "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen",
    "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"
  ];

  const tens = [
    "", "", "Twenty", "Thirty", "Forty", "Fifty",
    "Sixty", "Seventy", "Eighty", "Ninety"
  ];

  const scales = [
    "", "Thousand", "Lakh", "Crore", "Arab", "Kharab" // Indian system
  ];

  function convertChunk(n: number): string {
    let str = "";
    if (n >= 100) {
      str += ones[Math.floor(n / 100)] + " Hundred";
      n = n % 100;
      if (n > 0) str += " ";
    }
    if (n >= 20) {
      str += tens[Math.floor(n / 10)];
      if (n % 10 > 0) str += " " + ones[n % 10];
    } else if (n > 0) {
      str += ones[n];
    }
    return str.trim();
  }

  function convertIntegerPart(n: number): string {
    if (n === 0) return "Zero";
    let str = "";

    // Split number according to Indian system (last 3 digits, then 2-2)
    const parts: number[] = [];
    parts.push(n % 1000); // last 3 digits
    n = Math.floor(n / 1000);

    while (n > 0) {
      parts.push(n % 100); // next 2 digits
      n = Math.floor(n / 100);
    }

    for (let i = parts.length - 1; i >= 0; i--) {
      if (parts[i] > 0) {
        str += convertChunk(parts[i]) + (scales[i] ? " " + scales[i] : "") + " ";
      }
    }

    return str.trim();
  }

  // Split integer and decimal parts
  const integerPart = Math.floor(num);
  const decimalPart = Math.round((num - integerPart) * 100); // Paise

  let result = convertIntegerPart(integerPart);

  // Handle "Rupee/Rupees"
  result += integerPart === 1 ? " Rupee" : " Rupees";

  if (decimalPart > 0) {
    result += " and " + convertIntegerPart(decimalPart);
    result += decimalPart === 1 ? " Paisa" : " Paise";
  }

  return result.toUpperCase();
}
