const MESES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

export function formatearFechaLarga(fechaTexto) {
  if (!fechaTexto) return 'No Aplica';
  const partes = String(fechaTexto).split('-');
  if (partes.length !== 3) return fechaTexto;
  const [anio, mes, dia] = partes;
  const indiceMes = parseInt(mes, 10) - 1;
  if (Number.isNaN(indiceMes) || indiceMes < 0 || indiceMes > 11) return fechaTexto;
  return `${dia} de ${MESES[indiceMes]} de ${anio}`;
}

export function formatearFechaCorta(fechaTexto) {
  if (!fechaTexto) return 'N/A';
  const partes = String(fechaTexto).split('-');
  if (partes.length !== 3) return fechaTexto;
  const [anio, mes, dia] = partes;
  const indiceMes = parseInt(mes, 10) - 1;
  if (Number.isNaN(indiceMes) || indiceMes < 0 || indiceMes > 11) return fechaTexto;
  return `${dia} ${MESES[indiceMes].slice(0, 3)} ${anio}`;
}

export function calcularEdadCalendario(fechaNac) {
  if (!fechaNac) return null;
  const anio = parseInt(String(fechaNac).split('-')[0], 10);
  if (Number.isNaN(anio)) return null;
  return new Date().getFullYear() - anio;
}

export function esFechaValida(fechaTexto) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(fechaTexto || ''))) return false;
  const [anio, mes, dia] = fechaTexto.split('-').map(Number);
  const fecha = new Date(anio, mes - 1, dia);
  return (
    fecha.getFullYear() === anio &&
    fecha.getMonth() === mes - 1 &&
    fecha.getDate() === dia
  );
}
