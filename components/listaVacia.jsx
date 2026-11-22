import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';

export default function ListaVacia({
  icono,
  titulo = 'No se encontraron registros',
  subtitulo,
}) {
  const { colores } = useTheme();

  return (
    <View
      style={[
        estilos.contenedor,
        {
          backgroundColor: colores.tarjeta,
          borderColor: colores.bordeForm,
        },
      ]}
    >
      {icono ? (
        <View style={[estilos.cajaIcono, { backgroundColor: colores.fondoTranslucido }]}>
          {icono}
        </View>
      ) : null}
      <Text style={[estilos.titulo, { color: colores.primario }]}>{titulo}</Text>
      {subtitulo ? (
        <Text style={[estilos.subtitulo, { color: colores.textoClaro }]}>{subtitulo}</Text>
      ) : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    width: '100%',
    padding: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  cajaIcono: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  titulo: {
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 4,
  },
});
