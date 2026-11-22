import { Text, Pressable, StyleSheet, View } from 'react-native';
import { useTheme } from '../hooks/useTheme';

export default function Boton({
  onPress,
  titulo,
  variante = 'primario',
  colorFondo,
  colorLetra,
  colorPresionado,
  ancho,
  tamanoTexto = 14,
  icono,
  deshabilitado = false,
  style,
}) {
  const { colores } = useTheme();

  const mapaVariantes = {
    primario: {
      fondo: colores.primario,
      presionado: colores.primarioOscuro,
      texto: '#ffffff',
      borde: 'transparent',
    },
    secundario: {
      fondo: colores.textoSecundario,
      presionado: colores.textoPrincipal,
      texto: '#ffffff',
      borde: 'transparent',
    },
    peligro: {
      fondo: colores.peligro,
      presionado: '#dc2626',
      texto: '#ffffff',
      borde: 'transparent',
    },
    contorno: {
      fondo: 'transparent',
      presionado: colores.fondoTranslucido,
      texto: colores.primario,
      borde: colores.primario,
    },
  };

  const paleta = mapaVariantes[variante] || mapaVariantes.primario;
  const fondo = colorFondo || paleta.fondo;
  const fondoPresionado = colorPresionado || paleta.presionado;
  const textoColor = colorLetra || paleta.texto;

  return (
    <Pressable
      onPress={onPress}
      disabled={deshabilitado}
      style={({ pressed }) => [
        estilos.boton,
        {
          backgroundColor: pressed ? fondoPresionado : fondo,
          borderColor: paleta.borde,
          borderWidth: variante === 'contorno' ? 1.5 : 0,
          opacity: deshabilitado ? 0.5 : 1,
          width: ancho || undefined,
        },
        style,
      ]}
    >
      <View style={estilos.contenido}>
        {icono ? <View style={estilos.cajaIcono}>{icono}</View> : null}
        <Text style={[estilos.titulo, { color: textoColor, fontSize: tamanoTexto }]}>
          {titulo}
        </Text>
      </View>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  boton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#32AF0A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.16,
    shadowRadius: 4,
    elevation: 2,
  },
  contenido: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cajaIcono: {
    marginRight: 8,
  },
  titulo: {
    fontWeight: '700',
    textAlign: 'center',
  },
});
