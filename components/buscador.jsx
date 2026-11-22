import { TextInput, StyleSheet, View, Pressable } from 'react-native';
import { MagnifyingGlassIcon, XMarkIcon } from 'react-native-heroicons/solid';
import { useTheme } from '../hooks/useTheme';

export default function Buscador({
  placeholder = 'Buscar...',
  valor,
  onChangeText,
  style,
}) {
  const { colores } = useTheme();

  return (
    <View
      style={[
        estilos.contenedor,
        {
          backgroundColor: colores.tarjeta,
          borderColor: colores.bordePrimario,
        },
        style,
      ]}
    >
      <MagnifyingGlassIcon color={colores.primario} size={18} style={estilos.iconoIzq} />
      <TextInput
        style={[estilos.entrada, { color: colores.textoPrincipal }]}
        placeholder={placeholder}
        placeholderTextColor={colores.textoClaro}
        value={valor}
        onChangeText={onChangeText}
        autoCorrect={false}
      />
      {valor ? (
        <Pressable onPress={() => onChangeText('')} hitSlop={8} style={estilos.btnLimpiar}>
          <XMarkIcon color={colores.textoClaro} size={18} />
        </Pressable>
      ) : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    width: '100%',
  },
  iconoIzq: {
    marginRight: 8,
  },
  entrada: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    paddingVertical: 0,
  },
  btnLimpiar: {
    marginLeft: 6,
  },
});
