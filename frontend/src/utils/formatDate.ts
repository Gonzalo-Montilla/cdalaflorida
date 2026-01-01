/**
 * Utilidad para formatear fechas en zona horaria de Colombia (America/Bogota)
 */

const TIMEZONE = 'America/Bogota';
const LOCALE = 'es-CO';

/**
 * Helper: Asegura que la fecha tenga timezone UTC si no tiene ninguno
 */
function ensureUTC(date: string | Date | number): string | Date | number {
  if (typeof date === 'string' && date.includes('T') && !date.endsWith('Z') && !date.includes('+') && !date.includes('-', 10)) {
    // Si tiene hora pero no timezone, agregar 'Z' para indicar UTC
    return date + 'Z';
  }
  return date;
}

/**
 * Formatea una fecha completa con hora
 * @param date - Fecha a formatear (string ISO, Date, o timestamp)
 * @returns Fecha formateada: "25 de noviembre de 2025, 2:30 PM"
 */
export function formatDateTime(date: string | Date | number): string {
  const d = new Date(ensureUTC(date));
  return d.toLocaleString(LOCALE, {
    timeZone: TIMEZONE,
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Formatea una fecha completa con hora (versión corta)
 * @param date - Fecha a formatear
 * @returns Fecha formateada: "25/11/2025, 2:30 PM"
 */
export function formatDateTimeShort(date: string | Date | number): string {
  const d = new Date(ensureUTC(date));
  return d.toLocaleString(LOCALE, {
    timeZone: TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Formatea solo la fecha (sin hora)
 * @param date - Fecha a formatear
 * @returns Fecha formateada: "25 de noviembre de 2025"
 */
export function formatDate(date: string | Date | number): string {
  const d = new Date(ensureUTC(date));
  return d.toLocaleDateString(LOCALE, {
    timeZone: TIMEZONE,
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Formatea solo la fecha (versión corta)
 * @param date - Fecha a formatear
 * @returns Fecha formateada: "25/11/2025"
 */
export function formatDateShort(date: string | Date | number): string {
  const d = new Date(ensureUTC(date));
  return d.toLocaleDateString(LOCALE, {
    timeZone: TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

/**
 * Formatea solo la hora
 * @param date - Fecha a formatear
 * @returns Hora formateada: "2:30 PM"
 */
export function formatTime(date: string | Date | number): string {
  const d = new Date(ensureUTC(date));
  return d.toLocaleTimeString(LOCALE, {
    timeZone: TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Formatea solo la hora (formato 24h)
 * @param date - Fecha a formatear
 * @returns Hora formateada: "14:30"
 */
export function formatTime24(date: string | Date | number): string {
  const d = new Date(ensureUTC(date));
  return d.toLocaleTimeString(LOCALE, {
    timeZone: TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

/**
 * Formatea fecha con día de la semana
 * @param date - Fecha a formatear
 * @returns Fecha formateada: "lunes, 25 de noviembre de 2025"
 */
export function formatDateWithWeekday(date: string | Date | number): string {
  const d = new Date(ensureUTC(date));
  return d.toLocaleDateString(LOCALE, {
    timeZone: TIMEZONE,
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Obtiene la fecha actual en Colombia
 * @returns Date object con la hora actual de Colombia
 */
export function getNow(): Date {
  // Crear fecha ajustada a Colombia
  const now = new Date();
  const colombiaTime = new Date(now.toLocaleString('en-US', { timeZone: TIMEZONE }));
  return colombiaTime;
}

/**
 * Formatea una fecha para input type="date" (YYYY-MM-DD)
 * @param date - Fecha a formatear
 * @returns String en formato YYYY-MM-DD
 */
export function formatDateForInput(date: string | Date | number): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
