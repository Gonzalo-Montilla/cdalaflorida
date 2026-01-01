/**
 * Formatea un número como moneda colombiana sin decimales
 * 
 * @param value - Valor numérico a formatear
 * @returns String formateado con separadores de miles (ej: "317.848" en lugar de "317.848,00")
 * 
 * @example
 * formatCurrency(317848) // "317.848"
 * formatCurrency(50000) // "50.000"
 * formatCurrency(1500) // "1.500"
 */
export function formatCurrency(value: number): string {
  return value.toLocaleString('es-CO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}
