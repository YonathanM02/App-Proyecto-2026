import Toast from 'react-native-toast-message';
import { esFechaValida } from './formatoFechas';

function mostrarError(titulo, mensaje) {
  Toast.show({ type: 'error', text1: titulo, text2: mensaje });
  return false;
}

export function validarPosicion({ nombre, abreviatura, descripcion }) {
  const nom = (nombre || '').trim();
  const abr = (abreviatura || '').trim();
  const desc = (descripcion || '').trim();

  if (!/^[A-Za-zÀ-ÿ\s]{3,30}$/.test(nom)) {
    return mostrarError('Nombre inválido', 'Debe contener solo letras entre 3 y 30 caracteres.');
  }
  if (!/^[A-Za-zÀ-ÿ]{2,4}$/.test(abr)) {
    return mostrarError('Abreviatura inválida', 'Debe contener solo letras entre 2 y 4 caracteres.');
  }
  if (desc && desc.length > 150) {
    return mostrarError('Descripción muy larga', 'Máximo 150 caracteres permitidos.');
  }
  return true;
}

export function validarCatalogo({ nombre, id_categoria, stock_minimo, talla }) {
  const nom = (nombre || '').trim();
  const stock = String(stock_minimo ?? '').trim();

  if (!/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s\-.]{3,50}$/.test(nom)) {
    return mostrarError('Nombre inválido', 'Debe tener entre 3 y 50 caracteres válidos.');
  }
  if (!id_categoria) {
    return mostrarError('Categoría requerida', 'Selecciona una categoría de catálogo.');
  }
  if (!/^[0-9]+$/.test(stock) || Number(stock) < 0) {
    return mostrarError('Stock mínimo inválido', 'Ingresa un número entero igual o mayor a 0.');
  }
  if (talla && !/^[A-Za-z0-9\s\-/]{1,20}$/.test(talla)) {
    return mostrarError('Talla inválida', 'Formato de talla no permitido.');
  }
  return true;
}

export function validarTorneo({ nombre, fecha_inicio, fecha_fin, ubicacion, estatus }) {
  const nom = (nombre || '').trim();
  const ubi = (ubicacion || '').trim();

  if (!estatus) {
    return mostrarError('Estatus requerido', 'Selecciona el estatus del torneo.');
  }
  if (!/^[A-Za-z0-9áéíóúÁÉÍÓÚñÑ\-\s]{2,40}$/.test(nom)) {
    return mostrarError('Nombre inválido', 'Debe tener entre 2 y 40 caracteres alfanuméricos.');
  }
  if (!esFechaValida(fecha_inicio)) {
    return mostrarError('Fecha de inicio inválida', 'Usa el formato AAAA-MM-DD (ej. 2026-10-24).');
  }
  if (!esFechaValida(fecha_fin)) {
    return mostrarError('Fecha de fin inválida', 'Usa el formato AAAA-MM-DD (ej. 2026-10-25).');
  }
  if (fecha_fin < fecha_inicio) {
    return mostrarError('Rango de fechas inválido', 'La fecha de fin no puede ser anterior a la de inicio.');
  }
  if (!/^[A-Za-z0-9áéíóúÁÉÍÓÚñÑ\s.,#-]{5,150}$/.test(ubi)) {
    return mostrarError('Ubicación inválida', 'Debe contener entre 5 y 150 caracteres.');
  }
  return true;
}

export function validarAtletaPaso(paso, formulario) {
  if (paso === 0) {
    if (!esFechaValida(formulario.fecha_nac)) {
      return mostrarError('Fecha de nacimiento inválida', 'Usa el formato AAAA-MM-DD (ej. 2011-12-07).');
    }
    if (!formulario.lugar_nacimiento.trim() || formulario.lugar_nacimiento.trim().length < 3) {
      return mostrarError('Lugar de nacimiento', 'Ingresa un lugar válido (mínimo 3 caracteres).');
    }
    if (!/^[A-Za-zÀ-ÿ\s]{2,50}$/.test(formulario.nombres.trim())) {
      return mostrarError('Nombres inválidos', 'Ingresa solo letras (2 a 50 caracteres).');
    }
    if (!/^[A-Za-zÀ-ÿ\s]{2,50}$/.test(formulario.apellidos.trim())) {
      return mostrarError('Apellidos inválidos', 'Ingresa solo letras (2 a 50 caracteres).');
    }
    if (
      formulario.doc_identidad.trim() &&
      !/^[A-Za-z0-9-]{6,15}$/.test(formulario.doc_identidad.trim())
    ) {
      return mostrarError('Documento inválido', 'Ingresa entre 6 y 15 dígitos o caracteres.');
    }
    if (!formulario.genero) {
      return mostrarError('Género requerido', 'Selecciona el género del atleta.');
    }
    return true;
  }

  if (paso === 1) {
    if (!formulario.codigo_categoria) {
      return mostrarError('Categoría requerida', 'Selecciona la categoría deportiva.');
    }
    if (!formulario.codigo_posicion) {
      return mostrarError('Posición requerida', 'Selecciona la posición técnica.');
    }
    if (
      formulario.dorsal.trim() &&
      (!/^\d{1,3}$/.test(formulario.dorsal.trim()) || Number(formulario.dorsal) > 99)
    ) {
      return mostrarError('Dorsal inválido', 'El dorsal debe ser un número entre 0 y 99.');
    }
    return true;
  }

  if (paso === 2) {
    if (
      formulario.telefono.trim() &&
      !/^[0-9+\-\s]{7,16}$/.test(formulario.telefono.trim())
    ) {
      return mostrarError('Teléfono inválido', 'Formato ejemplo: 0414-5218934.');
    }
    if (
      formulario.correo.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formulario.correo.trim())
    ) {
      return mostrarError('Correo inválido', 'Ingresa una dirección de correo válida.');
    }
    if (!formulario.direccion.trim() || formulario.direccion.trim().length < 5) {
      return mostrarError('Dirección requerida', 'Ingresa la dirección (mínimo 5 caracteres).');
    }
    return true;
  }

  if (paso === 3) {
    if (
      formulario.peso_kg.trim() &&
      (Number.isNaN(Number(formulario.peso_kg)) || Number(formulario.peso_kg) <= 0)
    ) {
      return mostrarError('Peso inválido', 'Ingresa un valor numérico en kilogramos.');
    }
    if (
      formulario.estatura_cm.trim() &&
      (Number.isNaN(Number(formulario.estatura_cm)) || Number(formulario.estatura_cm) <= 0)
    ) {
      return mostrarError('Estatura inválida', 'Ingresa un valor numérico en centímetros.');
    }
    return true;
  }

  return true;
}
