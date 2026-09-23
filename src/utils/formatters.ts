// src/utils/formatters.ts

export function getJobCode(id: string, location?: string): string {
  if (!id) return '#VAG-000';

  // Pega uma sigla de 3 letras da cidade (ou 'CAR' de Carrantos por padrão)
  let prefix = 'CAR';
  if (location) {
    const cleanLocation = location.trim().toUpperCase();
    if (cleanLocation.includes('ITATIBA')) prefix = 'ITA';
    else if (cleanLocation.includes('LOUVEIRA')) prefix = 'LOU';
    else if (cleanLocation.includes('CAMPINAS')) prefix = 'CMP';
    else if (cleanLocation.includes('ATIBAIA')) prefix = 'ATB';
    else if (cleanLocation.includes('JUNDIAÍ') || cleanLocation.includes('JUNDIAI')) prefix = 'JUN';
    else prefix = cleanLocation.slice(0, 3);
  }

  // Pega os primeiros 4 caracteres do ID (UUID) em maiúsculo
  const shortId = id.replace(/-/g, '').slice(0, 4).toUpperCase();

  return `#${prefix}-${shortId}`;
}