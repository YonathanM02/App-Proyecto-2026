import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';

// Variantes de estatus iguales a las del sistema web Cannibals Lara
export default function Etiqueta({ texto, tipo = 'verde', style }) {
  const { colores } = useTheme();

  const mapaTipos = {
    verde: { color: colores.exito, bg: colores.exitoBg },
    amarillo: { color: colores.advertencia, bg: colores.advertenciaBg },
    rojo: { color: colores.peligro, bg: colores.peligroBg },
    gris: { color: colores.gris, bg: colores.grisBg },
    azul: { color: colores.azul, bg: colores.azulBg },
  };

  const paleta = mapaTipos[tipo] || mapaTipos.verde;

  return (
    <View style={[estilos.caja, { backgroundColor: paleta.bg }, style]}>
      <Text style={[estilos.texto, { color: paleta.color }]}>{texto}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  caja: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  texto: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
});
