import React, { useState, useEffect, useContext } from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CLAVE_TEMA = 'cannibals_tema_usuario';

export const COLORES_CLARO = {
  primario: '#32AF0A',
  primarioOscuro: '#268807',
  primarioBrillante: '#34D314',
  fondoTranslucido: 'rgba(50, 175, 10, 0.14)',
  fondoPrincipal: '#f2f3f5',
  fondoContraste: '#e9ecf1',
  tarjeta: '#ffffff',
  fondoForm: '#f8f8f8',
  bordeForm: '#c8d1e0',
  bordePrimario: '#32AF0A',
  textoPrincipal: '#1F283B',
  textoSecundario: '#3a4750',
  textoClaro: '#6b7280',
  textoContraste: '#ffffff',
  peligro: '#ef4444',
  peligroBg: 'rgba(239, 68, 68, 0.14)',
  advertencia: '#d97706',
  advertenciaBg: 'rgba(241, 177, 0, 0.18)',
  exito: '#32AF0A',
  exitoBg: 'rgba(0, 162, 0, 0.16)',
  gris: '#64748b',
  grisBg: 'rgba(100, 116, 139, 0.16)',
  azul: '#007bff',
  azulBg: 'rgba(0, 123, 255, 0.15)',
  morado: '#8800ff',
  naranja: '#f59e0b',
  encabezadoBg: '#ffffff',
  menuBg: '#f2f3f5',
  barraTabsBg: '#ffffff',
};

export const COLORES_OSCURO = {
  primario: '#32AF0A',
  primarioOscuro: '#268807',
  primarioBrillante: '#34D314',
  fondoTranslucido: 'rgba(50, 175, 10, 0.22)',
  fondoPrincipal: '#0f151b',
  fondoContraste: '#172029',
  tarjeta: '#1e293b',
  fondoForm: '#1e293b',
  bordeForm: '#334155',
  bordePrimario: '#32AF0A',
  textoPrincipal: '#f8fafc',
  textoSecundario: '#cbd5e1',
  textoClaro: '#94a3b8',
  textoContraste: '#ffffff',
  peligro: '#ef4444',
  peligroBg: 'rgba(239, 68, 68, 0.2)',
  advertencia: '#f59e0b',
  advertenciaBg: 'rgba(245, 158, 11, 0.2)',
  exito: '#34D314',
  exitoBg: 'rgba(50, 175, 10, 0.22)',
  gris: '#94a3b8',
  grisBg: 'rgba(148, 163, 184, 0.2)',
  azul: '#38bdf8',
  azulBg: 'rgba(56, 189, 248, 0.18)',
  morado: '#a855f7',
  naranja: '#fb923c',
  encabezadoBg: '#0f151b',
  menuBg: '#0f151b',
  barraTabsBg: '#172029',
};

const TemaContext = React.createContext({
  tema: 'claro',
  esOscuro: false,
  colores: COLORES_CLARO,
  cambiarTema: () => {},
});

export function ThemeProvider({ children }) {
  const esquemaSistema = Appearance.getColorScheme();
  const [tema, setTema] = useState(esquemaSistema === 'dark' ? 'oscuro' : 'claro');

  useEffect(() => {
    const cargarTema = async () => {
      try {
        const temaGuardado = await AsyncStorage.getItem(CLAVE_TEMA);
        if (temaGuardado === 'claro' || temaGuardado === 'oscuro') {
          setTema(temaGuardado);
        }
      } catch (_err) {}
    };
    cargarTema();
  }, []);

  const cambiarTema = async () => {
    const nuevoTema = tema === 'claro' ? 'oscuro' : 'claro';
    setTema(nuevoTema);
    try {
      await AsyncStorage.setItem(CLAVE_TEMA, nuevoTema);
    } catch (_err) {}
  };

  const esOscuro = tema === 'oscuro';
  const colores = esOscuro ? COLORES_OSCURO : COLORES_CLARO;

  return (
    <TemaContext.Provider value={{ tema, esOscuro, colores, cambiarTema }}>
      {children}
    </TemaContext.Provider>
  );
}

export const useTheme = () => useContext(TemaContext);
