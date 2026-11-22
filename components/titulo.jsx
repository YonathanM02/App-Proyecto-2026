import { Text, View, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';

export default function Titulo({ titulo, subtitulo, color, style }) {
  const { colores } = useTheme();

  return (
    <View style={[estilos.contenedor, style]}>
      <Text style={[estilos.titulo, { color: color || colores.textoPrincipal }]}>
        {titulo}
      </Text>
      {subtitulo ? (
        <Text style={[estilos.subtitulo, { color: colores.textoClaro }]}>{subtitulo}</Text>
      ) : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    marginVertical: 4,
  },
  titulo: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  subtitulo: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
  },
});
