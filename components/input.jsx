import { TextInput, StyleSheet, View, Text, Pressable } from 'react-native';
import { useTheme } from '../hooks/useTheme';

export default function Input({
  placeholder = '',
  valor,
  onChangeText,
  etiqueta = '',
  esClave = false,
  tipoTeclado = 'default',
  editable = true,
  multilinea = false,
  iconoDerecho,
  onPressIconoDerecho,
  textoAyuda,
  style,
}) {
  const { colores } = useTheme();

  return (
    <View style={[estilos.envoltura, style]}>
      {etiqueta ? (
        <Text style={[estilos.etiqueta, { color: colores.textoPrincipal }]}>{etiqueta}</Text>
      ) : null}
      <View
        style={[
          estilos.contenedor,
          {
            backgroundColor: editable ? colores.fondoForm : colores.fondoContraste,
            borderColor: colores.bordeForm,
            minHeight: multilinea ? 82 : 46,
            alignItems: multilinea ? 'flex-start' : 'center',
          },
        ]}
      >
        <TextInput
          style={[
            estilos.entrada,
            { color: editable ? colores.textoPrincipal : colores.textoClaro },
            multilinea && { textAlignVertical: 'top', paddingTop: 10 },
          ]}
          placeholder={placeholder}
          placeholderTextColor={colores.textoClaro}
          value={valor}
          onChangeText={onChangeText}
          secureTextEntry={esClave}
          keyboardType={tipoTeclado}
          editable={editable}
          multiline={multilinea}
          autoCapitalize={tipoTeclado === 'email-address' ? 'none' : 'sentences'}
        />
        {iconoDerecho ? (
          <Pressable onPress={onPressIconoDerecho} hitSlop={8} style={estilos.iconoDer}>
            {iconoDerecho}
          </Pressable>
        ) : null}
      </View>
      {textoAyuda ? (
        <Text style={[estilos.ayuda, { color: colores.textoClaro }]}>{textoAyuda}</Text>
      ) : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  envoltura: {
    width: '100%',
    marginBottom: 12,
  },
  etiqueta: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
    marginLeft: 2,
  },
  contenedor: {
    flexDirection: 'row',
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  entrada: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    paddingVertical: 10,
  },
  iconoDer: {
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ayuda: {
    fontSize: 11,
    marginTop: 4,
    marginLeft: 2,
  },
});
